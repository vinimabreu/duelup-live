"use client";

import { useRef, useState } from "react";

const SPORTS = [
  { id: "futevolei", en: "Footvolley", pt: "Futevôlei", emoji: "⚽" },
  { id: "beach_tennis", en: "Beach Tennis", pt: "Beach Tennis", emoji: "🎾" },
  { id: "tenis", en: "Tennis", pt: "Tênis", emoji: "🥎" },
  { id: "volei_praia", en: "Beach Volleyball", pt: "Vôlei de Praia", emoji: "🏐" },
];

const TIERS = ["Areia", "Bronze", "Prata", "Ouro", "Platina", "Diamante", "Elite", "Lenda"];
const TIER_EN = {
  Areia: "Sand", Bronze: "Bronze", Prata: "Silver", Ouro: "Gold",
  Platina: "Platinum", Diamante: "Diamond", Elite: "Elite", Lenda: "Legend",
};

const WAVE_SEED = [0.4,0.7,0.55,0.85,0.3,0.6,0.9,0.45,0.75,0.5,0.65,0.35,0.8,0.55,0.7,0.4,0.6,0.95,0.5,0.7,0.3,0.6,0.8,0.45,0.65,0.55,0.75,0.35,0.6,0.5,0.7,0.4];

const T = {
  en: {
    presents: "PRESENTS · TONIGHT ON THE SAND",
    mainevent: "THE MAIN EVENT",
    sideA: "SIDE A",
    sideB: "SIDE B",
    rank: "RANK",
    phA: "PLAYER OR TEAM",
    phB: "PLAYER OR TEAM",
    tape: "TALE OF THE TAPE",
    moment: "The moment",
    phMoment: '"17-16, match point, blazing sun"',
    rivalry: "The bad blood",
    phRivalry: '"rematch after last Sunday\'s comeback"',
    example: "⚡ Example",
    go: "🔔 RING THE BELL",
    theCall: "AND THE CALL IS",
    idleHint: "Ring the bell and the AI announcer opens the card.",
    note: "Live demo: every ring is a fresh call, written and voiced on the spot. The same duel never sounds the same twice. Allow ~20 seconds.",
    writing: "THE ANNOUNCER IS WRITING THE CARD…",
    voicing: "WARMING UP THE VOICE…",
    footer: "Futevôlei crew · DuelUp universe · Gemini writes · ElevenLabs calls it",
  },
  pt: {
    presents: "APRESENTA · HOJE NA AREIA",
    mainevent: "O EVENTO PRINCIPAL",
    sideA: "LADO A",
    sideB: "LADO B",
    rank: "ELO",
    phA: "JOGADOR OU DUPLA",
    phB: "JOGADOR OU DUPLA",
    tape: "FICHA DO CONFRONTO",
    moment: "O momento",
    phMoment: '"17 a 16, match point, sol rachando"',
    rivalry: "A rivalidade",
    phRivalry: '"revanche da virada de domingo passado"',
    example: "⚡ Exemplo",
    go: "🔔 TOCAR O SINO",
    theCall: "E A NARRAÇÃO É",
    idleHint: "Toque o sino e o locutor de IA abre o card.",
    note: "Demo ao vivo: cada sino gera uma narração nova, escrita e narrada na hora. O mesmo duelo nunca sai igual duas vezes. Leva ~20 segundos.",
    writing: "O LOCUTOR ESTÁ ESCREVENDO O CARD…",
    voicing: "AQUECENDO A VOZ…",
    footer: "Grupo de futevôlei · universo DuelUp · Gemini escreve · ElevenLabs narra",
  },
};

