// llm-proxy-firewall explainer: ~62 s, 1920x1080, 30 fps, silent.
// Every message, rationale, reference and number below comes from the recorded demo week
// (demo/data/demo.db); the dashboard frame is a real screenshot (public/dashboard.png).
import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { REAL } from "./real";

const C = {
  bg: "#0b1020",
  panel: "#141b33",
  line: "#2c3866",
  text: "#e8ecf8",
  dim: "#9aa6c8",
  accent: "#5ab0ff",
  info: "#5ab0ff",
  warn: "#ffb547",
  block: "#ff5a6a",
  ok: "#4fd18b",
};
const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, "Segoe UI", sans-serif';
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", Menlo, monospace';
const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const LV: Record<string, string> = { info: C.info, warning: C.warn, block: C.block, ok: C.ok };

const SCENES = [
  { id: "title", d: 4 },
  { id: "problem", d: 7 },
  { id: "change", d: 7 },
  { id: "layers", d: 10 },
  { id: "block", d: 12 },
  { id: "reader", d: 12 },
  { id: "dashboard", d: 8 },
  { id: "outro", d: 5 },
] as const;
const TOTAL = SCENES.reduce((a, s) => a + S(s.d), 0);

const ease = (f: number, from: number, dur: number) =>
  interpolate(f - from, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const Appear: React.FC<{ at?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at = 0,
  y = 26,
  children,
  style,
}) => {
  const o = ease(useCurrentFrame(), at, 14);
  return <div style={{ opacity: o, transform: `translateY(${(1 - o) * y}px)`, ...style }}>{children}</div>;
};

const Frame: React.FC<{ dur: number; children: React.ReactNode; pad?: string }> = ({ dur, children, pad }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o, padding: pad ?? "84px 120px", fontFamily: FONT, color: C.text }}>
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.accent }) => (
  <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color, fontWeight: 700, marginBottom: 14 }}>
    {children}
  </div>
);
const H: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 64 }) => (
  <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.12 }}>{children}</div>
);
const Box: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.line,
  style,
}) => (
  <div style={{ background: C.panel, border: `3px solid ${color}`, borderRadius: 22, padding: "24px 30px", ...style }}>
    {children}
  </div>
);
const Pill: React.FC<{ lv: string; children?: React.ReactNode; size?: number }> = ({ lv, children, size = 26 }) => {
  const c = LV[lv] ?? C.dim;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 18px",
        borderRadius: 999,
        background: c + "26",
        color: c,
        border: `2px solid ${c}`,
        fontWeight: 800,
        fontSize: size,
        textTransform: "uppercase",
        letterSpacing: 2,
        whiteSpace: "nowrap",
      }}
    >
      {children ?? lv}
    </span>
  );
};
const Shield: React.FC<{ size: number; color?: string }> = ({ size, color = C.accent }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 6 L88 20 V48 C88 72 70 88 50 95 C30 88 12 72 12 48 V20 Z" fill={color + "22"} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M33 50 L46 63 L69 38" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Typed: React.FC<{ text: string; at: number; cps?: number }> = ({ text, at, cps = 45 }) => {
  const n = Math.max(0, Math.floor(((useCurrentFrame() - at) / FPS) * cps));
  return <>{text.slice(0, n)}</>;
};
const Who: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginBottom: 8 }}>{children}</div>
);

/* 1 · Title */
const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps: useVideoConfig().fps, config: { damping: 14 } });
  return (
    <Frame dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <div style={{ transform: `scale(${s})` }}>
          <Shield size={200} />
        </div>
        <Appear at={8}>
          <div style={{ fontFamily: MONO, fontSize: 92, fontWeight: 800 }}>llm-proxy-firewall</div>
        </Appear>
        <Appear at={16}>
          <div style={{ fontSize: 44, color: C.dim, textAlign: "center" }}>An LLM logging proxy with a policy firewall</div>
        </Appear>
      </AbsoluteFill>
    </Frame>
  );
};

/* 2 · The problem */
const Problem: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <Kicker>The problem</Kicker>
    <H>Staff type things into AI agents</H>
    <div style={{ display: "grid", gap: 22, marginTop: 44, width: 1380 }}>
      {REAL.problem.map(([who, text], i) => (
        <Appear key={who} at={14 + i * 22}>
          <Box style={{ padding: "18px 28px" }}>
            <Who>{who}</Who>
            <div style={{ fontSize: 38, lineHeight: 1.35 }}>“{text}”</div>
          </Box>
        </Appear>
      ))}
    </div>
    <Appear at={S(4.6)}>
      <div style={{ fontSize: 38, color: C.warn, marginTop: 40, fontWeight: 700 }}>
        The LLM provider enforces its rules, not yours.
      </div>
    </Appear>
  </Frame>
);

