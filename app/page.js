"use client";

import { useRef, useState } from "react";

const SPORTS = [
  { id: "futevolei", en: "Footvolley", pt: "Futevôlei", img: "/sports/futevolei.png" },
  { id: "beach_tennis", en: "Beach Tennis", pt: "Beach Tennis", img: "/sports/beach-tennis.png" },
  { id: "tenis", en: "Tennis", pt: "Tênis", img: "/sports/tenis.png" },
  { id: "volei_praia", en: "Beach Volleyball", pt: "Vôlei de Praia", img: "/sports/volei-de-praia.png" },
];

const TIERS = ["Areia", "Bronze", "Prata", "Ouro", "Platina", "Diamante", "Elite", "Lenda"];
const TIER_EN = {
  Areia: "Sand", Bronze: "Bronze", Prata: "Silver", Ouro: "Gold",
  Platina: "Platinum", Diamante: "Diamond", Elite: "Elite", Lenda: "Legend",
};

const T = {
  en: {
    tagline: "The AI announcer for beach-sport duels",
    live: "LIVE",
    sport: "Sport",
    duel: "The duel",
    sideA: "SIDE A",
    sideB: "SIDE B",
    phA: 'Player or team (e.g. "Vini & Pedrão")',
    phB: 'Player or team (e.g. "Rafa & Careca")',
    moment: "Match moment",
    phMoment: 'e.g. "17-16, match point, blazing sun"',
    rivalry: "Rivalry / context",
    phRivalry: 'e.g. "rematch after last Sunday\'s comeback"',
    go: "🎙 CALL THE DUEL",
    example: "⚡ Try an example",
    writing: "The announcer is writing...",
    voicing: "Warming up the voice...",
    narration: "Play-by-play",
    writingStatus: "The announcer is writing the call...",
    voicingStatus: "Bringing in the announcer's voice...",
    footer1: "Built with passion for the futevôlei crew · part of the",
    footer2: "universe · Gemini writes, ElevenLabs calls it",
  },
  pt: {
    tagline: "O locutor de IA dos duelos de praia",
    live: "AO VIVO",
    sport: "Esporte",
    duel: "O duelo",
    sideA: "LADO A",
    sideB: "LADO B",
    phA: 'Jogador ou dupla (ex: "Vini e Pedrão")',
    phB: 'Jogador ou dupla (ex: "Rafa e Careca")',
    moment: "Momento do jogo",
    phMoment: 'Ex: "17 a 16, match point, sol rachando"',
    rivalry: "Rivalidade / contexto",
    phRivalry: 'Ex: "revanche da virada de domingo passado"',
    go: "🎙 NARRAR DUELO",
    example: "⚡ Ver um exemplo",
    writing: "O locutor está escrevendo...",
    voicing: "Aquecendo a voz...",
    narration: "Narração",
    writingStatus: "O locutor está escrevendo a chamada do duelo...",
    voicingStatus: "Colocando a voz do locutor...",
    footer1: "Feito com paixão pelo grupo de futevôlei · parte do universo",
    footer2: "· Gemini escreve, ElevenLabs narra",
  },
};

