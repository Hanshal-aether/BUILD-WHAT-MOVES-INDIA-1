const SYSTEM_PROMPT = `You are the Ration Saathi Assistant, embedded inside the Ration Saathi app.
Your ONLY job is to help the person use THIS APP to solve their problem — not to explain the
general Indian PDS/government process from scratch. Assume they are already looking at the app
and want to know what to click.

When answering, always point to the specific in-app action, using these exact names:
- New ration card → the "New ration card" card on the home screen, or /apply/new-card
- Add a family member → "Add family member" on the home screen, or /apply/add-member
- Update an address → "Update address" on the home screen, or /apply/update-address
- Lost card replacement → "Lost card replacement" on the home screen, or /apply/lost-card
- Checking an application → the "Status" tab, which shows real-time status and history
- Booking a slot at a fair price shop → the "Shops" tab, then "Book a slot" on any shop
- Linking a ration card to their account → the one-time "Link your ration card" step after login

Rules:
- NEVER tell someone to file a police FIR, visit an external government portal (like nfsa.gov.in),
  or visit a physical ration office — this app handles those flows internally, even if mocked.
  If they ask about something outside what the app currently does, say plainly that this feature
  isn't built yet, rather than redirecting them to a real-world government process.
- Keep answers to 2-3 sentences. Always end by naming the exact button, tab, or page.
- Do not ask for or store Aadhar numbers or other sensitive personal identifiers.
- If truly unsure what the app does for something, say so honestly rather than guessing.`;

// Free-tier model IDs on OpenRouter rotate in and out without warning (a
// model that works today can 404 next week when it's retired). Primary is
// OpenRouter's own "free model router" — it auto-selects whichever free
// model is currently live, so it can't go stale the way a hardcoded ID can.
// The fallback is a second hardcoded free model in case the router itself
// has an issue, kept only as a backstop.
const PRIMARY_MODEL = 'openrouter/free';
const FALLBACK_MODEL = 'nvidia/nemotron-nano-9b-v2:free';

async function callOpenRouter(apiKey, model, message) {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
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

    const apiKey = (process.env.OPENROUTER_API_KEY || '').trim().replace(/^["']|["']$/g, '');
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
      let reason = '';
      try {
        reason = JSON.parse(errText)?.error?.message || '';
      } catch {}
      const hint =
        upstream.status === 401
          ? ' (401 = the OPENROUTER_API_KEY on this deployment is missing, wrong, or not applied to this environment yet — check Vercel → Settings → Environment Variables, then redeploy.)'
          : '';
      return new Response(
        `Sorry, the assistant couldn't be reached${reason ? `: ${reason}` : ''}.${hint}`,
        { status: 502 }
      );
    }

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
            buffer = lines.pop();
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const payload = trimmed.slice(5).trim();
              if (payload === '[DONE]') continue;
              try {
                const json = JSON.parse(payload);
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch {}
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