const EXAMPLES = {
  futevolei: [
    {
      teamA: "Vini & Pedrão", tierA: "Prata",
      teamB: "Rafa & Careca", tierB: "Ouro",
      score: { en: "17-16, match point, blazing sun", pt: "17 a 16, match point, sol rachando" },
      rivalry: {
        en: "rematch after last Sunday's comeback on the sand",
        pt: "revanche da virada de domingo passado na areia",
      },
    },
    {
      teamA: "Juninho & Tato", tierA: "Areia",
      teamB: "Formiga & Xandão", tierB: "Lenda",
      score: { en: "7-3 for the rookies, the whole beach in shock", pt: "7 a 3 pros novatos, a praia inteira em choque" },
      rivalry: {
        en: "the Legends have never lost on this sand",
        pt: "os Lendas nunca perderam nessa areia",
      },
    },
    {
      teamA: "Bruninho & Léo", tierA: "Ouro",
      teamB: "Pipo & Guga", tierB: "Ouro",
      score: { en: "18-18, the longest rally of the year just happened", pt: "18 a 18, o rally mais longo do ano acabou de acontecer" },
      rivalry: {
        en: "five straight Sundays, five deciding sets",
        pt: "cinco domingos seguidos, cinco tie-breaks",
      },
    },
  ],
  beach_tennis: [
    {
      teamA: "Duda & Marina", tierA: "Ouro",
      teamB: "Léo & Bia", tierB: "Platina",
      score: { en: "6-5 in the tiebreak, golden point", pt: "6 a 5 no tie-break, ponto de ouro" },
      rivalry: {
        en: "two weeks of trash talk in the group chat led to this",
        pt: "duas semanas de provocação no grupo terminam aqui",
      },
    },
    {
      teamA: "Carlão & Mel", tierA: "Prata",
      teamB: "Nina & Duds", tierB: "Diamante",
      score: { en: "4-1 for the Silver pair, an upset is brewing", pt: "4 a 1 pra dupla de Prata, zebra no forno" },
      rivalry: {
        en: "the Diamonds called this one an easy warm-up",
        pt: "os Diamantes chamaram esse jogo de aquecimento",
      },
    },
    {
      teamA: "Bia & Ju", tierA: "Platina",
      teamB: "Marina & Carol", tierB: "Platina",
      score: { en: "golden point for the title of the month", pt: "ponto de ouro valendo o título do mês" },
      rivalry: {
        en: "ex-partners on opposite sides for the first time",
        pt: "ex-parceiras frente a frente pela primeira vez",
      },
    },
  ],
  tenis: [
    {
      teamA: "Serginho", tierA: "Bronze",
      teamB: "Guga Jr.", tierB: "Diamante",
      score: { en: "5-4 in the third set, the underdog is serving for the match", pt: "5 a 4 no terceiro set, a zebra sacando para o jogo" },
      rivalry: {
        en: "the club upset of the year, one game away",
        pt: "a zebra do ano no clube, a um game de acontecer",
      },
    },
    {
      teamA: "Kiko", tierA: "Prata",
      teamB: "Dona Val", tierB: "Ouro",
      score: { en: "tiebreak in the second, momentum flipping every point", pt: "tie-break no segundo set, o jogo virando a cada ponto" },
      rivalry: {
        en: "student against coach, the debt gets settled today",
        pt: "aluno contra treinadora, a conta se acerta hoje",
      },
    },
    {
      teamA: "Maurição", tierA: "Elite",
      teamB: "Pedrinho", tierB: "Elite",
      score: { en: "deuce at 5-5, third set, floodlights on", pt: "iguais, 5 a 5 no terceiro set, refletores acesos" },
      rivalry: {
        en: "eleven meetings, eleven three-set wars",
        pt: "onze confrontos, onze batalhas de três sets",
      },
    },
  ],
  volei_praia: [
    {
      teamA: "Talita & Ju", tierA: "Elite",
      teamB: "Carol & Fê", tierB: "Elite",
      score: { en: "14-14 in the deciding set, next point takes it all", pt: "14 a 14 no set decisivo, quem fizer leva tudo" },
      rivalry: {
        en: "the all-Elite grudge match, five wins each this season",
        pt: "clássico de Elites, cinco vitórias para cada só este ano",
      },
    },
    {
      teamA: "Gigante & Fabi", tierA: "Bronze",
      teamB: "Lu & Paula", tierB: "Lenda",
      score: { en: "set point for the Bronze pair, nobody believes it", pt: "set point pra dupla de Bronze, ninguém acredita" },
      rivalry: {
        en: "the Legends have not dropped a set all season",
        pt: "as Lendas não perderam um set na temporada inteira",
      },
    },
    {
      teamA: "Duda & Vitó", tierA: "Diamante",
      teamB: "Renata & Bel", tierB: "Ouro",
      score: { en: "15-13, hands shaking, wind picking up", pt: "15 a 13, mãos tremendo, vento aumentando" },
      rivalry: {
        en: "loser buys açaí for the whole crew",
        pt: "quem perder paga açaí pra galera toda",
      },
    },
  ],
};

