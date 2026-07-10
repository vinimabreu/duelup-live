import "./globals.css";

export const metadata = {
  title: "DuelUp Live · The AI Announcer for Beach-Sport Duels",
  description:
    "Set up a futevôlei, beach tennis, tennis or beach volleyball duel and hear an AI sports announcer call it live. Gemini writes the play-by-play, ElevenLabs gives it a voice. Part of the DuelUp universe.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