/* 3 · One change */
const Node: React.FC<{ title: string; sub: string; color?: string; w?: number }> = ({ title, sub, color = C.line, w = 380 }) => (
  <Box color={color} style={{ width: w, textAlign: "center", padding: "44px 22px", minHeight: 250 }}>
    <div style={{ fontSize: 46, fontWeight: 800 }}>{title}</div>
    <div style={{ fontSize: 30, color: C.dim, marginTop: 14, lineHeight: 1.4 }}>{sub}</div>
  </Box>
);
const Arrow: React.FC<{ at: number; color?: string }> = ({ at, color = C.dim }) => {
  const p = ease(useCurrentFrame(), at, 14);
  return (
    <svg width={120} height={40} style={{ flexShrink: 0 }}>
      <line x1={6} y1={20} x2={6 + 92 * p} y2={20} stroke={color} strokeWidth={5} strokeLinecap="round" />
      {p > 0.9 ? <path d="M96 8 L112 20 L96 32" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
};
const Change: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <Kicker>One change</Kicker>
    <H>Agents point their base URL at the proxy</H>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 110 }}>
      <Appear at={10}><Node title="agents" sub="any OpenAI client, with X-Agent-User: omar" w={400} /></Appear>
      <Arrow at={22} />
      <Appear at={26}><Node title="proxy + firewall" sub="holds the real key, logs every call, checks both directions" color={C.accent} w={560} /></Appear>
      <Arrow at={40} />
      <Appear at={44}><Node title="LLM provider" sub="OpenRouter or any OpenAI-compatible API" w={420} /></Appear>
    </div>
    <Appear at={S(3.4)}>
      <div style={{ fontFamily: MONO, fontSize: 38, marginTop: 100, background: C.panel, padding: "20px 28px", borderRadius: 16, display: "inline-block" }}>
        <span style={{ color: C.dim }}>base_url = </span>
        <span style={{ color: C.ok }}>"http://127.0.0.1:8080/v1"</span>
        <span style={{ color: C.dim }}>   # the only change</span>
      </div>
    </Appear>
  </Frame>
);

/* 4 · The checkpoint */
const LAYERS = [
  ["1", "Keyword rules", "one regex: “password is …”"],
  ["2", "Co-occurrence rules", "several ideas together: customers + emails + gmail"],
  ["3", "LLM intent check", "asked only when a rule fired: who is doing what?"],
];
const OUTCOMES: [string, string, string][] = [
  ["info", "Noted", "logged, forwarded as normal"],
  ["warning", "Flagged", "forwarded with X-Firewall: warning; 3 in a session = block"],
  ["block", "Closed", "never reaches the LLM; the proxy answers in its place"],
];
const Layers: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <Kicker>The checkpoint</Kicker>
    <H>Every request and every answer, against a YAML policy</H>
    <div style={{ display: "flex", gap: 60, marginTop: 70 }}>
      <div style={{ display: "grid", gap: 26, width: 860 }}>
        {LAYERS.map(([n, t, s], i) => (
          <Appear key={n} at={12 + i * 18}>
            <Box style={{ display: "flex", gap: 28, alignItems: "center", padding: "34px 30px" }}>
              <div style={{ fontFamily: MONO, fontSize: 56, color: C.accent, fontWeight: 800, width: 60 }}>{n}</div>
              <div>
                <div style={{ fontSize: 42, fontWeight: 800 }}>{t}</div>
                <div style={{ fontSize: 29, color: C.dim, marginTop: 4 }}>{s}</div>
              </div>
            </Box>
          </Appear>
        ))}
      </div>
      <div style={{ display: "grid", gap: 26, flex: 1 }}>
        {OUTCOMES.map(([lv, t, s], i) => (
          <Appear key={lv} at={S(4.4) + i * 16}>
            <Box color={LV[lv]} style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Pill lv={lv} size={28} />
                <span style={{ fontSize: 40, fontWeight: 800 }}>{t}</span>
              </div>
              <div style={{ fontSize: 28, color: C.dim, marginTop: 10, lineHeight: 1.35 }}>{s}</div>
            </Box>
          </Appear>
        ))}
      </div>
    </div>
  </Frame>
);

/* 5 · A real block */
const Step: React.FC<{ at: number; label: string; lv: string; text: string; pill?: string }> = ({ at, label, lv, text, pill }) => (
  <Appear at={at} y={14}>
    <div style={{ display: "flex", gap: 22, alignItems: "flex-start", marginBottom: 26 }}>
      <div style={{ width: 330, fontSize: 32, fontWeight: 700, paddingTop: 4 }}>{label}</div>
      <div style={{ width: 230 }}><Pill lv={lv} size={26}>{pill}</Pill></div>
      <div style={{ fontSize: 31, color: C.dim, flex: 1, lineHeight: 1.35 }}>{text}</div>
    </div>
  </Appear>
);
const Block: React.FC<{ dur: number }> = ({ dur }) => {
  const b = REAL.block;
  return (
    <Frame dur={dur}>
      <Kicker color={C.block}>A real request from the demo week</Kicker>
      <Box style={{ padding: "20px 28px" }}>
        <Who>{b.who}</Who>
        <div style={{ fontSize: 42, minHeight: 116, lineHeight: 1.35 }}>
          <Typed text={`“${b.text}”`} at={8} cps={60} />
        </div>
      </Box>
      <div style={{ marginTop: 44 }}>
        <Step at={S(2.6)} label="Rules" lv="warning" text={b.rule} />
        <Step at={S(4.0)} label="LLM intent check" lv="block" text={`“${b.rationale}”`} />
        <Step at={S(5.6)} label="LLM provider" lv="ok" pill="not called" text="no tokens spent, nothing leaves the company" />
      </div>
      <Appear at={S(7.2)}>
        <Box color={C.block} style={{ marginTop: 20, padding: "22px 30px" }}>
          <Who>the agent receives, as an ordinary LLM answer</Who>
          <div style={{ fontSize: 33, lineHeight: 1.4 }}>{b.reply}</div>
        </Box>
      </Appear>
    </Frame>
  );
};

