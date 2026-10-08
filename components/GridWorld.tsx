"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * A tiny reinforcement-learning environment running in the browser.
 * Tabular Q-learning on an 11×7 gridworld: the agent starts knowing nothing,
 * explores with ε-greedy, and gradually paints its value function onto the grid.
 * Visitors can click cells to drop or remove walls and watch it re-plan.
 */

const MAP = [
  ".....#....G",
  ".##..#..X..",
  "..#........",
  "..#.####.#.",
  ".......#...",
  "###..X.#...",
  "S..........",
];
const COLS = MAP[0].length;
const ROWS = MAP.length;
const N = COLS * ROWS;
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

const ALPHA = 0.4;
const GAMMA = 0.96;
const MAX_STEPS = 150;
const R_STEP = -0.02;
const R_BUMP = -0.05;

const INK = "21,20,15";
const SIGNAL = "229,70,27";
const PAPER = "#f3f0e8";

const SPEEDS = [
  { label: "1×", sps: 14 },
  { label: "4×", sps: 56 },
  { label: "Train", sps: 1500 },
];

type Cell = "." | "#" | "G" | "X" | "S";

function parseMap() {
  const cells: Cell[] = [];
  let start = 0;
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) {
      const c = MAP[y][x] as Cell;
      if (c === "S") start = y * COLS + x;
      cells.push(c);
    }
  return { cells, start };
}

type Sim = {
  cells: Cell[];
  start: number;
  q: Float32Array;
  pos: number;
  steps: number;
  ret: number;
  episode: number;
  returns: number[];
  wins: boolean[];
  trail: number[];
  acc: number;
};

function freshSim(): Sim {
  const { cells, start } = parseMap();
  return {
    cells,
    start,
    q: new Float32Array(N * 4),
    pos: start,
    steps: 0,
    ret: 0,
    episode: 0,
    returns: [],
    wins: [],
    trail: [],
    acc: 0,
  };
}

const epsilonFor = (episode: number) => Math.max(0.04, 0.9 * Math.pow(0.965, episode));

function bestAction(q: Float32Array, s: number) {
  let best = -Infinity;
  let pick = 0;
  let ties = 0;
  for (let a = 0; a < 4; a++) {
    const v = q[s * 4 + a];
    if (v > best) {
      best = v;
      pick = a;
      ties = 1;
    } else if (v === best && Math.random() < 1 / ++ties) {
      pick = a;
    }
  }
  return pick;
}

function maxQ(q: Float32Array, s: number) {
  return Math.max(q[s * 4], q[s * 4 + 1], q[s * 4 + 2], q[s * 4 + 3]);
}

/** Advance the environment by one step. Returns true if the episode ended. */
function step(sim: Sim): boolean {
  const { q, cells } = sim;
  const s = sim.pos;
  const a = Math.random() < epsilonFor(sim.episode) ? (Math.random() * 4) | 0 : bestAction(q, s);
  const x = (s % COLS) + DX[a];
  const y = Math.floor(s / COLS) + DY[a];

  let next = s;
  let r = R_BUMP;
  let done = false;
  if (x >= 0 && x < COLS && y >= 0 && y < ROWS && cells[y * COLS + x] !== "#") {
    next = y * COLS + x;
    const c = cells[next];
    if (c === "G") (r = 1), (done = true);
    else if (c === "X") (r = -1), (done = true);
    else r = R_STEP;
  }

  const target = r + (done ? 0 : GAMMA * maxQ(q, next));
  q[s * 4 + a] += ALPHA * (target - q[s * 4 + a]);

  sim.pos = next;
  sim.ret += r;
  sim.steps++;
  sim.trail.push(next);
  if (sim.trail.length > 14) sim.trail.shift();

  if (done || sim.steps >= MAX_STEPS) {
    sim.returns.push(sim.ret);
    sim.wins.push(done && cells[next] === "G");
    if (sim.returns.length > 120) sim.returns.shift(), sim.wins.shift();
    sim.episode++;
    sim.pos = sim.start;
    sim.steps = 0;
    sim.ret = 0;
    sim.trail = [];
    return true;
  }
  return false;
}

// Canvas can't resolve CSS variables, so the mono family is read once on mount.
let monoFamily = "ui-monospace, monospace";

