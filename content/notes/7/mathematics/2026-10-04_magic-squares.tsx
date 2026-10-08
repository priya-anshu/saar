    "use client";

    import { useState } from "react";
    import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";
    type Cell = [number, number];
    type Line = { name: string; cells: Cell[] };
    type Grid = string[][];

    const blank = (n: number): Grid => Array.from({ length: n }, () => Array<string>(n).fill(""));
    const colors: NoteColors = {
    light: ["#0f766e", "#db2777", "#2563eb", "#d97706"],
    dark: ["#2dd4bf", "#f472b6", "#60a5fa", "#fbbf24"],
    };
    const Q7: Grid = [
    ["9", "", ""],
    ["", "6", ""],
    ["5", "", "3"],
    ];
    const Q8: Grid = [
    ["2", "15", "16", ""],
    ["9", "12", "", ""],
    ["", "7", "10", ""],
    ["14", "", "", "17"],
    ];

    function lines(n: number): Line[] {
    const range = Array.from({ length: n }, (_, k) => k);
    const L: Line[] = [];
    for (let i = 0; i < n; i++) {
        L.push({ name: `Row ${i + 1}`, cells: range.map((k) => [i, k] as Cell) });
        L.push({ name: `Column ${i + 1}`, cells: range.map((k) => [k, i] as Cell) });
    }
    L.push({ name: "Diagonal", cells: range.map((k) => [k, k] as Cell) });
    L.push({ name: "Other diagonal", cells: range.map((k) => [k, n - 1 - k] as Cell) });
    return L;
    }

    const ctl =
    "rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm text-fg outline-none focus-visible:outline-2 focus-visible:outline-brand";
    const goBtn =
    "rounded-lg border border-brand bg-brand px-4 py-1.5 text-sm font-semibold text-page transition hover:opacity-90";
    const cellInput =
    "h-14 w-14 rounded-none border border-brand/40 p-0 text-center font-hand text-3xl font-semibold outline-none focus-visible:relative focus-visible:outline-3 focus-visible:outline-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

    function Square({ values, found }: { values: number[][]; found: string[] }) {
    const n = values.length;
    return (
        <div className="overflow-x-auto">
        <div
            className="inline-grid border-2 border-brand"
            style={{ gridTemplateColumns: `repeat(${n}, 3.5rem)` }}
        >
            {values.flatMap((row, r) =>
            row.map((v, c) => (
                <div
                key={`${r}-${c}`}
                className={`grid h-14 w-14 place-items-center border border-brand/40 font-hand text-3xl font-semibold ${
                    found.includes(`${r}-${c}`) ? "bg-brand2/10 text-brand2" : "bg-page text-fg"
                }`}
                >
                {v}
                </div>
            ))
            )}
        </div>
        </div>
    );
    }

    function Solver() {
    const [n, setN] = useState(4);
    const [grid, setGrid] = useState<Grid>(Q8);
    const [S, setS] = useState("");
    const [found, setFound] = useState<Set<string>>(new Set());
    const [steps, setSteps] = useState<string[]>([]);
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

    const reset = (size: number, data?: Grid) => {
        setN(size);
        setGrid(data ?? blank(size));
        setS("");
        setFound(new Set());
        setSteps([]);
        setMsg(null);
    };

    const edit = (r: number, c: number, v: string) => {
        setGrid((g) => g.map((row, i) => (i === r ? row.map((x, j) => (j === c ? v : x)) : row)));
        setFound((f) => {
        const next = new Set(f);
        next.delete(`${r}-${c}`);
        return next;
        });
    };

    const solve = () => {
        const m: (number | null)[][] = grid.map((row) =>
        row.map((v) => (v.trim() === "" ? null : Number(v)))
        );
        const L = lines(n);
        const out: string[] = [];
        const known = (l: Line) =>
        l.cells.map(([r, c]) => m[r][c]).filter((v): v is number => v !== null);

        let sum: number | null = S !== "" ? Number(S) : null;
        if (sum === null) {
        const full = L.find((l) => known(l).length === n);
        if (full) {
            const v = known(full);
            sum = v.reduce((a, b) => a + b, 0);
            out.push(`${full.name} is complete: ${v.join(" + ")} = ${sum}, so magic sum = ${sum}`);
        } else if (n === 3 && m[1][1] !== null) {
            sum = 3 * m[1][1];
            out.push(`3×3 shortcut: magic sum = 3 × centre = 3 × ${m[1][1]} = ${sum}`);
        }
        }

        if (sum === null) {
        setSteps([]);
        setMsg({
            ok: false,
            text: "No complete line to find the magic sum. Type the magic sum in the box and solve again.",
        });
        return;
        }
        const total: number = sum;

        let changed = true;
        while (changed) {
        changed = false;
        for (const l of L) {
            const blanks = l.cells.filter(([r, c]) => m[r][c] === null);
            if (blanks.length === 1) {
            const k = known(l);
            const s = k.reduce((a, b) => a + b, 0);
            const v = total - s;
            const [r, c] = blanks[0];
            m[r][c] = v;
            changed = true;
            out.push(`${l.name}: ${total} − (${k.join(" + ")}) = ${total} − ${s} = ${v}   (row ${r + 1}, col ${c + 1})`);
            }
        }
        }

        const nextFound = new Set(found);
        for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
            if (m[r][c] !== null && grid[r][c].trim() === "") nextFound.add(`${r}-${c}`);

        setGrid(m.map((row) => row.map((v) => (v === null ? "" : String(v)))));
        setFound(nextFound);
        setSteps(out);

        const left = m.flat().filter((v) => v === null).length;
        if (left) {
        setMsg({
            ok: false,
            text: `Stuck: ${left} blank(s) remain and no line has only one. Fill one more number (or try a value) and solve again.`,
        });
        return;
        }

        const bad = L.filter(
        (l) => l.cells.reduce((a, [r, c]) => a + (m[r][c] as number), 0) !== total
        );
        setMsg(
        bad.length
            ? {
                ok: false,
                text: `Filled, but these lines do not add to ${total}: ${bad.map((l) => l.name).join(", ")}. Check the numbers you entered.`,
            }
            : { ok: true, text: `Done. Every row, column and diagonal adds to ${total}.` }
        );
    };

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
            Size
            <select className={ctl} value={n} onChange={(e) => reset(Number(e.target.value))}>
                {[3, 4, 5].map((k) => (
                <option key={k} value={k}>
                    {k}
                </option>
                ))}
            </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
            Magic sum
            <input
                type="number"
                placeholder="auto"
                value={S}
                onChange={(e) => setS(e.target.value)}
                className={`${ctl} w-24`}
            />
            </label>
            <button className={goBtn} onClick={solve}>
            Solve
            </button>
            <button className={ctl} onClick={() => reset(3, Q7)}>
            Q7
            </button>
            <button className={ctl} onClick={() => reset(4, Q8)}>
            Q8
            </button>
            <button className={ctl} onClick={() => reset(n)}>
            Clear
            </button>
        </div>

        <div className="mt-4 overflow-x-auto">
            <div
            className="inline-grid border-2 border-brand"
            style={{ gridTemplateColumns: `repeat(${n}, 3.5rem)` }}
            >
            {grid.flatMap((row, r) =>
                row.map((v, c) => (
                <input
                    key={`${n}-${r}-${c}`}
                    type="number"
                    inputMode="numeric"
                    aria-label={`Row ${r + 1} column ${c + 1}`}
                    value={v}
                    onChange={(e) => edit(r, c, e.target.value)}
                    className={`${cellInput} ${
                    found.has(`${r}-${c}`) ? "bg-brand2/10 text-brand2" : "bg-page text-fg"
                    }`}
                />
                ))
            )}
            </div>
        </div>

        <p
            aria-live="polite"
            className={`mt-3 font-semibold ${msg ? (msg.ok ? "text-ok" : "text-accent") : ""}`}
        >
            {msg?.text}
        </p>

        {steps.length > 0 && (
            <div className="mt-2 font-hand text-xl font-semibold">
            {steps.map((s, i) => (
                <div key={i} className="border-b border-dashed border-brand/30 py-0.5">
                {s}
                </div>
            ))}
            </div>
        )}
        </div>
    );
    }

    export default function MagicSquares() {
    return (
        <Note
        colors={colors}
        title="Magic squares: what they are, why they matter, how to solve any of them"
        intro="Your notebook pages (Q7 and Q8) are exactly this: fill the blanks so every row, column and diagonal adds up to the same number."
        >
        <Section title="What it is">
            <p>
            A magic square is an n × n grid of numbers where every row, every column and both main
            diagonals add up to the same total, called the <Hl>magic sum</Hl> (or magic constant).
            </p>
            <p>
            In your Q7 the diagonal 9 + 6 + 3 gives 18, so the magic sum is 18. The finished square is:
            </p>
            <Square
            values={[
                [9, 2, 7],
                [4, 6, 8],
                [5, 10, 3],
            ]}
            found={["0-1", "0-2", "1-0", "1-2", "2-1"]}
            />
            <Callout>
            <p>
                Every line = 18. A “classic” magic square uses 1 to n² once each, with magic sum
                n(n²+1)/2 (15 for 3×3, 34 for 4×4). Your worksheet squares allow other numbers, so the
                sum comes from the numbers given.
            </p>
            </Callout>
        </Section>

        <Section title="Technique (works for any size)">
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>
                <Hl>Find the magic sum S.</Hl> Look for any row, column or diagonal that is already
                complete and add it. Shortcuts: in a 3×3 square, S = 3 × centre number; in a classic
                n × n square, S = n(n²+1)/2.
            </li>
            <li>
                <Hl>Find a line with exactly one blank.</Hl> The blank = S − (sum of the other numbers
                in that line). Example: first column 9, _, 5 gives 18 − (9 + 5) = 4.
            </li>
            <li>
                <Hl>Write it in and repeat.</Hl> Each new number creates new lines with only one blank.
                Keep going until the grid is full.
            </li>
            <li>
                <Hl>Check.</Hl> Add every row, column and both diagonals. All must equal S. If one
                doesn’t, a number was copied wrongly.
            </li>
            <li>
                <Hl>If you get stuck</Hl> (every line has 2+ blanks): use the diagonals and the numbers
                not yet used (in a classic square), or try a value for one blank and see if the rest
                work out.
            </li>
            </ol>
            <p>
            This is precisely the method in your notebook: diagonal first (18), then first column,
            second row, third column, third row. In Q8 (4×4) the sum is 38 and you did the same, line
            after line.
            </p>
        </Section>

        <Section title="Try it: solver with working shown">
            <p className="text-mute">
            Type numbers, leave blanks empty. Loaded with your Q8 (4×4, S = 38). Use “Q7” to load the
            3×3.
            </p>
            <Solver />
        </Section>

        <Section title="Where this is useful in the real world">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand2">
            <li>
                <Hl>Training logical thinking.</Hl> Solving by “total minus the rest” is the same skill
                as balancing equations and checking accounts in algebra.
            </li>
            <li>
                <Hl>Error detection.</Hl> Equal line sums act like a checksum: if one value is wrong,
                some line no longer matches. Spreadsheets, bookkeeping (trial balance, cross-totals) and
                data tables use the same idea.
            </li>
            <li>
                <Hl>Scheduling and fair design.</Hl> Balanced layouts where every row/column carries
                equal load: tournament and rota planning, balanced sensor or test layouts, fair seating
                or assignment tables. Related Latin and magic-square designs are used in experiment
                design.
            </li>
            <li>
                <Hl>Cryptography and puzzles.</Hl> Magic-square ideas appear in classical ciphers,
                puzzle design and error-correcting code constructions.
            </li>
            <li>
                <Hl>Computing and imaging.</Hl> Balanced arrangements show up in dithering, sampling
                patterns and hardware test layouts where evenness matters.
            </li>
            <li>
                <Hl>Culture and art.</Hl> Famous squares appear in Indian, Chinese and Islamic
                traditions, and in artwork such as the square on Dürer’s <i>Melencolia I</i>.
            </li>
            </ul>
            <Callout>
            <p className="text-mute">
                Honest note: for a school worksheet its main value is practice in reasoning with sums
                and equations; the real-world uses above are mostly the same principles in other
                settings.
            </p>
            </Callout>
        </Section>
        </Note>
    );
    }