/* 6 · Doer, not reader */
const Reader: React.FC<{ dur: number }> = ({ dur }) => {
  const r = REAL.received;
  const o = REAL.own;
  return (
    <Frame dur={dur}>
      <Kicker>Who wrote it matters</Kicker>
      <H size={58}>It stops whoever does it, not whoever reads it</H>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 44 }}>
        <Appear at={14}>
          <Box color={C.warn} style={{ height: 620, padding: "32px 36px" }}>
            <Who>{r.who}</Who>
            <div style={{ fontSize: 38, lineHeight: 1.4, minHeight: 210 }}>“{r.text}”</div>
            <div style={{ marginTop: 26, display: "flex", gap: 14, alignItems: "center" }}>
              <Pill lv="warning" />
              <span style={{ fontSize: 34, fontWeight: 700 }}>flagged · session stays open</span>
            </div>
            <div style={{ fontSize: 30, color: C.dim, marginTop: 22, lineHeight: 1.4 }}>
              A customer wrote it; the support agent is only reading the ticket. Received text never blocks on its own.
            </div>
          </Box>
        </Appear>
        <Appear at={S(4.2)}>
          <Box color={C.block} style={{ height: 620, padding: "32px 36px" }}>
            <Who>{o.who}</Who>
            <div style={{ fontSize: 38, lineHeight: 1.4, minHeight: 210 }}>“{o.text}”</div>
            <div style={{ marginTop: 26, display: "flex", gap: 14, alignItems: "center" }}>
              <Pill lv="block" />
              <span style={{ fontSize: 34, fontWeight: 700 }}>session closed · {o.ref}</span>
            </div>
            <div style={{ fontSize: 30, color: C.dim, marginTop: 22, lineHeight: 1.4 }}>
              A member of staff asks for the threat: the threat rule closes the session.
            </div>
          </Box>
        </Appear>
      </div>
    </Frame>
  );
};

/* 7 · Dashboard */
const Dashboard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [S(1), dur], [1.0, 1.25], { extrapolateLeft: "clamp" });
  return (
    <Frame dur={dur} pad="60px 90px">
      <Kicker>The audit trail</Kicker>
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
        <div style={{ width: 1180, height: 855, overflow: "hidden", borderRadius: 18, border: `3px solid ${C.line}` }}>
          <Img src={staticFile("dashboard.png")} style={{ width: "100%", transform: `scale(${z})`, transformOrigin: "20% 95%" }} />
        </div>
        <div style={{ display: "grid", gap: 16, flex: 1 }}>
          {REAL.kpis.map(([k, v], i) => (
            <Appear key={k} at={10 + i * 8}>
              <Box style={{ padding: "14px 22px" }}>
                <div style={{ fontSize: 46, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 23, color: C.dim }}>{k}</div>
              </Box>
            </Appear>
          ))}
        </div>
      </div>
    </Frame>
  );
};

/* 8 · Outro */
const Outro: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, textAlign: "center" }}>
      <Shield size={130} />
      <H size={68}>A tripwire with an audit trail</H>
      <Appear at={10}>
        <div style={{ fontSize: 34, color: C.dim, maxWidth: 1400 }}>
          Not a guarantee: rules miss paraphrases and an LLM misjudges intent. Every decision is logged with its reason.
        </div>
      </Appear>
      <Appear at={22}>
        <div style={{ fontSize: 32, color: C.text }}>Ships with its blueprint: goal, spec, decisions and the prompts to rebuild it.</div>
      </Appear>
      <Appear at={34}>
        <div style={{ fontFamily: MONO, fontSize: 34, color: C.accent, marginTop: 16 }}>github.com/claudiucalomfirescu/llm-proxy-firewall</div>
      </Appear>
    </AbsoluteFill>
  </Frame>
);

const COMPONENTS: Record<string, React.FC<{ dur: number }>> = {
  title: Title,
  problem: Problem,
  change: Change,
  layers: Layers,
  block: Block,
  reader: Reader,
  dashboard: Dashboard,
  outro: Outro,
};

export const FirewallExplainer: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, #16204a 0%, ${C.bg} 60%)` }}>
      {SCENES.map((s) => {
        const d = S(s.d);
        const Comp = COMPONENTS[s.id];
        const el = (
          <Sequence key={s.id} from={from} durationInFrames={d} name={s.id}>
            <Comp dur={d} />
          </Sequence>
        );
        from += d;
        return el;
      })}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition id="FirewallExplainer" component={FirewallExplainer} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
