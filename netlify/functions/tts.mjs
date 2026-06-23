import { EdgeTTS } from 'edge-tts-universal';

const VOICE = 'en-US-AndrewMultilingualNeural';
const MAX_CHARS = 400;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), {
      status: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { text } = body;
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const trimmed = text.trim().slice(0, MAX_CHARS);
    if (!trimmed) {
      return new Response(JSON.stringify({ error: 'text is empty' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const voice =
      typeof body?.voice === 'string' && body.voice.trim()
        ? body.voice.trim()
        : VOICE;

    const tts = new EdgeTTS(trimmed, voice);
    const { audio } = await tts.synthesize();
    const buffer = Buffer.from(await audio.arrayBuffer());

    return new Response(buffer, {
      status: 200,
      headers: {
        ...cors,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'TTS failed' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
};
