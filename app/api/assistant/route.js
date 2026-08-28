import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are the Ration Saathi Assistant, a helpful guide embedded in an Indian ration card
management app. You help citizens understand:
- How to apply for a new ration card, add a family member, update an address, or replace a lost card
- What documents are typically needed (ID proof, address proof, photograph, birth certificate)
- How the Public Distribution System (PDS) and fair price shops work
- How to interpret application statuses (New, Submitted, Under Review, Approved, Needs Correction)

Keep answers short, plain, and friendly, in 2-4 sentences unless the user asks for more detail.
Do not ask for or store Aadhar numbers or other sensitive personal identifiers. If you don't know
a state-specific rule, say so honestly and suggest they check with their local ration office.`;

const MODEL = 'gemini-3.7-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash';

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response('Please include a message.', { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        'The AI assistant is not configured yet. Add a GEMINI_API_KEY in your .env file to enable it.',
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const config = {
      systemInstruction: SYSTEM_PROMPT,
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    let response;
    try {
      response = await ai.models.generateContentStream({ model: MODEL, contents: message, config });
    } catch (err) {
      // If the primary model name isn't available on this key/region, fall back
      // to a known-stable model instead of failing the whole request.
      console.warn(`Model ${MODEL} failed, retrying with ${FALLBACK_MODEL}:`, err?.message || err);
      response = await ai.models.generateContentStream({ model: FALLBACK_MODEL, contents: message, config });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          console.error('Gemini stream error:', err);
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
