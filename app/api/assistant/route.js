const SYSTEM_PROMPT = `You are the Ration Saathi Assistant, a helpful guide embedded in an Indian ration card
management app. You help citizens understand:
- How to apply for a new ration card, add a family member, update an address, or replace a lost card
- What documents are typically needed (ID proof, address proof, photograph, birth certificate)
- How the Public Distribution System (PDS) and fair price shops work
- How fair price shop slot bookings work, including the booking code shown after booking
- How to interpret application statuses (New, Submitted, Under Review, Approved, Needs Correction)

Keep answers short, plain, and friendly, in 2-4 sentences unless the user asks for more detail.
Do not ask for or store Aadhar numbers or other sensitive personal identifiers. If you don't know
a state-specific rule, say so honestly and suggest they check with their local ration office.`;

// Fast, free-tier model first (keeps the live-demo experience snappy);
// Nemotron as a stronger fallback if the primary model is rate-limited or
// unavailable. Both are free models on OpenRouter as of writing — swap
// these strings any time from https://openrouter.ai/models.
const PRIMARY_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
const FALLBACK_MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct:free';

async function callOpenRouter(apiKey, model, message) {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // OpenRouter asks for these two headers for attribution/rankings;
      // they're optional but good practice, update the referer if you
      // deploy under a different domain.
      'HTTP-Referer': 'https://ration-saathi-sigma.vercel.app',
      'X-Title': 'Ration Saathi',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      stream: true,
    }),
  });
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response('Please include a message.', { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(
        'The AI assistant is not configured yet. Add an OPENROUTER_API_KEY in your .env file to enable it.',
        { status: 503 }
      );
    }

    let upstream = await callOpenRouter(apiKey, PRIMARY_MODEL, message);
    if (!upstream.ok) {
      console.warn(`Model ${PRIMARY_MODEL} failed (${upstream.status}), retrying with ${FALLBACK_MODEL}`);
      upstream = await callOpenRouter(apiKey, FALLBACK_MODEL, message);
    }
    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '');
      console.error('OpenRouter error:', upstream.status, errText);
      return new Response('Sorry, something went wrong reaching the assistant. Please try again.', { status: 502 });
    }

    // OpenRouter streams OpenAI-style Server-Sent Events: lines like
    // "data: {json}\n\n", ending with "data: [DONE]". We re-parse those
    // into a plain text stream the client can just append to the screen.
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const reader = upstream.body.getReader();
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep the last (possibly partial) line for next chunk
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const payload = trimmed.slice(5).trim();
              if (payload === '[DONE]') continue;
              try {
                const json = JSON.parse(payload);
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch {
                // ignore keep-alive/malformed lines
              }
            }
          }
          controller.close();
        } catch (err) {
          console.error('OpenRouter stream error:', err);
          controller.enqueue(
            encoder.encode('Sorry, something went wrong reaching the assistant. Please try again.')
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Assistant route error:', err?.message || err);
    return new Response('Something went wrong. Please try again.', { status: 500 });
  }
}