function fmt(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

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
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const audioRef = useRef(null);
  const exIdx = useRef({});

  const t = T[lang];
  const busy = phase === "writing" || phase === "voicing";
  const tierLabel = (tier) => (lang === "en" ? TIER_EN[tier] || tier : tier);
  const sportLabel = (SPORTS.find((s) => s.id === sport)?.[lang] || "").toUpperCase();

  function runExample() {
    const list = EXAMPLES[sport] || EXAMPLES.futevolei;
    const idx = ((exIdx.current[sport] ?? -1) + 1) % list.length;
    exIdx.current[sport] = idx;
    const e = list[idx];
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
    setPlaying(false);
    setCur(0);
    setDur(0);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
    }
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
      if (audio) {
        audio.src = url;
        audio.play().catch(() => {});
      }
      setPhase("done");
    } catch (e) {
      setError(e.message);
      setPhase(narration ? "done" : "error");
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  const progress = dur > 0 ? (cur / dur) * 100 : 0;

  return (
    <div className="stage">
      <div className="bill">
        <div className="texture" aria-hidden="true" />
        <div className="inner">

          <div className="plate">
            <span className="dot" aria-hidden="true" />
            <img src="/logo.png" alt="DuelUp Live" className="platelogo" />
            <span className="dot" aria-hidden="true" />
          </div>
          <div className="presents mono">{t.presents}</div>

          <div className="mainevent">{t.mainevent} · <em>{sportLabel}</em></div>
          <div className="rule" />

          <div className="stamps">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={"stamp mono" + (sport === s.id ? " on" : "")}
                onClick={() => setSport(s.id)}
              >
                <span className="emo">{s.emoji}</span>
                <span>{s[lang]}</span>
              </button>
            ))}
          </div>

          <div className="versus">
            <div className="side">
              <div className="klabel mono">{t.sideA}</div>
              <input
                type="text"
                className="fighter"
                placeholder={t.phA}
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                maxLength={60}
              />
              <div className="rank">
                <span className="ranklabel">{t.rank}</span>
                <img src={`/tiers/${tierA.toLowerCase()}.png`} alt="" className="badge" />
                <select value={tierA} onChange={(e) => setTierA(e.target.value)} className="mono">
                  {TIERS.map((tr) => (
                    <option key={tr} value={tr}>{tierLabel(tr)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="vs">VS</div>

            <div className="side b">
              <div className="klabel mono">{t.sideB}</div>
              <input
                type="text"
                className="fighter"
                placeholder={t.phB}
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                maxLength={60}
              />
              <div className="rank">
                <select value={tierB} onChange={(e) => setTierB(e.target.value)} className="mono">
                  {TIERS.map((tr) => (
                    <option key={tr} value={tr}>{tierLabel(tr)}</option>
                  ))}
                </select>
                <img src={`/tiers/${tierB.toLowerCase()}.png`} alt="" className="badge" />
                <span className="ranklabel">{t.rank}</span>
              </div>
            </div>
          </div>

          <div className="rule" />

          <div className="tapehead">{t.tape}</div>
          <div className="taperow">
            <span className="tapelabel mono">{t.moment}</span>
            <span className="dots" />
            <input
              type="text"
              className="tapeinput"
              placeholder={t.phMoment}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="taperow">
            <span className="tapelabel mono">{t.rivalry}</span>
            <span className="dots" />
            <input
              type="text"
              className="tapeinput"
              placeholder={t.phRivalry}
              value={rivalry}
              onChange={(e) => setRivalry(e.target.value)}
              maxLength={160}
            />
          </div>

          <div className="rule" />

          <div className="controls">
            <div className="langbox">
              <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
              <button type="button" className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")}>PT-BR</button>
            </div>
            <button type="button" className="exbtn mono" onClick={runExample} disabled={busy}>
              {t.example}
            </button>
            <button type="button" className="bell" onClick={() => narrate()} disabled={busy}>
              {t.go}
            </button>
          </div>

          <div className="rule" />

          <div className="tapehead">{t.theCall} · <em>{sportLabel}</em></div>
          <div className="demonote mono">{t.note}</div>

          {phase === "idle" && <div className="idlehint">{t.idleHint}</div>}
          {phase === "writing" && <div className="phaseline">{t.writing}</div>}
          {narration && <p className="call">{narration}</p>}
          {phase === "voicing" && <div className="phaseline" style={{ marginTop: 14 }}>{t.voicing}</div>}
          {error && <p className="err mono">{error}</p>}

          {phase === "done" && (
            <div className="player">
              <button type="button" className="playbtn" onClick={togglePlay}>
                {playing ? "⏸" : "▶"}
              </button>
              <div className={"wave" + (playing ? " playing" : "")}>
                {WAVE_SEED.map((v, i) => (
                  <i
                    key={i}
                    style={{
                      height: (14 + v * 78) + "%",
                      animationDelay: (i * 47) % 500 + "ms",
                      background: (i / WAVE_SEED.length) * 100 <= progress ? "#16130f" : "rgba(22,19,15,.22)",
                    }}
                  />
                ))}
              </div>
              <span className="time mono">{fmt(cur)} / {fmt(dur)}</span>
            </div>
          )}

          <div className="billfoot mono">{t.footer}</div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCur(e.target.currentTime)}
        onLoadedMetadata={(e) => setDur(e.target.duration)}
      />
    </div>
  );
}
