const SPORT_LABELS = {
  futevolei: { pt: "futevôlei", en: "footvolley" },
  beach_tennis: { pt: "beach tennis", en: "beach tennis" },
  tenis: { pt: "tênis", en: "tennis" },
  volei_praia: { pt: "vôlei de praia", en: "beach volleyball" },
};

function buildPrompt({ sport, teamA, tierA, teamB, tierB, score, rivalry, lang }) {
  const s = SPORT_LABELS[sport] || SPORT_LABELS.futevolei;
  const a = teamA?.trim() || (lang === "pt" ? "Lado A" : "Side A");
  const b = teamB?.trim() || (lang === "pt" ? "Lado B" : "Side B");
  const setting = sport === "tenis" ? { en: "on the court", pt: "na quadra" } : { en: "on the sand", pt: "na areia" };

  if (lang === "en") {
    return `You are an electrifying Brazilian sports announcer narrating live, in ENGLISH, with that unmistakable Brazilian passion.

Write a LIVE match call for a ${s.en} duel ${setting.en}:
- Side A: ${a} (rank tier: ${tierA})
- Side B: ${b} (rank tier: ${tierB})
${score?.trim() ? `- Match moment: ${score.trim()}` : ""}
${rivalry?.trim() ? `- Rivalry context: ${rivalry.trim()}` : ""}

Rules:
- 90 to 120 words. It will be read aloud by a TTS voice, so write for the EAR.
- Present tense, breathless play-by-play energy, short punchy sentences, exclamations.
- Weave in the rank tiers as drama (underdog vs favorite when they differ).
- Use the players' names or nicknames naturally and often.
- End with one explosive line that gives chills.
- Output ONLY the narration text. No stage directions, no emojis, no quotes, no headings.`;
  }

  return `Você é um locutor esportivo brasileiro elétrico, narrando AO VIVO ${setting.pt}, estilo narração de rádio: rápido, apaixonado, arrepiante.

Escreva a narração de um duelo de ${s.pt}:
- Lado A: ${a} (elo/tier: ${tierA})
- Lado B: ${b} (elo/tier: ${tierB})
${score?.trim() ? `- Momento do jogo: ${score.trim()}` : ""}
${rivalry?.trim() ? `- Rivalidade/contexto: ${rivalry.trim()}` : ""}

Regras:
- 90 a 120 palavras. Vai ser lida em voz alta por um narrador de TTS, então escreva para o OUVIDO.
- Tempo presente, frases curtas e explosivas, exclamações, energia de lance a lance.
- Use os tiers como drama (azarão contra favorito quando forem diferentes).
- Use os nomes/apelidos dos jogadores com frequência e naturalidade.
- Termine com UMA frase de arrepiar.
- Responda SOMENTE com o texto da narração. Sem rubricas, sem emojis, sem aspas, sem títulos.`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
      return Response.json({ error: "GOOGLE_API_KEY ausente no servidor." }, { status: 500 });
    }

    const prompt = buildPrompt(body || {});

    // Model cascade: if one is overloaded (503/429), fall through to the next.
    const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.0-flash"];
    let res = null;
    for (const model of MODELS) {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 1.0,
              maxOutputTokens: 1024,
              ...(model.startsWith("gemini-2.0") ? {} : { thinkingConfig: { thinkingBudget: 0 } }),
            },
          }),
        }
      );
      if (res.ok) break;
      const detail = await res.text();
      console.error("gemini error", model, res.status, detail.slice(0, 200));
      if (res.status !== 503 && res.status !== 429) break;
    }

    if (!res || !res.ok) {
      return Response.json({ error: "O locutor engasgou (Gemini). Tenta de novo." }, { status: 502 });
    }

    const data = await res.json();
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("")
      .trim();

    if (!text) {
      return Response.json({ error: "Narração vazia. Tenta de novo." }, { status: 502 });
    }
    return Response.json({ text });
  } catch (e) {
    console.error("narrate error", e);
    return Response.json({ error: "Erro inesperado ao narrar." }, { status: 500 });
  }
}
