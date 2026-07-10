import { Anton, Barlow } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const barlow = Barlow({ weight: ["400", "500", "700", "800"], subsets: ["latin"], variable: "--font-barlow" });

export const metadata = {
  title: "DuelUp Live · The AI Announcer for Beach-Sport Duels",
  description:
    "Set up a footvolley, beach tennis, tennis or beach volleyball duel and hear an AI sports announcer call it live, fight-bill style. Gemini writes the play-by-play, ElevenLabs gives it a voice. Part of the DuelUp universe.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
