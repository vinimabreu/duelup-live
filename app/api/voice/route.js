// Voice: Eduardo S. (Brazilian, clear & pro) for PT; Charlie (deep, energetic) for EN.
const VOICES = {
  pt: "4J31DrhygVjvFsoj7BsM",
  en: "IKne3meq5aSn9XLyUdCD",
};

export async function POST(req) {
  try {
    const { text, lang } = await req.json();
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) {
      return Response.json({ error: "ELEVENLABS_API_KEY ausente no servidor." }, { status: 500 });
    }
    if (!text?.trim()) {
      return Response.json({ error: "Sem texto para narrar." }, { status: 400 });
    }

    const voiceId = VOICES[lang] || VOICES.pt;
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.slice(0, 2400),
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.32,
            similarity_boost: 0.8,
            style: 0.6,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("elevenlabs error", res.status, detail.slice(0, 300));
      return Response.json({ error: "A voz falhou (ElevenLabs). Tenta de novo." }, { status: 502 });
    }

    return new Response(res.body, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("voice error", e);
    return Response.json({ error: "Erro inesperado na voz." }, { status: 500 });
  }
}