export default function Home() {
  const [lang, setLang] = useState("en");
  const [sport, setSport] = useState("futevolei");
  const [teamA, setTeamA] = useState("");
  const [tierA, setTierA] = useState("Prata");
  const [teamB, setTeamB] = useState("");
  const [tierB, setTierB] = useState("Ouro");
  const [score, setScore] = useState("");
  const [rivalry, setRivalry] = useState("");
  const [phase, setPhase] = useState("idle");
  const [narration, setNarration] = useState("");
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const t = T[lang];
  const busy = phase === "writing" || phase === "voicing";
  const tierLabel = (tier) => (lang === "en" ? TIER_EN[tier] || tier : tier);

  function runExample() {
    const EXAMPLES = {
      futevolei: {
        teamA: "Vini & Pedrão", tierA: "Prata",
        teamB: "Rafa & Careca", tierB: "Ouro",
        score: { en: "17-16, match point, blazing sun", pt: "17 a 16, match point, sol rachando" },
        rivalry: {
          en: "rematch after last Sunday's comeback on the sand",
          pt: "revanche da virada de domingo passado na areia",
        },
      },
      beach_tennis: {
        teamA: "Duda & Marina", tierA: "Ouro",
        teamB: "Léo & Bia", tierB: "Platina",
        score: { en: "6-5 in the tiebreak, golden point", pt: "6 a 5 no tie-break, ponto de ouro" },
        rivalry: {
          en: "two weeks of trash talk in the group chat led to this",
          pt: "duas semanas de provocação no grupo terminam aqui",
        },
      },
      tenis: {
        teamA: "Serginho", tierA: "Bronze",
        teamB: "Guga Jr.", tierB: "Diamante",
        score: { en: "5-4 in the third set, the underdog is serving for the match", pt: "5 a 4 no terceiro set, a zebra sacando para o jogo" },
        rivalry: {
          en: "the club upset of the year, one game away",
          pt: "a zebra do ano no clube, a um game de acontecer",
        },
      },
      volei_praia: {
        teamA: "Talita & Ju", tierA: "Elite",
        teamB: "Carol & Fê", tierB: "Elite",
        score: { en: "14-14 in the deciding set, next point takes it all", pt: "14 a 14 no set decisivo, quem fizer leva tudo" },
        rivalry: {
          en: "the all-Elite grudge match, five wins each this season",
          pt: "clássico de Elites, cinco vitórias para cada só este ano",
        },
      },
    };
    const e = EXAMPLES[sport] || EXAMPLES.futevolei;
    const ex = {
      sport,
      teamA: e.teamA, tierA: e.tierA,
      teamB: e.teamB, tierB: e.tierB,
      score: e.score[lang], rivalry: e.rivalry[lang],
    };
    setTeamA(ex.teamA);
    setTierA(ex.tierA);
    setTeamB(ex.teamB);
    setTierB(ex.tierB);
    setScore(ex.score);
    setRivalry(ex.rivalry);
    narrate(ex);
  }

  async function narrate(override) {
    if (busy) return;
    const p = override || { sport, teamA, tierA, teamB, tierB, score, rivalry };
    setError("");
    setNarration("");
    setPhase("writing");
    if (audioRef.current) audioRef.current.removeAttribute("src");
    try {
      const res = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate the call.");
      setNarration(data.text);
      setPhase("voicing");

      const vres = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.text, lang }),
      });
      if (!vres.ok) {
        const vdata = await vres.json().catch(() => ({}));
        throw new Error(vdata.error || "Failed to generate the voice.");
      }
      const blob = await vres.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
      setPhase("done");
    } catch (e) {
      setError(e.message);
      setPhase(narration ? "done" : "error");
    }
  }

  const sportLabel = SPORTS.find((s) => s.id === sport)?.[lang] || "";

  return (
    <div className="wrap">
      <header>
        <img src="/logo-icon.png" alt="DuelUp" />
        <div className="t">
          <b>
            DuelUp <i>Live</i>
          </b>
          <span>{t.tagline}</span>
        </div>
        <span className="live">
          <i /> {t.live}
        </span>
      </header>

      <div className="card">
        <span className="lbl">{t.sport}</span>
        <div className="sports">
          {SPORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={"sport" + (sport === s.id ? " on" : "")}
              onClick={() => setSport(s.id)}
            >
              <img src={s.img} alt="" />
              <span>{s[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <span className="lbl">{t.duel}</span>
        <div className="teams">
          <div className="team">
            <div className="tt">{t.sideA}</div>
            <input type="text" placeholder={t.phA} value={teamA} onChange={(e) => setTeamA(e.target.value)} maxLength={60} />
            <div className="tiersel">
              <img src={`/tiers/${tierA.toLowerCase()}.png`} alt="" />
              <select value={tierA} onChange={(e) => setTierA(e.target.value)}>
                {TIERS.map((tr) => (
                  <option key={tr} value={tr}>{tierLabel(tr)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="vs">VS</div>
          <div className="team">
            <div className="tt">{t.sideB}</div>
            <input type="text" placeholder={t.phB} value={teamB} onChange={(e) => setTeamB(e.target.value)} maxLength={60} />
            <div className="tiersel">
              <img src={`/tiers/${tierB.toLowerCase()}.png`} alt="" />
              <select value={tierB} onChange={(e) => setTierB(e.target.value)}>
                {TIERS.map((tr) => (
                  <option key={tr} value={tr}>{tierLabel(tr)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row2" style={{ marginTop: 12 }}>
          <div>
            <span className="lbl" style={{ marginTop: 6 }}>{t.moment}</span>
            <input type="text" placeholder={t.phMoment} value={score} onChange={(e) => setScore(e.target.value)} maxLength={120} />
          </div>
          <div>
            <span className="lbl" style={{ marginTop: 6 }}>{t.rivalry}</span>
            <input type="text" placeholder={t.phRivalry} value={rivalry} onChange={(e) => setRivalry(e.target.value)} maxLength={160} />
          </div>
        </div>

        <div className="actions">
          <div className="langs">
            <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button type="button" className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")}>PT-BR</button>
          </div>
          <button type="button" className="example" onClick={runExample} disabled={busy}>
            {t.example}
          </button>
          <button className="go" onClick={() => narrate()} disabled={busy}>
            {phase === "writing" ? t.writing : phase === "voicing" ? t.voicing : t.go}
          </button>
        </div>
      </div>

      {(busy || narration || error) && (
        <div className="card result">
          <span className="lbl">{t.narration} · {sportLabel}</span>
          {phase === "writing" && (
            <div className="status"><i /> {t.writingStatus}</div>
          )}
          {narration && <p className="narr">{narration}</p>}
          {phase === "voicing" && (
            <div className="status" style={{ marginTop: 14 }}><i /> {t.voicingStatus}</div>
          )}
          {error && <p className="err" style={{ marginTop: 12 }}>{error}</p>}
          <audio ref={audioRef} controls />
        </div>
      )}

      <footer>
        {t.footer1}{" "}
        <a href="https://www.duelup.app" target="_blank" rel="noreferrer">DuelUp</a>{" "}
        {t.footer2}
      </footer>
    </div>
  );
}
