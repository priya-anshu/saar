    "use client";

    import { useEffect, useState } from "react";
    import { usePathname } from "next/navigation";
    import {
    CheckCircle2,
    ChevronRight,
    Clock,
    Eye,
    EyeOff,
    Lightbulb,
    Play,
    RotateCcw,
    Shuffle,
    Trophy,
    XCircle,
    type LucideIcon,
    } from "lucide-react";
    import { useProgress } from "@/lib/store";
    import { Note, Section, type NoteColors } from "./NoteKit";

    export type QuizQuestion = {
    q: string;
    options: string[];
    answer: number; // index of the right option, starting at 0
    explain?: string;
    };

    export type PracticeQuestion = {
    q: string;
    answer: string;
    hint?: string;
    steps?: string[];
    marks?: number;
    level?: "easy" | "medium" | "hard";
    };

    export type PracticeSection = { title: string; questions: PracticeQuestion[] };

    const LETTERS = ["A", "B", "C", "D", "E", "F"];
    const LETTER_TONE = ["text-brand", "text-brand2", "text-brand3", "text-brand4"];
    const LEVEL_STYLE = {
    easy: "bg-ok/15 text-ok",
    medium: "bg-brand4/15 text-brand4",
    hard: "bg-accent/15 text-accent",
    };

    const btnPrimary =
    "flex items-center justify-center gap-2 rounded-lg border border-brand bg-brand px-5 py-2 text-sm font-semibold text-page transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";
    const btnGhost =
    "flex items-center justify-center gap-2 rounded-lg border border-brand/50 px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10";

    /* ------------------------------ QUIZ ------------------------------ */

    // Options like "All of the above" must keep their position, so we never shuffle those
    const KEEP_ORDER = /\b(above|none of|all of|both)\b/i;

    function shuffled<T>(list: T[]): T[] {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
    }

    function prepare(src: QuizQuestion[], shuffle: boolean): QuizQuestion[] {
    if (!shuffle) return src;
    return shuffled(src).map((q) => {
        if (q.options.some((o) => KEEP_ORDER.test(o))) return q;
        const order = shuffled(q.options.map((_, i) => i));
        return {
        ...q,
        options: order.map((i) => q.options[i]),
        answer: order.indexOf(q.answer),
        };
    });
    }

    function Switch({
    on,
    onChange,
    label,
    hint,
    Icon,
    }: {
    on: boolean;
    onChange: (v: boolean) => void;
    label: string;
    hint: string;
    Icon: LucideIcon;
    }) {
    return (
        <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
            on ? "border-brand/50 bg-brand/10" : "border-line bg-page hover:border-brand/40"
        }`}
        >
        <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
            on ? "bg-brand/20 text-brand" : "bg-tint text-mute"
            }`}
        >
            <Icon size={17} />
        </span>
        <span className="min-w-0 flex-1">
            <span className="block font-medium">{label}</span>
            <span className="block text-sm text-mute">{hint}</span>
        </span>
        <span
            className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
            on ? "border-brand bg-brand" : "border-line bg-tint"
            }`}
        >
            <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-page transition-all ${
                on ? "left-5.5" : "left-0.5"
            }`}
            />
        </span>
        </button>
    );
    }

    type Run = { qs: QuizQuestion[]; timed: boolean; retry: boolean };
    type Beat = "first" | "best" | "none" | null;

    function Quiz({ questions, seconds }: { questions: QuizQuestion[]; seconds: number }) {
    const pathname = usePathname();
    const id = decodeURIComponent(pathname).replace(/^\/note\//, "").replace(/\/$/, "");
    const { progress, recordQuiz } = useProgress();
    const stat = progress.quiz[id];

    const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
    const [timed, setTimed] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [run, setRun] = useState<Run>({ qs: questions, timed: false, retry: false });
    const [index, setIndex] = useState(0);
    const [picked, setPicked] = useState<number | null>(null); // -1 means time ran out
    const [chosen, setChosen] = useState<number[]>([]);
    const [left, setLeft] = useState(seconds);
    const [beat, setBeat] = useState<Beat>(null);

    // Countdown: one tick per second while a timed question is open
    useEffect(() => {
        if (phase !== "play" || !run.timed || picked !== null) return;
        const t = setTimeout(() => {
        if (left <= 1) {
            setLeft(0);
            setPicked(-1);
        } else {
            setLeft((l) => l - 1);
        }
        }, 1000);
        return () => clearTimeout(t);
    }, [phase, run.timed, picked, left]);

    if (questions.length === 0) return <p className="text-mute">No questions yet.</p>;

    const begin = (qs: QuizQuestion[], retry: boolean) => {
        setRun({ qs, timed, retry });
        setIndex(0);
        setPicked(null);
        setChosen([]);
        setLeft(seconds);
        setBeat(null);
        setPhase("play");
    };

    const next = () => {
        if (picked === null) return;
        const all = [...chosen, picked];
        setChosen(all);

        if (index + 1 < run.qs.length) {
        setIndex(index + 1);
        setPicked(null);
        setLeft(seconds);
        return;
        }

        if (!run.retry) {
        const score = all.filter((c, k) => c === run.qs[k].answer).length;
        const pct = score / run.qs.length;
        setBeat(!stat ? "first" : pct > stat.best / stat.bestTotal ? "best" : "none");
        recordQuiz(id, score, run.qs.length);
        }
        setPhase("result");
    };

    /* ---------- Start screen ---------- */
    if (phase === "intro") {
        return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5 sm:p-6">
            <p className="text-lg font-semibold">
            {questions.length} questions · pick the best answer
            </p>
            {stat ? (
            <p className="mt-1 flex items-center gap-2 text-sm text-mute">
                <Trophy size={15} className="text-brand4" />
                Your best: {stat.best}/{stat.bestTotal} · {stat.attempts}{" "}
                {stat.attempts === 1 ? "attempt" : "attempts"}
            </p>
            ) : (
            <p className="mt-1 text-sm text-mute">You haven’t tried this one yet.</p>
            )}

            <div className="mt-5 space-y-2.5">
            <Switch
                on={timed}
                onChange={setTimed}
                Icon={Clock}
                label="Timed"
                hint={`${seconds} seconds per question`}
            />
            <Switch
                on={shuffle}
                onChange={setShuffle}
                Icon={Shuffle}
                label="Shuffle"
                hint="Questions and options in a random order"
            />
            </div>

            <button className={`${btnPrimary} mt-5`} onClick={() => begin(prepare(questions, shuffle), false)}>
            <Play size={16} /> {stat ? "Start again" : "Start quiz"}
            </button>
        </div>
        );
    }

    /* ---------- Result screen ---------- */
    if (phase === "result") {
        const total = run.qs.length;
        const score = chosen.filter((c, k) => c === run.qs[k].answer).length;
        const pct = Math.round((score / total) * 100);
        const wrong = run.qs
        .map((q, k) => ({ q, k }))
        .filter(({ q, k }) => chosen[k] !== q.answer);
        const verdict =
        pct === 100
            ? "Perfect score."
            : pct >= 70
            ? "Well done."
            : pct >= 40
            ? "Good start. Review the note and try again."
            : "Read the note once more, then try again.";

        return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5 sm:p-6">
            <div className="text-center">
            {run.retry && (
                <p className="mb-2 text-xs font-medium tracking-widest text-brand2 uppercase">
                Retry round
                </p>
            )}
            <p className="font-display text-6xl font-semibold text-brand">
                {score}
                <span className="text-mute"> / {total}</span>
            </p>
            <p className="mt-2 text-lg font-semibold">{verdict}</p>
            <p className="text-sm text-mute">{pct}% correct</p>

            <p className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full bg-tint px-4 py-1.5 text-sm">
                {run.retry ? (
                <span className="text-mute">Retry rounds don’t change your saved best.</span>
                ) : beat === "best" ? (
                <>
                    <Trophy size={15} className="text-brand4" />
                    <span className="font-medium text-brand4">New personal best!</span>
                </>
                ) : beat === "first" ? (
                <span className="text-mute">First score saved. Try to beat it.</span>
                ) : (
                stat && (
                    <span className="text-mute">
                    Your best: {stat.best}/{stat.bestTotal}
                    </span>
                )
                )}
            </p>
            </div>

            {wrong.length > 0 && (
            <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold tracking-wide text-brand2 uppercase">
                Review your mistakes
                </p>
                {wrong.map(({ q, k }) => (
                <div key={k} className="rounded-xl border border-line bg-page p-4 text-[0.95rem]">
                    <p className="font-medium">{q.q}</p>
                    <p className="mt-2 text-accent">
                    Your answer: {chosen[k] === -1 ? "No answer (time ran out)" : q.options[chosen[k]]}
                    </p>
                    <p className="text-ok">Correct answer: {q.options[q.answer]}</p>
                    {q.explain && <p className="mt-1 text-mute">{q.explain}</p>}
                </div>
                ))}
            </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
            {wrong.length > 0 && (
                <button
                className={btnPrimary}
                onClick={() => begin(wrong.map((w) => w.q), true)}
                >
                <RotateCcw size={16} /> Retry {wrong.length} wrong
                </button>
            )}
            <button
                className={wrong.length > 0 ? btnGhost : btnPrimary}
                onClick={() => begin(prepare(questions, shuffle), false)}
            >
                <Play size={16} /> Full quiz again
            </button>
            </div>
        </div>
        );
    }

    /* ---------- Question screen ---------- */
    const total = run.qs.length;
    const q = run.qs[index];
    const answered = picked !== null;
    const correctSoFar = chosen.filter((c, k) => c === run.qs[k].answer).length;
    const progressPct = ((index + (answered ? 1 : 0)) / total) * 100;
    const low = left <= 5;

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between text-sm text-mute">
            <span>
            {run.retry ? "Retry " : ""}Question {index + 1} of {total}
            </span>
            {run.timed ? (
            <span
                className={`flex items-center gap-1.5 font-semibold tabular-nums ${
                low ? "text-accent" : "text-fg"
                }`}
            >
                <Clock size={15} /> {left}s
            </span>
            ) : (
            <span>{correctSoFar} correct so far</span>
            )}
        </div>

        <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-tint">
            <div
            className="h-full rounded-full bg-linear-to-r from-brand to-brand2 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
            />
        </div>
        {run.timed && (
            <div className="mb-5 h-1 overflow-hidden rounded-full bg-tint">
            <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                low ? "bg-accent" : "bg-brand3"
                }`}
                style={{ width: `${(left / seconds) * 100}%` }}
            />
            </div>
        )}
        {!run.timed && <div className="mb-4" />}

        <p className="mb-4 text-lg font-medium">{q.q}</p>

        <div className="space-y-2.5">
            {q.options.map((opt, o) => {
            const isAnswer = o === q.answer;
            const isPicked = o === picked;
            let state = "border-line bg-page hover:border-brand/60";
            if (answered) {
                state = isAnswer
                ? "border-ok bg-ok/10"
                : isPicked
                ? "border-accent bg-accent/10"
                : "border-line bg-page opacity-60";
            }
            return (
                <button
                key={o}
                disabled={answered}
                onClick={() => setPicked(o)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${state}`}
                >
                <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-tint text-sm font-semibold ${LETTER_TONE[o % 4]}`}
                >
                    {LETTERS[o]}
                </span>
                <span className="flex-1 pt-0.5">{opt}</span>
                {answered && isAnswer && <CheckCircle2 size={20} className="shrink-0 text-ok" />}
                {answered && isPicked && !isAnswer && (
                    <XCircle size={20} className="shrink-0 text-accent" />
                )}
                </button>
            );
            })}
        </div>

        {answered && (
            <div className="mt-4 rounded-r-xl border-l-4 border-brand3 bg-brand3/10 px-4 py-3 text-[0.95rem]">
            <p className="font-semibold">
                {picked === q.answer
                ? "Correct."
                : picked === -1
                ? `Time’s up. The answer is ${LETTERS[q.answer]}.`
                : `Not quite. The answer is ${LETTERS[q.answer]}.`}
            </p>
            {q.explain && <p className="mt-1 text-mute">{q.explain}</p>}
            </div>
        )}

        <button disabled={!answered} onClick={next} className={`${btnPrimary} mt-5`}>
            {index + 1 === total ? "See result" : "Next question"}
            <ChevronRight size={16} />
        </button>
        </div>
    );
    }

    export function QuizPage({
    title,
    intro,
    colors,
    questions,
    seconds = 30,
    }: {
    title: string;
    intro?: string;
    colors?: NoteColors;
    questions: QuizQuestion[];
    seconds?: number;
    }) {
    return (
        <Note title={title} intro={intro} colors={colors}>
        <Section title={`${questions.length} questions`}>
            <Quiz questions={questions} seconds={seconds} />
        </Section>
        </Note>
    );
    }

    /* --------------------------- PRACTICE ---------------------------- */

    function PracticeCard({ n, q, open }: { n: number; q: PracticeQuestion; open: boolean }) {
    const [hint, setHint] = useState(false);
    const [ans, setAns] = useState(open);

    return (
        <article className="rounded-2xl border border-line bg-card p-4 sm:p-5">
        <div className="flex items-start gap-3">
            <span className="sec-bg grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-semibold text-page">
            {n}
            </span>
            <div className="min-w-0 flex-1">
            <p className="font-medium">{q.q}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {q.level && (
                <span className={`rounded-full px-2.5 py-0.5 font-medium ${LEVEL_STYLE[q.level]}`}>
                    {q.level}
                </span>
                )}
                {q.marks && (
                <span className="rounded-full bg-tint px-2.5 py-0.5 text-mute">
                    {q.marks} {q.marks === 1 ? "mark" : "marks"}
                </span>
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {q.hint && (
                <button
                    onClick={() => setHint(!hint)}
                    className="flex items-center gap-1.5 rounded-lg border border-brand4/50 px-3 py-1.5 text-sm text-brand4 transition hover:bg-brand4/10"
                >
                    <Lightbulb size={15} />
                    {hint ? "Hide hint" : "Hint"}
                </button>
                )}
                <button
                onClick={() => setAns(!ans)}
                className="flex items-center gap-1.5 rounded-lg border border-brand/50 px-3 py-1.5 text-sm text-brand transition hover:bg-brand/10"
                >
                {ans ? <EyeOff size={15} /> : <Eye size={15} />}
                {ans ? "Hide answer" : "Show answer"}
                </button>
            </div>

            {hint && q.hint && (
                <p className="mt-3 rounded-lg bg-brand4/10 px-3 py-2 text-sm">{q.hint}</p>
            )}

            {ans && (
                <div className="sec-soft sec-edge mt-3 rounded-r-xl border-l-4 px-4 py-3">
                <p className="text-sm font-semibold tracking-wide uppercase">Answer</p>
                <p className="mt-1">{q.answer}</p>
                {q.steps && q.steps.length > 0 && (
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-mute">
                    {q.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                    ))}
                    </ol>
                )}
                </div>
            )}
            </div>
        </div>
        </article>
    );
    }

    export function PracticePage({
    title,
    intro,
    colors,
    sections,
    }: {
    title: string;
    intro?: string;
    colors?: NoteColors;
    sections: PracticeSection[];
    }) {
    const [allOpen, setAllOpen] = useState(false);
    const [gen, setGen] = useState(0);

    const toggleAll = () => {
        setAllOpen((v) => !v);
        setGen((g) => g + 1);
    };

    const total = sections.reduce((a, s) => a + s.questions.length, 0);
    const starts = sections.map((_, i) =>
        sections.slice(0, i).reduce((a, s) => a + s.questions.length, 0)
    );

    return (
        <Note title={title} intro={intro} colors={colors}>
        <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-mute">{total} questions · try each one before opening the answer</p>
            <button
            onClick={toggleAll}
            className="rounded-lg border border-brand/50 px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand/10"
            >
            {allOpen ? "Hide all answers" : "Show all answers"}
            </button>
        </div>

        {sections.map((sec, si) => (
            <Section key={sec.title} title={sec.title}>
            <div className="space-y-4">
                {sec.questions.map((q, qi) => (
                <PracticeCard
                    key={`${gen}-${si}-${qi}`}
                    n={starts[si] + qi + 1}
                    q={q}
                    open={allOpen}
                />
                ))}
            </div>
            </Section>
        ))}
        </Note>
    );
    }