function draw(ctx: CanvasRenderingContext2D, sim: Sim, w: number, h: number) {
  const cw = w / COLS;
  const ch = h / ROWS;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);

  const mono = `500 ${Math.max(9, cw * 0.26)}px ${monoFamily}`;

  for (let s = 0; s < N; s++) {
    const x = (s % COLS) * cw;
    const y = Math.floor(s / COLS) * ch;
    const c = sim.cells[s];

    if (c === "#") {
      ctx.fillStyle = `rgb(${INK})`;
      ctx.fillRect(x, y, cw, ch);
      ctx.strokeStyle = "rgba(243,240,232,.16)";
      ctx.lineWidth = 1;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, cw, ch);
      ctx.clip();
      ctx.beginPath();
      for (let k = -ch; k < cw; k += 6) {
        ctx.moveTo(x + k, y + ch);
        ctx.lineTo(x + k + ch, y);
      }
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (c === "G" || c === "X") {
      ctx.fillStyle = c === "G" ? `rgb(${SIGNAL})` : `rgb(${INK})`;
      ctx.fillRect(x + 3, y + 3, cw - 6, ch - 6);
      ctx.fillStyle = PAPER;
      ctx.font = mono;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c === "G" ? "+1" : "−1", x + cw / 2, y + ch / 2 + 1);
      continue;
    }

    // Value heat: warm where the agent expects reward, cool ink where it expects pain.
    const v = maxQ(sim.q, s);
    if (v > 0) {
      ctx.fillStyle = `rgba(${SIGNAL},${Math.min(1, v) * 0.62})`;
      ctx.fillRect(x, y, cw, ch);
    } else if (v < 0) {
      ctx.fillStyle = `rgba(${INK},${Math.min(1, -v * 1.6) * 0.22})`;
      ctx.fillRect(x, y, cw, ch);
    }

    // Greedy policy arrow, once the cell has been visited at all.
    const qs = sim.q.subarray(s * 4, s * 4 + 4);
    if (qs[0] || qs[1] || qs[2] || qs[3]) {
      let a = 0;
      for (let k = 1; k < 4; k++) if (qs[k] > qs[a]) a = k;
      const cx = x + cw / 2;
      const cy = y + ch / 2;
      const len = Math.min(cw, ch) * 0.2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((a * Math.PI) / 2);
      ctx.strokeStyle = `rgba(${INK},${v > 0.25 ? 0.75 : 0.38})`;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, len);
      ctx.lineTo(0, -len);
      ctx.moveTo(-len * 0.55, -len * 0.4);
      ctx.lineTo(0, -len);
      ctx.lineTo(len * 0.55, -len * 0.4);
      ctx.stroke();
      ctx.restore();
    }

    if (c === "S") {
      ctx.fillStyle = `rgba(${INK},.55)`;
      ctx.font = mono;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("S", x + 5, y + 4);
    }
  }

  // Grid lines.
  ctx.strokeStyle = `rgba(${INK},.12)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < COLS; i++) {
    ctx.moveTo(Math.round(i * cw) + 0.5, 0);
    ctx.lineTo(Math.round(i * cw) + 0.5, h);
  }
  for (let j = 1; j < ROWS; j++) {
    ctx.moveTo(0, Math.round(j * ch) + 0.5);
    ctx.lineTo(w, Math.round(j * ch) + 0.5);
  }
  ctx.stroke();

  // Trail and agent.
  const r = Math.min(cw, ch) * 0.24;
  sim.trail.forEach((p, i) => {
    const a = (i + 1) / sim.trail.length;
    ctx.fillStyle = `rgba(${INK},${a * 0.28})`;
    ctx.beginPath();
    ctx.arc((p % COLS) * cw + cw / 2, Math.floor(p / COLS) * ch + ch / 2, r * 0.38, 0, Math.PI * 2);
    ctx.fill();
  });
  const ax = (sim.pos % COLS) * cw + cw / 2;
  const ay = Math.floor(sim.pos / COLS) * ch + ch / 2;
  ctx.fillStyle = `rgb(${INK})`;
  ctx.beginPath();
  ctx.arc(ax, ay, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgb(${SIGNAL})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ax, ay, r + 3.5, 0, Math.PI * 2);
  ctx.stroke();
}

type Stats = {
  episode: number;
  steps: number;
  epsilon: number;
  lastReturn: number | null;
  winRate: number | null;
  curve: number[];
};

const emptyStats: Stats = { episode: 0, steps: 0, epsilon: epsilonFor(0), lastReturn: null, winRate: null, curve: [] };

function readStats(sim: Sim): Stats {
  const k = 10;
  const curve: number[] = [];
  for (let i = 0; i < sim.returns.length; i++) {
    const lo = Math.max(0, i - k + 1);
    let sum = 0;
    for (let j = lo; j <= i; j++) sum += sim.returns[j];
    curve.push(sum / (i - lo + 1));
  }
  const recent = sim.wins.slice(-20);
  return {
    episode: sim.episode,
    steps: sim.steps,
    epsilon: epsilonFor(sim.episode),
    lastReturn: sim.returns.length ? sim.returns[sim.returns.length - 1] : null,
    winRate: recent.length ? recent.filter(Boolean).length / recent.length : null,
    curve,
  };
}

function Sparkline({ values }: { values: number[] }) {
  const W = 220;
  const H = 46;
  if (values.length < 2) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="gw-spark" aria-hidden>
        <line x1="0" x2={W} y1={H / 2} y2={H / 2} className="gw-spark-zero" />
      </svg>
    );
  }
  const lo = -1.6;
  const hi = 1;
  const y = (v: number) => H - ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * H;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * W).toFixed(1)},${y(v).toFixed(1)}`);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gw-spark" aria-hidden preserveAspectRatio="none">
      <line x1="0" x2={W} y1={y(0)} y2={y(0)} className="gw-spark-zero" />
      <polyline points={pts.join(" ")} className="gw-spark-line" />
    </svg>
  );
}

