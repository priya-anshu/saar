    "use client";

    import { useState } from "react";
    import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";

    const colors: NoteColors = {
    light: ["#1D4ED8", "#047857", "#C2410C", "#7E22CE"],
    dark: ["#93C5FD", "#6EE7B7", "#FDBA74", "#D8B4FE"],
    };

    /* ---------- shared helpers ---------- */

    type Pt = [number, number];

    const BTN_PRIMARY =
    "rounded-lg border border-brand bg-brand px-4 py-1.5 text-sm font-semibold text-page disabled:cursor-not-allowed disabled:opacity-50";
    const BTN_SECONDARY =
    "rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-50";
    const WIDGET = "rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5";

    const toRad = (d: number): number => (d * Math.PI) / 180;
    const toDeg = (r: number): number => (r * 180) / Math.PI;
    const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));
    const fmt = (n: number): string => (Math.round(n * 10) / 10).toString();

    const unit = (from: Pt, to: Pt): Pt => {
    const d = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
    return [(to[0] - from[0]) / d, (to[1] - from[1]) / d];
    };
    const mid = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const centroid = (p: Pt[]): Pt => [
    p.reduce((s, q) => s + q[0], 0) / p.length,
    p.reduce((s, q) => s + q[1], 0) / p.length,
    ];
    const away = (p: Pt, c: Pt, d: number): Pt => {
    const u = unit(c, p);
    return [p[0] + u[0] * d, p[1] + u[1] * d];
    };
    const pointsAttr = (pts: Pt[]): string => pts.map((p) => `${p[0]},${p[1]}`).join(" ");

    const polar = (c: Pt, r: number, deg: number): Pt => [
    c[0] + r * Math.cos(toRad(deg)),
    c[1] - r * Math.sin(toRad(deg)),
    ];

    const arcPath = (c: Pt, r: number, a0: number, a1: number): string => {
    const s = polar(c, r, a0);
    const e = polar(c, r, a1);
    const sweep = a1 > a0 ? 0 : 1;
    return `M ${s[0]} ${s[1]} A ${r} ${r} 0 0 ${sweep} ${e[0]} ${e[1]}`;
    };

    /* ---------- static triangle figure ---------- */

    interface TriProps {
    pts: [Pt, Pt, Pt];
    label: string;
    tone: string;
    vertexLabels?: [string, string, string];
    sideLabels?: [string, string, string];
    rightAt?: number;
    }

    function Tri({ pts, label, tone, vertexLabels, sideLabels, rightAt }: TriProps) {
    const c = centroid(pts);
    let rightPath = "";
    if (rightAt !== undefined) {
        const v = pts[rightAt];
        const ua = unit(v, pts[(rightAt + 1) % 3]);
        const ub = unit(v, pts[(rightAt + 2) % 3]);
        const s = 12;
        rightPath = `M ${v[0] + ua[0] * s} ${v[1] + ua[1] * s} L ${v[0] + (ua[0] + ub[0]) * s} ${
        v[1] + (ua[1] + ub[1]) * s
        } L ${v[0] + ub[0] * s} ${v[1] + ub[1] * s}`;
    }
    return (
        <svg viewBox="0 0 200 150" className="h-auto w-full" role="img" aria-label={label}>
        <polygon
            points={pointsAttr(pts)}
            fill="currentColor"
            fillOpacity={0.12}
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinejoin="round"
            className={tone}
        />
        {rightPath !== "" && (
            <path d={rightPath} fill="none" stroke="currentColor" strokeWidth={2} className="text-brand3" />
        )}
        {vertexLabels &&
            pts.map((p, i) => {
            const q = away(p, c, 13);
            return (
                <text
                key={`v${i}`}
                x={q[0]}
                y={q[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={700}
                fill="currentColor"
                className="text-fg"
                >
                {vertexLabels[i]}
                </text>
            );
            })}
        {sideLabels &&
            [0, 1, 2].map((i) => {
            const m = mid(pts[i], pts[(i + 1) % 3]);
            const q = away(m, c, 14);
            return (
                <text
                key={`s${i}`}
                x={q[0]}
                y={q[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fill="currentColor"
                className="text-mute"
                >
                {sideLabels[i]}
                </text>
            );
            })}
        </svg>
    );
    }

    /* ---------- slider ---------- */

    interface SliderProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    suffix: string;
    tone: string;
    onChange: (v: number) => void;
    }

    function Slider({ id, label, value, min, max, step, suffix, tone, onChange }: SliderProps) {
    return (
        <div>
        <label htmlFor={id} className="mb-1 flex justify-between text-sm font-semibold text-fg">
            <span>{label}</span>
            <span className={tone}>
            {fmt(value)}
            {suffix}
            </span>
        </label>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
        />
        </div>
    );
    }

    /* ---------- widget 1: construction stepper (SSS) ---------- */

    const STEP_TEXT: string[] = [
    "Goal: construct triangle PQR with PQ = 6 cm, PR = 4 cm and QR = 5 cm. You need a ruler and a compass (a drawing tool with two arms that draws circles and arcs). Press Next to begin.",
    "Step 1: Draw a line segment PQ = 6 cm with the ruler. This is the base of the triangle.",
    "Step 2: Open the compass to 4 cm. Put its point on P and draw an arc (a small part of a circle) above the base. Every point on this arc is exactly 4 cm from P.",
    "Step 3: Open the compass to 5 cm. Put its point on Q and draw a second arc that crosses the first one. Call the crossing point R. It is 4 cm from P and 5 cm from Q.",
    "Step 4: Join P to R and Q to R with the ruler. Triangle PQR is ready, with sides 6 cm, 4 cm and 5 cm.",
    ];

    function ConstructionStepper() {
    const [step, setStep] = useState<number>(0);
    const u = 38;
    const P: Pt = [56, 190];
    const Q: Pt = [56 + 6 * u, 190];
    const rx = (16 - 25 + 36) / 12;
    const ry = Math.sqrt(16 - rx * rx);
    const R: Pt = [P[0] + rx * u, P[1] - ry * u];
    const angP = toDeg(Math.atan2(ry, rx));
    const angQ = toDeg(Math.atan2(ry, rx - 6));
    const labP = polar(P, 4 * u + 14, angP + 18);
    const labQ = polar(Q, 5 * u + 14, angQ - 18);

    return (
        <div className={WIDGET}>
        <svg
            viewBox="0 0 340 230"
            className="h-auto w-full"
            role="img"
            aria-label="Step by step compass construction of a triangle with sides 6, 4 and 5 centimetres"
        >
            {step >= 1 && (
            <g className="text-brand">
                <line x1={P[0]} y1={P[1]} x2={Q[0]} y2={Q[1]} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
                <circle cx={P[0]} cy={P[1]} r={4} fill="currentColor" />
                <circle cx={Q[0]} cy={Q[1]} r={4} fill="currentColor" />
                <text x={P[0] - 4} y={P[1] + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill="currentColor">
                P
                </text>
                <text x={Q[0] + 4} y={Q[1] + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill="currentColor">
                Q
                </text>
                <text x={(P[0] + Q[0]) / 2} y={P[1] + 22} textAnchor="middle" fontSize={12} fill="currentColor">
                6 cm
                </text>
            </g>
            )}
            {step >= 2 && (
            <g className="text-brand2">
                <path
                d={arcPath(P, 4 * u, angP - 18, angP + 18)}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="5 4"
                />
                <text x={labP[0]} y={labP[1]} textAnchor="middle" fontSize={12} fill="currentColor">
                4 cm from P
                </text>
            </g>
            )}
            {step >= 3 && (
            <g className="text-brand3">
                <path
                d={arcPath(Q, 5 * u, angQ - 18, angQ + 18)}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="5 4"
                />
                <text x={labQ[0] + 6} y={labQ[1] + 4} textAnchor="middle" fontSize={12} fill="currentColor">
                5 cm from Q
                </text>
                <circle cx={R[0]} cy={R[1]} r={4} fill="currentColor" />
                <text x={R[0] - 10} y={R[1] - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill="currentColor">
                R
                </text>
            </g>
            )}
            {step >= 4 && (
            <g className="text-brand4">
                <polygon
                points={pointsAttr([P, Q, R])}
                fill="currentColor"
                fillOpacity={0.12}
                stroke="currentColor"
                strokeWidth={3}
                strokeLinejoin="round"
                />
                <text x={(P[0] + R[0]) / 2 - 16} y={(P[1] + R[1]) / 2} textAnchor="middle" fontSize={12} fill="currentColor">
                4 cm
                </text>
                <text x={(Q[0] + R[0]) / 2 + 16} y={(Q[1] + R[1]) / 2} textAnchor="middle" fontSize={12} fill="currentColor">
                5 cm
                </text>
            </g>
            )}
        </svg>

        <p aria-live="polite" className="mt-2 min-h-[4.5rem] text-sm text-fg">
            {STEP_TEXT[step]}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
            type="button"
            aria-label="Go to the previous construction step"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={BTN_SECONDARY}
            >
            Back
            </button>
            <button
            type="button"
            aria-label="Go to the next construction step"
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={step === 4}
            className={BTN_PRIMARY}
            >
            Next step
            </button>
            <button type="button" aria-label="Restart the construction" onClick={() => setStep(0)} className={BTN_SECONDARY}>
            Restart
            </button>
            <span className="ml-auto text-xs text-mute">Step {step} of 4</span>
        </div>
        </div>
    );
    }

    /* ---------- widget 2: triangle inequality lab ---------- */

    interface Preset {
    label: string;
    v: [number, number, number];
    }

    const PRESETS: Preset[] = [
    { label: "3, 4, 5", v: [3, 4, 5] },
    { label: "4, 5, 6", v: [4, 5, 6] },
    { label: "5, 5, 5", v: [5, 5, 5] },
    { label: "5, 5, 8", v: [5, 5, 8] },
    { label: "2, 3, 6", v: [2, 3, 6] },
    { label: "3, 4, 7", v: [3, 4, 7] },
    ];

    const angleFrom = (opp: number, x: number, y: number): number =>
    toDeg(Math.acos(clamp((x * x + y * y - opp * opp) / (2 * x * y), -1, 1)));

    function TriangleLab() {
    const [a, setA] = useState<number>(4);
    const [b, setB] = useState<number>(5);
    const [c, setC] = useState<number>(6);

    const checks = [
        { sum: a + b, left: `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}`, other: fmt(c), pass: a + b > c },
        { sum: b + c, left: `${fmt(b)} + ${fmt(c)} = ${fmt(b + c)}`, other: fmt(a), pass: b + c > a },
        { sum: a + c, left: `${fmt(a)} + ${fmt(c)} = ${fmt(a + c)}`, other: fmt(b), pass: a + c > b },
    ];
    const ok = checks.every((k) => k.pass);

    const s = 11;
    const baseY = 135;
    const Px = 200 - (c * s) / 2;
    const Qx = Px + c * s;

    let apex: Pt | null = null;
    let angles: [number, number, number] | null = null;
    let bySides = "";
    let byAngles = "";
    if (ok) {
        const x = (a * a - b * b + c * c) / (2 * c);
        const y = Math.sqrt(Math.max(0, a * a - x * x));
        apex = [Px + x * s, baseY - y * s];
        angles = [angleFrom(b, a, c), angleFrom(a, b, c), angleFrom(c, a, b)];
        bySides = a === b && b === c ? "equilateral" : a === b || b === c || a === c ? "isosceles" : "scalene";
        const sorted = [a, b, c].sort((m, n) => m - n);
        const gap = sorted[0] * sorted[0] + sorted[1] * sorted[1] - sorted[2] * sorted[2];
        byAngles = gap === 0 ? "right" : gap > 0 ? "acute" : "obtuse";
    }

    let reason = "";
    if (!ok) {
        if (!checks[0].pass) {
        reason = "The two circles are too small to reach each other, so they never cross.";
        } else {
        reason = "One circle is so big that it swallows the other, so they never cross.";
        }
    }

    return (
        <div className={WIDGET}>
        <p className="mb-3 text-sm text-mute">
            Left arm a and right arm b are drawn as circles around the two ends of the base c. A triangle exists only
            when the circles cross.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
            <Slider id="tl-a" label="Side a (left)" value={a} min={1} max={10} step={0.5} suffix=" cm" tone="text-brand2" onChange={setA} />
            <Slider id="tl-b" label="Side b (right)" value={b} min={1} max={10} step={0.5} suffix=" cm" tone="text-brand3" onChange={setB} />
            <Slider id="tl-c" label="Base c" value={c} min={1} max={10} step={0.5} suffix=" cm" tone="text-brand" onChange={setC} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
            <button
                key={p.label}
                type="button"
                aria-label={`Try side lengths ${p.label}`}
                onClick={() => {
                setA(p.v[0]);
                setB(p.v[1]);
                setC(p.v[2]);
                }}
                className={BTN_SECONDARY}
            >
                {p.label}
            </button>
            ))}
        </div>

        <svg
            viewBox="0 0 400 270"
            className="mt-3 h-auto w-full rounded-xl border border-line bg-page"
            role="img"
            aria-label="Two circles drawn around the ends of a base line, showing whether a triangle can be formed"
        >
            <circle cx={Px} cy={baseY} r={a * s} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="5 4" className="text-brand2" />
            <circle cx={Qx} cy={baseY} r={b * s} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="5 4" className="text-brand3" />
            {apex && (
            <polygon
                points={pointsAttr([[Px, baseY], [Qx, baseY], apex])}
                fill="currentColor"
                fillOpacity={0.15}
                stroke="currentColor"
                strokeWidth={3}
                strokeLinejoin="round"
                className="text-brand"
            />
            )}
            <line x1={Px} y1={baseY} x2={Qx} y2={baseY} stroke="currentColor" strokeWidth={3} strokeLinecap="round" className="text-brand" />
            <circle cx={Px} cy={baseY} r={4} fill="currentColor" className="text-brand" />
            <circle cx={Qx} cy={baseY} r={4} fill="currentColor" className="text-brand" />
            <text x={Px - 6} y={baseY + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor" className="text-fg">
            P
            </text>
            <text x={Qx + 6} y={baseY + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor" className="text-fg">
            Q
            </text>
            {apex && (
            <>
                <circle cx={apex[0]} cy={apex[1]} r={4} fill="currentColor" className="text-brand4" />
                <text x={apex[0]} y={apex[1] - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor" className="text-fg">
                R
                </text>
            </>
            )}
        </svg>

        <div className="mt-3 space-y-1.5">
            {checks.map((k, i) => (
            <p key={`chk${i}`} className="text-sm text-fg">
                <span className={k.pass ? "font-bold text-ok" : "font-bold text-accent"}>{k.pass ? "✓" : "✗"}</span>{" "}
                {k.left} {k.pass ? "is greater than" : "is NOT greater than"} {k.other}
            </p>
            ))}
        </div>

        {ok && angles ? (
            <div className="mt-3 rounded-xl border border-brand/30 bg-page p-4">
            <p className="font-semibold text-ok">A triangle is possible.</p>
            <p className="mt-1 text-sm text-fg">
                By sides it is <Hl>{bySides}</Hl>. By angles it is <Hl>{byAngles}</Hl>.
            </p>
            <p className="mt-1 text-sm text-mute">
                Angles at P, Q, R: {angles[0].toFixed(1)}°, {angles[1].toFixed(1)}°, {angles[2].toFixed(1)}° — together{" "}
                {Math.round(angles[0] + angles[1] + angles[2])}°.
            </p>
            </div>
        ) : (
            <div className="mt-3 rounded-xl border border-brand4/40 bg-page p-4">
            <p className="font-semibold text-accent">No triangle can be made with these lengths.</p>
            <p className="mt-1 text-sm text-mute">{reason}</p>
            </div>
        )}
        </div>
    );
    }

    /* ---------- widget 3: SAS builder ---------- */

    function SasBuilder() {
    const [p, setP] = useState<number>(6);
    const [q, setQ] = useState<number>(4);
    const [theta, setTheta] = useState<number>(60);

    const r = Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(toRad(theta)));
    const angB = angleFrom(q, p, r);
    const angC = 180 - theta - angB;

    const s = 18;
    const A: Pt = [150, 200];
    const B: Pt = [A[0] + p * s, A[1]];
    const C: Pt = [A[0] + q * s * Math.cos(toRad(theta)), A[1] - q * s * Math.sin(toRad(theta))];
    const thetaLabel = polar(A, 44, theta / 2);

    return (
        <div className={WIDGET}>
        <p className="mb-3 text-sm text-mute">
            Fix two sides and the angle between them. Drag the angle and watch the third side appear on its own.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
            <Slider id="sas-p" label="Side AB" value={p} min={2} max={8} step={0.5} suffix=" cm" tone="text-brand" onChange={setP} />
            <Slider id="sas-q" label="Side AC" value={q} min={2} max={8} step={0.5} suffix=" cm" tone="text-brand2" onChange={setQ} />
            <Slider id="sas-t" label="Angle at A" value={theta} min={20} max={160} step={5} suffix="°" tone="text-brand3" onChange={setTheta} />
        </div>

        <svg
            viewBox="0 0 400 240"
            className="mt-3 h-auto w-full rounded-xl border border-line bg-page"
            role="img"
            aria-label="A triangle built from two chosen sides and the angle between them"
        >
            <polygon
            points={pointsAttr([A, B, C])}
            fill="currentColor"
            fillOpacity={0.12}
            stroke="currentColor"
            strokeWidth={3}
            strokeLinejoin="round"
            className="text-brand"
            />
            <path d={arcPath(A, 28, 0, theta)} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-brand3" />
            <text x={thetaLabel[0]} y={thetaLabel[1]} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill="currentColor" className="text-brand3">
            {theta}°
            </text>
            <text x={A[0] - 10} y={A[1] + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor" className="text-fg">
            A
            </text>
            <text x={B[0] + 10} y={B[1] + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor" className="text-fg">
            B
            </text>
            <text x={C[0]} y={C[1] - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor" className="text-fg">
            C
            </text>
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Third side BC</p>
            <p className="font-semibold text-brand4">{r.toFixed(1)} cm</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Angle at B</p>
            <p className="font-semibold text-brand">{angB.toFixed(1)}°</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Angle at C</p>
            <p className="font-semibold text-brand2">{angC.toFixed(1)}°</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Always a triangle?</p>
            <p className="font-semibold text-ok">Yes ✓</p>
            </div>
        </div>
        </div>
    );
    }

    /* ---------- widget 4: altitude viewer ---------- */

    type TriKind = "acute" | "right" | "obtuse";

    const KIND_PTS: Record<TriKind, [Pt, Pt, Pt]> = {
    acute: [[60, 200], [300, 200], [170, 50]],
    right: [[80, 200], [280, 200], [80, 60]],
    obtuse: [[60, 200], [320, 200], [120, 130]],
    };
    const KINDS: TriKind[] = ["acute", "right", "obtuse"];
    const VERTEX_NAMES: string[] = ["A", "B", "C"];

    function AltitudeViewer() {
    const [kind, setKind] = useState<TriKind>("acute");
    const [v, setV] = useState<number>(0);

    const pts = KIND_PTS[kind];
    const V = pts[v];
    const P = pts[(v + 1) % 3];
    const Q = pts[(v + 2) % 3];
    const dx = Q[0] - P[0];
    const dy = Q[1] - P[1];
    const t = ((V[0] - P[0]) * dx + (V[1] - P[1]) * dy) / (dx * dx + dy * dy);
    const F: Pt = [P[0] + t * dx, P[1] + t * dy];
    const eps = 1e-9;
    const where: "outside" | "vertex" | "inside" =
        t < -eps || t > 1 + eps ? "outside" : Math.abs(t) < eps || Math.abs(t - 1) < eps ? "vertex" : "inside";

    const n = unit(F, V);
    const sgn = t > 1 ? -1 : 1;
    const uu = unit(P, Q);
    const m = 11;
    const markPath = `M ${F[0] + n[0] * m} ${F[1] + n[1] * m} L ${F[0] + n[0] * m + uu[0] * m * sgn} ${
        F[1] + n[1] * m + uu[1] * m * sgn
    } L ${F[0] + uu[0] * m * sgn} ${F[1] + uu[1] * m * sgn}`;

    const cen = centroid(pts);
    const opposite = `${VERTEX_NAMES[(v + 1) % 3]}${VERTEX_NAMES[(v + 2) % 3]}`;

    let message = "";
    if (where === "inside") {
        message = `The foot of the altitude from ${VERTEX_NAMES[v]} lands inside side ${opposite}.`;
    } else if (where === "vertex") {
        message = `The altitude from ${VERTEX_NAMES[v]} is itself a side of the triangle. This happens at the two sharp corners of a right triangle.`;
    } else {
        message = `The altitude from ${VERTEX_NAMES[v]} lands outside the triangle, so side ${opposite} has to be extended (dashed line) to meet it.`;
    }

    return (
        <div className={WIDGET}>
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-fg">Triangle:</span>
            {KINDS.map((k) => (
            <button
                key={k}
                type="button"
                aria-label={`Show an ${k} triangle`}
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={kind === k ? BTN_PRIMARY : BTN_SECONDARY}
            >
                {k === "acute" ? "Acute" : k === "right" ? "Right" : "Obtuse"}
            </button>
            ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-fg">Altitude from vertex:</span>
            {VERTEX_NAMES.map((name, i) => (
            <button
                key={name}
                type="button"
                aria-label={`Draw the altitude from vertex ${name}`}
                aria-pressed={v === i}
                onClick={() => setV(i)}
                className={v === i ? BTN_PRIMARY : BTN_SECONDARY}
            >
                {name}
            </button>
            ))}
        </div>

        <svg
            viewBox="0 0 360 240"
            className="mt-3 h-auto w-full rounded-xl border border-line bg-page"
            role="img"
            aria-label={`An ${kind} triangle with the altitude drawn from vertex ${VERTEX_NAMES[v]}`}
        >
            <polygon
            points={pointsAttr([...pts])}
            fill="currentColor"
            fillOpacity={0.1}
            stroke="currentColor"
            strokeWidth={3}
            strokeLinejoin="round"
            className="text-brand"
            />
            {where === "outside" && (
            <line
                x1={t > 1 ? Q[0] : P[0]}
                y1={t > 1 ? Q[1] : P[1]}
                x2={F[0]}
                y2={F[1]}
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="6 5"
                className="text-brand2"
            />
            )}
            <line x1={V[0]} y1={V[1]} x2={F[0]} y2={F[1]} stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" className="text-brand3" />
            <path d={markPath} fill="none" stroke="currentColor" strokeWidth={2} className="text-brand4" />
            <circle cx={F[0]} cy={F[1]} r={3.5} fill="currentColor" className="text-brand3" />
            {pts.map((p, i) => {
            const q = away(p, cen, 14);
            return (
                <text
                key={`av${i}`}
                x={q[0]}
                y={q[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={700}
                fill="currentColor"
                className="text-fg"
                >
                {VERTEX_NAMES[i]}
                </text>
            );
            })}
        </svg>

        <p aria-live="polite" className="mt-3 text-sm text-fg">
            {message}
        </p>
        </div>
    );
    }

    /* ---------- widget 5: angle sum lab ---------- */

    function AngleSumLab() {
    const [angA, setAngA] = useState<number>(50);
    const [angB, setAngB] = useState<number>(60);
    const angC = 180 - angA - angB;
    const valid = angC > 0;

    let pts: [Pt, Pt, Pt] | null = null;
    if (valid) {
        const L = 200;
        const ac = (L * Math.sin(toRad(angB))) / Math.sin(toRad(angC));
        const cx = ac * Math.cos(toRad(angA));
        const cy = ac * Math.sin(toRad(angA));
        const minX = Math.min(0, cx);
        const maxX = Math.max(L, cx);
        const width = maxX - minX;
        const scale = Math.min(1, 150 / cy, 320 / width);
        const ox = (400 - width * scale) / 2;
        const f = (x: number, y: number): Pt => [ox + (x - minX) * scale, 190 - y * scale];
        pts = [f(0, 0), f(L, 0), f(cx, cy)];
    }

    const maxAng = Math.max(angA, angB, angC);
    const byAngles = maxAng === 90 ? "right" : maxAng > 90 ? "obtuse" : "acute";
    const bySides =
        angA === angB && angB === angC
        ? "equilateral"
        : angA === angB || angB === angC || angA === angC
        ? "isosceles"
        : "scalene";

    const cen = pts ? centroid(pts) : ([0, 0] as Pt);

    return (
        <div className={WIDGET}>
        <p className="mb-3 text-sm text-mute">
            Choose any two angles. The third angle is forced — see how the three always fill a straight line.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
            <Slider id="as-a" label="Angle A" value={angA} min={10} max={160} step={5} suffix="°" tone="text-brand2" onChange={setAngA} />
            <Slider id="as-b" label="Angle B" value={angB} min={10} max={160} step={5} suffix="°" tone="text-brand3" onChange={setAngB} />
        </div>

        {valid && pts ? (
            <svg
            viewBox="0 0 400 220"
            className="mt-3 h-auto w-full rounded-xl border border-line bg-page"
            role="img"
            aria-label="A triangle drawn from the two chosen angles"
            >
            <polygon
                points={pointsAttr([...pts])}
                fill="currentColor"
                fillOpacity={0.12}
                stroke="currentColor"
                strokeWidth={3}
                strokeLinejoin="round"
                className="text-brand"
            />
            {pts.map((p, i) => {
                const q = away(p, cen, 15);
                return (
                <text
                    key={`ang${i}`}
                    x={q[0]}
                    y={q[1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={14}
                    fontWeight={700}
                    fill="currentColor"
                    className="text-fg"
                >
                    {["A", "B", "C"][i]}
                </text>
                );
            })}
            </svg>
        ) : (
            <div className="mt-3 rounded-xl border border-brand4/40 bg-page p-4">
            <p className="font-semibold text-accent">No triangle is possible.</p>
            <p className="mt-1 text-sm text-mute">
                {angA}° + {angB}° = {angA + angB}° already uses up 180° or more, so nothing is left for the third angle.
            </p>
            </div>
        )}

        <div className="mt-3" aria-label="The three angles placed side by side on a straight line">
            <div className="flex h-9 w-full overflow-hidden rounded-lg border border-line">
            <div style={{ width: `${(angA / 180) * 100}%` }} className="border-r border-line bg-brand2/25" />
            <div style={{ width: `${(angB / 180) * 100}%` }} className="border-r border-line bg-brand3/25" />
            {valid && <div style={{ width: `${(angC / 180) * 100}%` }} className="bg-brand4/25" />}
            </div>
            <p className="mt-1 text-xs text-mute">The whole bar is a straight angle, 180°.</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Angle A</p>
            <p className="font-semibold text-brand2">{angA}°</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Angle B</p>
            <p className="font-semibold text-brand3">{angB}°</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Angle C = 180° − A − B</p>
            <p className={valid ? "font-semibold text-brand4" : "font-semibold text-accent"}>{valid ? `${angC}°` : "—"}</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Sum of all three</p>
            <p className="font-semibold text-fg">{valid ? "180°" : `${angA + angB}°+`}</p>
            </div>
        </div>

        {valid && (
            <p className="mt-3 text-sm text-fg">
            By angles it is <Hl>{byAngles}</Hl>
            {" "}and by sides it is <Hl>{bySides}</Hl>.
            </p>
        )}
        </div>
    );
    }

    /* ---------- static figure: angle sum proof ---------- */

    function ProofFigure() {
    const A: Pt = [70, 190];
    const B: Pt = [330, 190];
    const C: Pt = [200, 60];
    return (
        <svg
        viewBox="0 0 400 220"
        className="h-auto w-full"
        role="img"
        aria-label="Triangle ABC with a line through C parallel to AB, showing that the three angles of the triangle fit together on a straight line"
        >
        <line x1={30} y1={60} x2={370} y2={60} stroke="currentColor" strokeWidth={2} className="text-mute" />
        <polygon
            points={pointsAttr([A, B, C])}
            fill="currentColor"
            fillOpacity={0.1}
            stroke="currentColor"
            strokeWidth={3}
            strokeLinejoin="round"
            className="text-brand"
        />
        <path d={arcPath(A, 28, 0, 45)} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-brand2" />
        <path d={arcPath(C, 28, 180, 225)} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-brand2" />
        <path d={arcPath(B, 28, 135, 180)} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-brand3" />
        <path d={arcPath(C, 28, 315, 360)} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-brand3" />
        <path d={arcPath(C, 28, 225, 315)} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-brand4" />
        <g fontSize={14} fontWeight={700} fill="currentColor" textAnchor="middle" dominantBaseline="middle">
            <text x={108} y={176} className="text-brand2">a</text>
            <text x={163} y={76} className="text-brand2">a</text>
            <text x={293} y={176} className="text-brand3">b</text>
            <text x={237} y={76} className="text-brand3">b</text>
            <text x={200} y={104} className="text-brand4">c</text>
            <text x={56} y={206} className="text-fg">A</text>
            <text x={344} y={206} className="text-fg">B</text>
            <text x={200} y={44} className="text-fg">C</text>
        </g>
        </svg>
    );
    }

    /* ---------- quick quiz ---------- */

    interface QuizQ {
    q: string;
    options: string[];
    answer: number;
    why: string;
    }

    const QUIZ: QuizQ[] = [
    {
        q: "Which set of lengths (in cm) can be the sides of a triangle?",
        options: ["2, 3, 6", "4, 4, 8", "5, 7, 10", "1, 2, 3"],
        answer: 2,
        why: "5 + 7 = 12 is greater than 10, and the other two checks pass too. In the others the two shorter sides add up to 5, 8 and 3, which is less than or equal to the longest side.",
    },
    {
        q: "Two angles of a triangle are 48° and 67°. What is the third angle?",
        options: ["55°", "65°", "75°", "115°"],
        answer: 1,
        why: "48° + 67° = 115°, and 180° − 115° = 65°.",
    },
    {
        q: "A triangle has sides 6 cm, 6 cm and 9 cm. What kind of triangle is it?",
        options: ["Equilateral", "Isosceles", "Scalene", "Not possible"],
        answer: 1,
        why: "Two sides are equal, so it is isosceles. It exists because 6 + 6 = 12 is greater than 9.",
    },
    {
        q: "Which of these can a triangle NOT have?",
        options: [
        "Two right angles",
        "Three acute angles",
        "One obtuse angle and two acute angles",
        "One right angle and two acute angles",
        ],
        answer: 0,
        why: "Two right angles make 90° + 90° = 180°, leaving 0° for the third angle. That is impossible.",
    },
    {
        q: "What is each angle of an equilateral triangle?",
        options: ["30°", "45°", "60°", "90°"],
        answer: 2,
        why: "The three angles are equal and add up to 180°, so each is 180° ÷ 3 = 60°.",
    },
    {
        q: "In an obtuse triangle, where does the altitude from a vertex with an acute angle fall?",
        options: ["Inside the triangle", "Outside the triangle", "Along a side", "It cannot be drawn"],
        answer: 1,
        why: "The opposite side must be extended, and the altitude meets that extension outside the triangle.",
    },
    {
        q: "You try to build a triangle on a 7 cm base using arcs of radius 3 cm from each end. What happens?",
        options: [
        "A triangle forms",
        "The arcs just touch",
        "The arcs never meet, so there is no triangle",
        "Two different triangles form",
        ],
        answer: 2,
        why: "3 + 3 = 6 is less than 7, so the two arcs are too short to reach each other.",
    },
    {
        q: "A triangle has angles 90°, 35° and 55°. What kind of triangle is it?",
        options: ["Acute", "Right", "Obtuse", "Equilateral"],
        answer: 1,
        why: "It has one angle of exactly 90°, so it is a right triangle.",
    },
    ];

    function Quiz() {
    const [picked, setPicked] = useState<Record<number, number>>({});
    const answered = Object.keys(picked).length;
    const score = QUIZ.filter((item, i) => picked[i] === item.answer).length;

    return (
        <div className={WIDGET}>
        <div className="space-y-5">
            {QUIZ.map((item, qi) => {
            const chosen = picked[qi];
            const done = chosen !== undefined;
            return (
                <div key={`quiz${qi}`}>
                <p className="text-sm font-semibold text-fg">
                    <span className="mr-1.5 text-brand">{qi + 1}.</span>
                    {item.q}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {item.options.map((opt, oi) => {
                    let cls = "rounded-lg border border-brand/40 bg-page px-3 py-2 text-left text-sm text-fg";
                    if (done && oi === item.answer) cls = "rounded-lg border border-brand2 bg-brand2/15 px-3 py-2 text-left text-sm text-fg";
                    else if (done && oi === chosen) cls = "rounded-lg border border-brand4 bg-brand4/15 px-3 py-2 text-left text-sm text-fg";
                    return (
                        <button
                        key={`quiz${qi}opt${oi}`}
                        type="button"
                        disabled={done}
                        onClick={() => setPicked((prev) => ({ ...prev, [qi]: oi }))}
                        className={cls}
                        >
                        {done && oi === item.answer ? "✓ " : done && oi === chosen ? "✗ " : ""}
                        {opt}
                        </button>
                    );
                    })}
                </div>
                {done && (
                    <p className="mt-2 text-sm">
                    <span className={chosen === item.answer ? "font-semibold text-ok" : "font-semibold text-accent"}>
                        {chosen === item.answer ? "Correct. " : "Not quite. "}
                    </span>
                    <span className="text-mute">{item.why}</span>
                    </p>
                )}
                </div>
            );
            })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <p aria-live="polite" className="text-sm font-semibold text-fg">
            {answered === QUIZ.length
                ? `Final score: ${score} out of ${QUIZ.length}`
                : `Answered ${answered} of ${QUIZ.length}`}
            </p>
            <button type="button" aria-label="Reset the quiz and clear all answers" onClick={() => setPicked({})} className={BTN_SECONDARY}>
            Reset quiz
            </button>
        </div>
        </div>
    );
    }

    /* ---------- the note ---------- */

    export default function TaleOfThreeIntersectingLinesNote() {
    return (
        <Note
        title="A Tale of Three Intersecting Lines"
        intro="Draw three straight lines so that every pair of them crosses, and, if the three crossing points are different, they fence off a small region with three corners. That region is a triangle. In this chapter you will name its parts, sort triangles into families, build them with a ruler and a compass, discover why some sets of three lengths can never make a triangle, and learn the famous rule that the three angles always add up to 180°."
        colors={colors}
        >
        <Section title="1. Three Lines, One Triangle">
            <p>
            A <Hl>triangle</Hl> is a closed shape made by three line segments (parts of straight lines with two end
            points). Its parts have special names:
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand2">
            <li>
                <Hl>Vertices</Hl> (corner points where two sides meet): a triangle has three, usually named A, B and C.
            </li>
            <li>
                <Hl>Sides</Hl>: the three segments AB, BC and CA that join the vertices.
            </li>
            <li>
                <Hl>Angles</Hl>: at each vertex the two sides form an interior angle (an angle on the inside of the
                shape), written ∠A, ∠B and ∠C.
            </li>
            </ul>
            <div className="mx-auto mt-4 max-w-xs">
            <Tri
                pts={[[40, 122], [160, 122], [95, 32]]}
                label="Triangle ABC with its vertices A, B, C and its sides a, b, c labelled"
                tone="text-brand"
                vertexLabels={["A", "B", "C"]}
                sideLabels={["c", "a", "b"]}
            />
            <p className="text-center text-xs text-mute">
                Triangle ABC. Side a is opposite A, side b is opposite B, and side c is opposite C.
            </p>
            </div>
            <p className="mt-3">
            We write the whole triangle as <Hl>△ABC</Hl>. The word “triangle” itself tells the story: three angles.
            </p>
            <Callout>
            A triangle needs the three lines to cross in <Hl>three different points</Hl>. If all three lines pass
            through one common point they enclose nothing, and if two of them are parallel (never meet) they cross
            at only two points.
            </Callout>
        </Section>

        <Section title="2. Types of Triangles by Their Sides">
            <p>Triangles come in three families, depending on how many of their sides are equal in length.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-3">
                <Tri
                pts={[[45, 122], [155, 122], [100, 26.7]]}
                label="An equilateral triangle with all three sides 5 centimetres"
                tone="text-brand"
                sideLabels={["5 cm", "5 cm", "5 cm"]}
                />
                <p className="text-center text-sm font-semibold text-brand">Equilateral</p>
            </div>
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-3">
                <Tri
                pts={[[60, 122], [140, 122], [100, 30]]}
                label="An isosceles triangle with two sides 5 centimetres and base 4 centimetres"
                tone="text-brand2"
                sideLabels={["4 cm", "5 cm", "5 cm"]}
                />
                <p className="text-center text-sm font-semibold text-brand2">Isosceles</p>
            </div>
            <div className="rounded-xl border border-brand3/30 bg-brand3/10 p-3">
                <Tri
                pts={[[46, 122], [154, 122], [86.5, 62.5]]}
                label="A scalene triangle with sides 6, 5 and 4 centimetres"
                tone="text-brand3"
                sideLabels={["6 cm", "5 cm", "4 cm"]}
                />
                <p className="text-center text-sm font-semibold text-brand3">Scalene</p>
            </div>
            </div>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Type</th>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Sides</th>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Example</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">Equilateral</td>
                    <td className="border border-line p-2">All three sides equal</td>
                    <td className="border border-line p-2">5 cm, 5 cm, 5 cm</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Isosceles</td>
                    <td className="border border-line p-2">Two sides equal</td>
                    <td className="border border-line p-2">5 cm, 5 cm, 4 cm</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Scalene</td>
                    <td className="border border-line p-2">All three sides different</td>
                    <td className="border border-line p-2">6 cm, 5 cm, 4 cm</td>
                </tr>
                </tbody>
            </table>
            </div>
        </Section>

        <Section title="3. The Equilateral Triangle — Built with Only a Compass Idea">
            <p>
            Among all triangles, the <Hl>equilateral triangle</Hl> is the most symmetric (balanced, looking the same
            from many directions): every side is equal, and, as you will prove in Section 9, every angle is 60°.
            </p>
            <p className="mt-3">To construct one with side 5 cm:</p>
            <ol className="mt-3 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>Draw a base PQ = 5 cm with a ruler.</li>
            <li>Open the compass to exactly 5 cm. Put its point on P and draw an arc above the base.</li>
            <li>Keep the same opening, put the point on Q and draw a second arc that crosses the first. Call the crossing point R.</li>
            <li>Join PR and QR. Triangle PQR is equilateral.</li>
            </ol>
            <Callout>
            <Hl>Why it works:</Hl> R lies on an arc 5 cm from P and on an arc 5 cm from Q. So PR = 5 cm and QR = 5 cm,
            and PQ = 5 cm was the base. All three sides are equal.
            </Callout>
        </Section>

        <Section title="4. Constructing a Triangle When Three Sides Are Given">
            <p>
            The same arc idea works for any three lengths. The compass is clever because it{" "}
            <Hl>copies a length without needing numbers</Hl>: once opened to 4 cm, every arc it draws is 4 cm from
            the point on which it stands. Step through the construction of a triangle with sides 4 cm, 5 cm and 6 cm.
            </p>
            <div className="mt-4">
            <ConstructionStepper />
            </div>
            <Callout>
            Check your accuracy: measure PR and QR with the ruler afterwards. If they differ from 4 cm and 5 cm, the
            compass slipped or was opened a little wrongly. Changing the three numbers gives equilateral, isosceles or
            scalene triangles with the same method.
            </Callout>
        </Section>

        <Section title="5. Can Any Three Lengths Make a Triangle? The Triangle Inequality">
            <p>
            Try to build a triangle with sides 2 cm, 3 cm and 6 cm. The arcs from the two ends of the 6 cm base are
            only 2 cm and 3 cm long, so they cannot meet. Some sets of lengths simply fail. The rule that decides it
            is called the <Hl>triangle inequality</Hl> (a statement saying one quantity is bigger than another):
            </p>
            <Callout>
            <Hl>Triangle inequality:</Hl> in a triangle, the sum of the lengths of any two sides is greater than the
            length of the third side.
            </Callout>
            <p className="mt-3">
            Play with the lab below. Drag the sliders and watch the two circles. A triangle appears exactly when the
            circles cross.
            </p>
            <div className="mt-4">
            <TriangleLab />
            </div>

            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Lengths (cm)</th>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Key check</th>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Triangle?</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">3, 4, 5</td>
                    <td className="border border-line p-2">{"3 + 4 = 7 > 5"}</td>
                    <td className="border border-line p-2 font-semibold text-ok">Yes</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">5, 7, 10</td>
                    <td className="border border-line p-2">{"5 + 7 = 12 > 10"}</td>
                    <td className="border border-line p-2 font-semibold text-ok">Yes</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">2, 3, 6</td>
                    <td className="border border-line p-2">{"2 + 3 = 5, not > 6"}</td>
                    <td className="border border-line p-2 font-semibold text-accent">No</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">4, 4, 8</td>
                    <td className="border border-line p-2">{"4 + 4 = 8, not > 8"}</td>
                    <td className="border border-line p-2 font-semibold text-accent">No (flat line)</td>
                </tr>
                </tbody>
            </table>
            </div>

            <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-brand3">
            <li>
                <Hl>Shortcut:</Hl> you only need to test the two shorter sides against the longest side. If they add up
                to more, the other two checks pass automatically.
            </li>
            <li>
                <Hl>When the sum is exactly equal</Hl> (like 4, 4, 8), the two arcs just touch on the base, so the
                “triangle” is squashed flat into a line.
            </li>
            </ul>
            <Callout>
            <Hl>Why is it true?</Hl> The straight line is the shortest path between two points. Going from B to C
            directly along side BC is shorter than taking the detour B to A to C. So BC is shorter than AB + AC.
            </Callout>
            <Callout>
            <Hl>Try it with straws:</Hl> cut three straws of lengths 3 cm, 4 cm and 5 cm and join their ends. You get a
            triangle. Now try 2 cm, 3 cm and 6 cm. The two short straws lie flat along the long one and never close up.
            </Callout>
        </Section>

        <Section title="6. Constructing a Triangle When Sides and Angles Are Given">
            <p>
            Sometimes we are given angles as well as sides. Angles are drawn with a <Hl>protractor</Hl> (a
            half-circle tool for measuring and drawing angles). Two situations always give a single triangle.
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand">
            <li>
                <Hl>Two sides and the angle between them (SAS).</Hl> Example: AB = 6 cm, AC = 4 cm, ∠A = 50°. Draw
                AB = 6 cm. At A draw a ray (a line with one starting point) making 50° with AB. Mark C on the ray 4 cm
                from A. Join BC.
            </li>
            <li>
                <Hl>Two angles and the side between them (ASA).</Hl> Example: AB = 5 cm, ∠A = 50°, ∠B = 60°. Draw
                AB = 5 cm. At A draw a ray at 50°, and at B draw a ray at 60°. The rays cross at C. The third angle
                is forced: ∠C = 180° − 50° − 60° = 70°.
            </li>
            </ul>
            <p className="mt-3">
            Use the builder to see how the angle between two fixed sides decides everything else.
            </p>
            <div className="mt-4">
            <SasBuilder />
            </div>
            <Callout>
            Notice the difference from Section 5. Three lengths can fail to make a triangle, but two sides with the
            angle between them <Hl>always</Hl> make exactly one. Also, three angles alone do not fix the size: a big
            and a small triangle can have the same angles. That is why we need at least one side too.
            </Callout>
            <Callout>
            <Hl>Be careful:</Hl> if the given angle is not between the two given sides, the information may not fix
            a single triangle.
            </Callout>
        </Section>

        <Section title="7. Altitudes of a Triangle">
            <p>
            An <Hl>altitude</Hl> is the perpendicular (meeting at exactly 90°) line segment drawn from a vertex to the
            line containing the opposite side. The point where it lands is called its foot. Every triangle has{" "}
            <Hl>three altitudes</Hl>, one from each vertex. Choose a triangle and a vertex below.
            </p>
            <div className="mt-4">
            <AltitudeViewer />
            </div>
            <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-brand4">
            <li>In an <Hl>acute</Hl> triangle all three altitudes lie inside the triangle.</li>
            <li>In a <Hl>right</Hl> triangle two altitudes are the two sides that make the right angle.</li>
            <li>
                In an <Hl>obtuse</Hl> triangle two altitudes lie outside, and you must extend the opposite side to
                meet them.
            </li>
            </ul>
            <p className="mt-4 font-semibold text-fg">Drawing an altitude with a set square</p>
            <ol className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand2">
            <li>Pick a vertex, for example A. The opposite side is BC.</li>
            <li>Lay a ruler along BC. If the foot will fall outside, extend BC with the ruler first.</li>
            <li>Place one edge of the right angle of a set square (a triangular drawing tool with a 90° corner) against the ruler.</li>
            <li>Slide the set square along the ruler until its other edge of the right angle touches A.</li>
            <li>Draw along that edge from A down to line BC and mark the right angle.</li>
            </ol>
        </Section>

        <Section title="8. Types of Triangles by Their Angles">
            <p>Triangles can also be sorted by the size of their biggest angle.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-3">
                <Tri
                pts={[[40, 122], [160, 122], [105, 30]]}
                label="An acute triangle where all three angles are less than 90 degrees"
                tone="text-brand"
                vertexLabels={["A", "B", "C"]}
                />
                <p className="text-center text-sm font-semibold text-brand">Acute</p>
                <p className="text-center text-xs text-mute">All three angles less than 90°</p>
            </div>
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-3">
                <Tri
                pts={[[50, 122], [160, 122], [50, 34]]}
                label="A right triangle with a right angle at A"
                tone="text-brand2"
                vertexLabels={["A", "B", "C"]}
                rightAt={0}
                />
                <p className="text-center text-sm font-semibold text-brand2">Right</p>
                <p className="text-center text-xs text-mute">One angle exactly 90°</p>
            </div>
            <div className="rounded-xl border border-brand3/30 bg-brand3/10 p-3">
                <Tri
                pts={[[30, 122], [170, 122], [60, 75]]}
                label="An obtuse triangle with an obtuse angle at C"
                tone="text-brand3"
                vertexLabels={["A", "B", "C"]}
                />
                <p className="text-center text-sm font-semibold text-brand3">Obtuse</p>
                <p className="text-center text-xs text-mute">One angle more than 90°</p>
            </div>
            </div>
            <Callout>
            A triangle can have <Hl>at most one</Hl> right or obtuse angle. If it had two, those two angles alone
            would add up to 180° or more, leaving nothing for the third. The next section makes this precise.
            </Callout>
        </Section>

        <Section title="9. The Angle Sum Property">
            <Callout>
            <Hl>Angle sum property:</Hl> the three interior angles of any triangle, whatever its shape or size, always
            add up to 180°.
            </Callout>
            <p className="font-hand mt-3 text-center text-3xl text-brand">∠A + ∠B + ∠C = 180°</p>

            <p className="mt-4 font-semibold text-fg">See it: tear and line up</p>
            <p className="mt-1">
            Draw any triangle on paper and colour its three corners differently. Tear the corners off and place them
            side by side with their points together. They always fit exactly along a straight line, which is a
            180° angle.
            </p>

            <p className="mt-4 font-semibold text-fg">Prove it: a parallel line through one vertex</p>
            <div className="mx-auto mt-2 max-w-lg">
            <ProofFigure />
            </div>
            <ol className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand2">
            <li>Through C draw a line parallel to the side AB (the grey line).</li>
            <li>
                Because the lines are parallel, the angle marked a at C equals ∠A, and the angle marked b at C equals
                ∠B. These are alternate angles, from the chapter on parallel lines.
            </li>
            <li>At C, the angles a, c and b sit side by side on a straight line, so a + c + b = 180°.</li>
            <li>Therefore ∠A + ∠C + ∠B = 180°.</li>
            </ol>

            <p className="mt-4 font-semibold text-fg">Experiment: the angle sum lab</p>
            <div className="mt-2">
            <AngleSumLab />
            </div>

            <p className="mt-4 font-semibold text-fg">What the property tells us</p>
            <ul className="mt-2 list-disc space-y-3 pl-5 marker:text-brand3">
            <li>
                <Hl>Find the third angle:</Hl> if two angles are 45° and 65°, the third is 180° − 45° − 65° = 70°.
            </li>
            <li>
                <Hl>Equilateral triangle:</Hl> its three angles are equal, so each is 180° ÷ 3 = 60°.
            </li>
            <li>
                <Hl>Isosceles triangle:</Hl> the angles opposite the two equal sides are equal. If the angle between
                the equal sides is 40°, each of the other two is (180° − 40°) ÷ 2 = 70°.
            </li>
            <li>
                <Hl>Only one big angle:</Hl> two right angles or two obtuse angles would already exceed 180°.
            </li>
            <li>
                <Hl>Extension — exterior angle:</Hl> if you extend side BC beyond C, the angle outside at C forms a
                straight line with ∠C. In a triangle with ∠A = 50° and ∠B = 60°, ∠C = 70° and the exterior angle is
                180° − 70° = 110°, which equals 50° + 60°.
            </li>
            </ul>
        </Section>

        <Section title="10. Common Mistakes to Avoid">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand4">
            <li>
                Checking only one pair of sides for the triangle inequality. Compare the two shorter sides with the
                longest.
            </li>
            <li>Accepting a sum that is exactly equal to the third side. It must be strictly greater.</li>
            <li>Opening the compass differently for the second arc, so the lengths copied are not the ones you wanted.</li>
            <li>Drawing an altitude that is not at 90°. Always mark the right angle to double check.</li>
            <li>Forgetting that in an obtuse triangle the altitudes from the acute corners fall outside.</li>
            <li>Believing a triangle can have two right angles or two obtuse angles.</li>
            <li>Mixing up the two ways of naming: by sides (equilateral, isosceles, scalene) and by angles (acute, right, obtuse).</li>
            </ul>
        </Section>

        <Section title="11. Quick Quiz — Check Yourself">
            <p>Choose an answer to see at once whether it is right, with the reason. Your score appears at the end.</p>
            <div className="mt-4">
            <Quiz />
            </div>
        </Section>

        <Section title="12. Practice Questions">
            <p className="font-semibold text-brand">Warm-up</p>
            <ol className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>In △PQR, name the vertices, the sides and the angles.</li>
            <li>Classify by sides: (a) 7 cm, 7 cm, 7 cm (b) 5 cm, 8 cm, 5 cm (c) 4 cm, 6 cm, 9 cm.</li>
            <li>Can a triangle be made with these lengths (cm)? (a) 3, 4, 8 (b) 6, 8, 10 (c) 5, 5, 10 (d) 7, 9, 15.</li>
            </ol>

            <p className="mt-5 font-semibold text-brand2">Core</p>
            <ol start={4} className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand2">
            <li>Two angles of a triangle are 72° and 38°. Find the third angle and say whether the triangle is acute, right or obtuse.</li>
            <li>The angle between the two equal sides of an isosceles triangle is 50°. Find the other two angles.</li>
            <li>Two sides of a triangle are 5 cm and 9 cm. The third side is a whole number of centimetres. List every possible value.</li>
            <li>Write the steps to construct a triangle with sides 5 cm, 6 cm and 7 cm.</li>
            </ol>

            <p className="mt-5 font-semibold text-brand3">Challenge</p>
            <ol start={8} className="mt-2 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand3">
            <li>In △ABC, ∠A = 50° and ∠B = 60°. Side BC is extended beyond C. Find the exterior angle at C.</li>
            <li>The angles of a triangle are in the ratio 2 : 3 : 4. Find each angle and classify the triangle.</li>
            <li>Can a triangle have angles 90°, 60° and 40°? Explain.</li>
            <li>In which kind of triangle are two of the altitudes also sides of the triangle? In which kind do two altitudes fall outside?</li>
            </ol>

            <details className="mt-5 rounded-xl border border-line bg-tint p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand">Show answer key</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mute">
                <li>Vertices: P, Q, R. Sides: PQ, QR, RP. Angles: ∠P, ∠Q, ∠R.</li>
                <li>(a) Equilateral (b) Isosceles (c) Scalene. For (c), 4 + 6 = 10 is greater than 9, so it exists.</li>
                <li>(a) No, because 3 + 4 = 7 is less than 8. (b) Yes. (c) No, because 5 + 5 = 10 is not greater than 10. (d) Yes, because 7 + 9 = 16 is greater than 15.</li>
                <li>180° − 72° − 38° = 70°. All three angles are less than 90°, so it is acute.</li>
                <li>(180° − 50°) ÷ 2 = 65°. The other two angles are 65° each.</li>
                <li>
                The third side x must satisfy 9 − 5 &lt; x &lt; 9 + 5, that is, x is greater than 4 and less than 14.
                The whole numbers are 5, 6, 7, 8, 9, 10, 11, 12, 13 (nine values).
                </li>
                <li>
                Draw PQ = 7 cm. With the compass at 5 cm and centre P, draw an arc. With the compass at 6 cm and centre
                Q, draw another arc that crosses it at R. Join PR and QR.
                </li>
                <li>∠C = 180° − 50° − 60° = 70°. The exterior angle = 180° − 70° = 110° (which is also 50° + 60°).</li>
                <li>The total is 2 + 3 + 4 = 9 parts, and 180° ÷ 9 = 20°. The angles are 40°, 60° and 80°. All are less than 90°, so it is acute.</li>
                <li>No. 90° + 60° + 40° = 190°, which is more than 180°.</li>
                <li>In a right triangle two altitudes are the two sides forming the right angle. In an obtuse triangle two altitudes fall outside.</li>
            </ol>
            </details>
        </Section>

        <Section title="13. Quick Revision Sheet">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand4">
            <li>
                A triangle has <Hl>3 vertices, 3 sides and 3 angles</Hl>. It is formed by three lines that cross in three
                different points.
            </li>
            <li>
                By sides: <Hl>equilateral</Hl> (all equal), <Hl>isosceles</Hl> (two equal), <Hl>scalene</Hl> (all different).
            </li>
            <li>
                By angles: <Hl>acute</Hl> (all less than 90°), <Hl>right</Hl> (one 90°), <Hl>obtuse</Hl> (one more than 90°).
            </li>
            <li>
                <Hl>Three sides given:</Hl> draw the base, then cross two arcs to find the third vertex.
            </li>
            <li>
                <Hl>Triangle inequality:</Hl> the sum of any two sides is greater than the third. Test the two shorter
                sides against the longest.
            </li>
            <li>
                <Hl>SAS and ASA</Hl> (two sides with the angle between, or two angles with the side between) always give
                one triangle.
            </li>
            <li>
                An <Hl>altitude</Hl> is a perpendicular from a vertex to the opposite side (extended if needed). There
                are three in every triangle.
            </li>
            <li>
                <Hl>Angle sum property:</Hl> ∠A + ∠B + ∠C = 180°. So an equilateral triangle has 60° angles, and a
                triangle has at most one right or obtuse angle.
            </li>
            </ul>
            <Callout>
            <Hl>Coming up next:</Hl> in the second part of the book, the chapter “Geometric Twins” asks when two
            triangles are exact copies of each other. The sides, angles and constructions you met here are the tools it
            uses.
            </Callout>
        </Section>
        </Note>
    );
    }