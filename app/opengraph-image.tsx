import { ImageResponse } from "next/og";

export const alt = "Akash Kumar, Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#15140f";
const paper = "#eeeae0";
const signal = "#e5461b";
const COLS = 11;
const ROWS = 7;

// Value heat spreading back from a goal in the top-right corner, echoing the hero gridworld.
const heat = (x: number, y: number) => Math.max(0, 1 - (COLS - 1 - x + y) / 12);

const EYEBROW = "Python Full-Stack Engineer";
const LEDE = "Web products end to end. Now building RL environments and eval harnesses for LLMs.";

// Pull just the glyphs we need from Google Fonts at build time; fall back to the default font if offline.
async function loadFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const q = `family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(`https://fonts.googleapis.com/css2?${q}`).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OG() {
  const [font, body] = await Promise.all([
    loadFont("Big Shoulders", 900, "AKSHUMR."),
    loadFont("Schibsted Grotesk", 400, `[ 00 ] ${EYEBROW.toUpperCase()}${LEDE}`),
  ]);
  const nameFont = font ? "Big Shoulders" : "sans-serif";
  const fonts = [
    ...(font ? [{ name: "Big Shoulders", data: font, weight: 900 as const, style: "normal" as const }] : []),
    ...(body ? [{ name: "Schibsted Grotesk", data: body, weight: 400 as const, style: "normal" as const }] : []),
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: paper, color: ink, padding: 64, gap: 48, fontFamily: body ? "Schibsted Grotesk" : undefined }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 2, textTransform: "uppercase" }}>
            <span style={{ color: signal, marginRight: 12 }}>[ 00 ]</span> {EYEBROW}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: nameFont,
              fontSize: font ? 190 : 140,
              fontWeight: 900,
              lineHeight: 0.86,
            }}
          >
            <span>AKASH</span>
            <span style={{ display: "flex" }}>
              KUMAR<span style={{ color: signal }}>.</span>
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 26, maxWidth: 560, lineHeight: 1.35 }}>
            {LEDE}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignSelf: "center", border: `2px solid ${ink}` }}>
          {Array.from({ length: ROWS }, (_, y) => (
            <div key={y} style={{ display: "flex" }}>
              {Array.from({ length: COLS }, (_, x) => (
                <div
                  key={x}
                  style={{
                    width: 38,
                    height: 38,
                    display: "flex",
                    background: x === COLS - 1 && y === 0 ? signal : `rgba(229,70,27,${heat(x, y) * 0.6})`,
                    boxShadow: "inset -1px -1px 0 rgba(21,20,15,.15)",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
