import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Martian_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-display",
  adjustFontFallback: false,
  display: "swap",
});
const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description =
  "Akash Kumar, Python full-stack engineer (React, Next.js, FastAPI, Django). Currently building reinforcement-learning environments, games and evaluation harnesses for LLM training.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Akash Kumar, Full-Stack Engineer",
  description,
  authors: [{ name: "Akash Kumar" }],
  keywords: ["Akash Kumar", "Full Stack Developer", "Python", "Next.js", "FastAPI", "Django", "React", "RL environments", "LLM evaluation"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Akash Kumar, Full-Stack Engineer",
    description,
    siteName: "Akash Kumar",
  },
  twitter: { card: "summary_large_image", title: "Akash Kumar, Full-Stack Engineer", description },
};

export const viewport: Viewport = {
  themeColor: "#eeeae0",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide not-yet-revealed content only when JS is available to reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