export default function GridWorld() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim>(freshSim());
  const sizeRef = useRef({ w: 0, h: 0 });
  const visibleRef = useRef(true);
  const runningRef = useRef(true);
  const speedRef = useRef(1);

  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [stats, setStats] = useState<Stats>(emptyStats);

  const redraw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx, simRef.current, sizeRef.current.w, sizeRef.current.h);
  }, []);

  // Size the canvas to its container at device pixel ratio.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const family = getComputedStyle(wrap).getPropertyValue("--font-mono").trim();
    if (family) monoFamily = `${family}, ui-monospace, monospace`;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      const h = (w / COLS) * ROWS;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      redraw();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [redraw]);

  // Pause work while off-screen; respect reduced-motion by starting paused.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      runningRef.current = false;
      setRunning(false);
    }
    const io = new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting));
    if (wrapRef.current) io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  // Main loop.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastStats = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const sim = simRef.current;
      if (runningRef.current && visibleRef.current) {
        sim.acc += dt * SPEEDS[speedRef.current].sps;
        let n = Math.floor(sim.acc);
        sim.acc -= n;
        while (n-- > 0) step(sim);
        redraw();
        if (now - lastStats > 120) {
          lastStats = now;
          setStats(readStats(sim));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [redraw]);

  const toggleRun = () => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  };

  const chooseSpeed = (i: number) => {
    speedRef.current = i;
    setSpeed(i);
    if (!runningRef.current) toggleRun();
  };

  const reset = () => {
    simRef.current = freshSim();
    setStats(readStats(simRef.current));
    redraw();
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
    const s = y * COLS + x;
    const sim = simRef.current;
    const c = sim.cells[s];
    if (c === "." && s !== sim.pos) sim.cells[s] = "#";
    else if (c === "#") sim.cells[s] = ".";
    redraw();
  };

  const fmt = (v: number | null, d = 2) => (v === null ? "—" : (v >= 0 ? "+" : "") + v.toFixed(d));

  return (
    <figure className="gw">
      <header className="gw-head">
        <span className="gw-id">
          <i className={running ? "dot dot-live" : "dot"} /> ENV-01 / gridworld-v0
        </span>
        <span className="gw-algo">tabular Q-learning · γ {GAMMA} · α {ALPHA}</span>
      </header>

      <div ref={wrapRef} className="gw-canvas">
        <canvas
          ref={canvasRef}
          onClick={onCanvasClick}
          role="img"
          aria-label="An agent learning to reach the +1 goal on a grid while avoiding −1 pits. Click a cell to add or remove a wall."
        />
      </div>

      <div className="gw-readout">
        <dl className="gw-stats">
          <div>
            <dt>Episode</dt>
            <dd>{String(stats.episode).padStart(4, "0")}</dd>
          </div>
          <div>
            <dt>ε explore</dt>
            <dd>{stats.epsilon.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Last return</dt>
            <dd>{fmt(stats.lastReturn)}</dd>
          </div>
          <div>
            <dt>Success / 20</dt>
            <dd>{stats.winRate === null ? "—" : `${Math.round(stats.winRate * 100)}%`}</dd>
          </div>
        </dl>
        <div className="gw-curve">
          <span className="gw-curve-label">Return, 10-ep avg</span>
          <Sparkline values={stats.curve} />
        </div>
      </div>

      <footer className="gw-controls">
        <button type="button" onClick={toggleRun} className="gw-btn" aria-pressed={running}>
          {running ? "Pause" : "Run"}
        </button>
        <div className="gw-speed" role="group" aria-label="Simulation speed">
          {SPEEDS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className="gw-btn"
              aria-pressed={speed === i}
              onClick={() => chooseSpeed(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={reset} className="gw-btn">
          Reset
        </button>
        <span className="gw-hint">Click a cell to build a wall</span>
      </footer>
    </figure>
  );
}
