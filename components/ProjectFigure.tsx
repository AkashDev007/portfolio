import type { CSSProperties } from "react";
import type { Project } from "@/lib/data";

/* Hand-drawn, CSS-animated schematics standing in for screenshots. */

function Proctor() {
  return (
    <div className="fig fig-lms" aria-hidden>
      <div className="fig-bar">
        <span>
          <i className="dot dot-live" /> REC
        </span>
        <span>LECTURE 07 · 00:42:18</span>
      </div>
      <svg viewBox="0 0 320 180" className="lms-stage">
        <defs>
          <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M0 0H4" stroke="currentColor" strokeOpacity=".06" />
          </pattern>
        </defs>
        <rect width="320" height="180" fill="url(#scan)" />
        <g className="lms-subject">
          <circle cx="160" cy="78" r="27" className="lms-head" />
          <path d="M104 180c4-40 28-58 56-58s52 18 56 58" className="lms-body" />
          <g className="lms-track">
            <path d="M126 44v-8h8M186 36h8v8M194 112v8h-8M134 120h-8v-8" />
            <text x="126" y="31" className="lms-ok">
              ATTENTIVE 0.96
            </text>
            <text x="126" y="31" className="lms-warn">
              LOOK-AWAY 0.41
            </text>
          </g>
        </g>
        <g className="lms-grid">
          <path d="M106.7 0v180M213.3 0v180M0 60h320M0 120h320" />
        </g>
      </svg>
      <div className="lms-meter">
        {Array.from({ length: 24 }, (_, i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
        <span>engagement</span>
      </div>
    </div>
  );
}

const stock = [
  { name: "Keratin serum", level: 72 },
  { name: "Colour 6N", level: 16, low: true },
  { name: "Developer 20 vol", level: 54 },
  { name: "Foil roll", level: 34 },
];

function Inventory() {
  return (
    <div className="fig fig-salon" aria-hidden>
      <div className="fig-bar">
        <span>STOCK · LIVE</span>
        <span>SAT 14 · 09:12</span>
      </div>
      <ul className="salon-stock">
        {stock.map((s, i) => (
          <li key={s.name} className={s.low ? "is-low" : ""}>
            <span className="salon-name">{s.name}</span>
            <span className="salon-track">
              <span
                className="salon-fill"
                style={{ "--lvl": `${s.level}%`, "--i": i } as CSSProperties}
              />
              <span className="salon-min" />
            </span>
            <span className="salon-num">{s.low ? "REORDER" : `${s.level}%`}</span>
          </li>
        ))}
      </ul>
      <div className="salon-ai">
        <span className="salon-ai-tag">AI</span>
        <p>
          Reorder <b>12 × Colour 6N</b>. Four colour bookings today will use most of what's left.
        </p>
      </div>
      <ol className="salon-day">
        <li>
          <b>10:30</b> Colour
        </li>
        <li>
          <b>12:00</b> Cut
        </li>
        <li className="is-now">
          <b>13:45</b> Colour
        </li>
        <li>
          <b>15:15</b> Keratin
        </li>
      </ol>
    </div>
  );
}

function Review() {
  const frames = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="fig fig-lm" aria-hidden>
      <div className="fig-bar">
        <span>SPOT_30s_FINAL</span>
        <span>v3 ↔ v4</span>
      </div>
      <div className="lm-compare">
        <div className="lm-side lm-a">
          <span className="lm-tag">v3</span>
          <div className="lm-shot">
            <i className="lm-logo" />
            <i className="lm-line" />
            <i className="lm-line lm-short" />
          </div>
        </div>
        <div className="lm-side lm-b">
          <span className="lm-tag">v4</span>
          <div className="lm-shot">
            <i className="lm-logo" />
            <i className="lm-line" />
            <i className="lm-line lm-short" />
          </div>
        </div>
        <span className="lm-split" />
      </div>
      <div className="lm-timeline">
        <div className="lm-strip">
          {frames.map((i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
        <span className="lm-pin" style={{ left: "22%" }}>
          <em>
            f0142<span> · logo lands late</span>
          </em>
        </span>
        <span className="lm-pin lm-pin-b" style={{ left: "71%" }}>
          <em>
            f0611<span> · tighten CTA</span>
          </em>
        </span>
        <span className="lm-head" />
      </div>
    </div>
  );
}

export default function ProjectFigure({ id }: { id: Project["id"] }) {
  if (id === "lms") return <Proctor />;
  if (id === "salon") return <Inventory />;
  return <Review />;
}
