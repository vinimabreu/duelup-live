# DuelUp Live 🎙️

**The AI announcer for beach-sport duels.** Set up a footvolley, beach tennis, tennis or beach volleyball duel, and hear an electrifying sports announcer call it live. Gemini writes the play-by-play, ElevenLabs gives it a voice.

Built for the [DEV Weekend Challenge: Passion Edition](https://dev.to/challenges/weekend-2026-07-09), and for my real futevôlei crew.

Part of the **DuelUp** universe, a competitive platform for amateur beach sports (ELO ranking, tiers from Sand to Legend, virtual-coin stakes) that I built for my own group. DuelUp Live gives our duels the one thing they were missing: a voice.

## How it works

```
Duel setup (players, tiers, match moment, rivalry)
        │
        ▼
POST /api/narrate  ──► Gemini (gemini-flash-latest, thinking disabled for speed)
        │                writes a 90-120 word play-by-play call, PT-BR or EN
        ▼
POST /api/voice    ──► ElevenLabs (eleven_multilingual_v2)
        │                Brazilian announcer voice for PT, energetic English voice for EN
        ▼
     MP3 in the browser
```

- **Next.js 14** (App Router), zero extra runtime dependencies
- **Google Gemini** via the Generative Language API (REST, no SDK)
- **ElevenLabs** text-to-speech (REST, no SDK)
- The rank tiers (Sand → Legend) come from the real DuelUp ELO system and are woven into the narration as drama: underdog vs favorite

## Run it

```bash
cp .env.example .env   # add your keys
npm install
npm run dev            # http://localhost:3201
```

| Env var | Where to get it |
|---|---|
| `GOOGLE_API_KEY` | [Google AI Studio](https://aistudio.google.com) |
| `ELEVENLABS_API_KEY` | [ElevenLabs](https://elevenlabs.io) (needs Text to Speech + voices read access) |

## Notes

- Narration language and announcer voice follow the UI toggle (EN / PT-BR).
- Gemini runs with `thinkingBudget: 0`: an announcer does not overthink, and the call comes back fast.
- Deleted nothing, invented nothing: the tier art and sport art are the real DuelUp assets.

---

Vinicius Pereira · [vinimabreu.dev](https://vinimabreu.dev) · [github.com/vinimabreu](https://github.com/vinimabreu)
