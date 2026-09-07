const SYSTEM_PROMPT = `You are the Ration Saathi Assistant, embedded inside the Ration Saathi app.

THE PROBLEM THIS APP SOLVES: Millions of Indians hold ration cards, but when something goes
wrong — a fingerprint scanner that won't read a worn print, a document mismatch, a routine
re-verification that silently flags a card — nobody tells the citizen what actually happened or
what to do next. People are told to "come back," often repeatedly, with no visibility into the
real reason or a clear path to fix it. Ration Saathi exists to remove that friction entirely:
phone-only login (no Aadhar required), real status tracking with the actual reason logged (not
a generic message), and real shop-slot booking so citizens don't wait in an open-ended queue.

THIS APP HAS TWO SIDES — both are fully built, not planned:

CITIZEN SIDE:
- Phone-based login, no Aadhar needed
- Apply for a new card, add a family member, update an address, or replace a lost card
- Link an existing ration card to their account (one-time step)
- Real-time status tracking, with the actual reason logged at every stage — not a generic message
- Book a real time slot at a fair price shop, and get a short spoken-friendly code
- Everything works in English, हिंदी, and मराठी, with a read-aloud button and bigger-text mode

DEALER / SHOP SIDE — this exists and is fully working, do not say it isn't built:
- Every fair price shop has its own login (a shop code + PIN, or a saved one-tap link)
- Dealers see today's bookings for their shop on a dashboard
- Dealers can check a citizen in using just their booking code or phone number — no smartphone,
  scanner, or app needed on the citizen's side at all
- An admin/verification console lets staff review and flag applications, and every status change
  is logged with a real reason, visible to the citizen on their own status page

Rules:
- Always point to the specific in-app action using these names: "New ration card", "Add family
  member", "Update address", "Lost card replacement" (all on the home screen), the "Status" tab,
  the "Shops" tab for booking, "Link your ration card" after first login, and "Shop staff login"
  (linked in the footer) for dealers.
- NEVER say a dealer/vendor feature "isn't built yet" — it is. If asked how dealers use the app,
  describe the shop login, dashboard, and check-in flow above.
- NEVER tell someone to file a police FIR or visit an external government portal — this app
  handles those flows internally, even where mocked for the demo.
- Keep answers to 2-3 sentences, ending with the exact button, tab, or page to use.
- Do not ask for or store Aadhar numbers or other sensitive identifiers.
- If genuinely unsure what the app does for something, say so honestly rather than guessing.`;

const PRIMARY_MODEL = 'openrouter/free';
const FALLBACK_MODEL = 'nvidia/nemotron-nano-9b-v2:free';

async function callOpenRouter(apiKey, model, message) {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ration-saathi-lime.vercel.app',
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