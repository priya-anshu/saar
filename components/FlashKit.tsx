    "use client";

    import { useEffect, useMemo, useRef, useState } from "react";
    import { usePathname } from "next/navigation";
    import {
    ArrowLeft,
    Check,
    Layers,
    Lightbulb,
    List,
    RotateCcw,
    Search,
    SearchX,
    Shuffle,
    Trophy,
    X,
    } from "lucide-react";
    import { useProgress } from "@/lib/store";
    import { Note, Section, type NoteColors } from "./NoteKit";

    export type Flashcard = { front: string; back: string; hint?: string };

    const TONE = ["text-brand", "text-brand2", "text-brand3", "text-brand4"];
    const EDGE = ["border-l-brand", "border-l-brand2", "border-l-brand3", "border-l-brand4"];

    const btnPrimary =
    "flex items-center justify-center gap-2 rounded-lg border border-brand bg-brand px-5 py-2 text-sm font-semibold text-page transition hover:opacity-90";
    const btnGhost =
    "flex items-center justify-center gap-2 rounded-lg border border-brand/50 px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10";

    function shuffled<T>(list: T[]): T[] {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
    }

    // Which cards this student already knows (saved per deck on this device)
    function useDeck(total: number) {
    const pathname = usePathname();
    const id = decodeURIComponent(pathname).replace(/^\/note\//, "").replace(/\/$/, "");
    const { progress, setCardsKnown } = useProgress();
    const stored = progress.cards[id]?.known;
    const known = useMemo(() => new Set((stored ?? []).filter((i) => i < total)), [stored, total]);
    return { id, known, setCardsKnown };
    }

    /* --------------------------- FLASHCARDS --------------------------- */

    function CardsMode({ cards }: { cards: Flashcard[] }) {
    const total = cards.length;
    const { id, known, setCardsKnown } = useDeck(total);
    const cardRef = useRef<HTMLButtonElement>(null);

    const [queue, setQueue] = useState<number[]>(() => cards.map((_, i) => i));
    const [pos, setPos] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [hint, setHint] = useState(false);
    const [finished, setFinished] = useState(false);

    const start = (list: number[]) => {
        setQueue(list);
        setPos(0);
        setFlipped(false);
        setHint(false);
        setFinished(false);
    };

    const mark = (gotIt: boolean) => {
        const idx = queue[pos];
        if (idx === undefined) return;
        const next = new Set(known);
        if (gotIt) next.add(idx);
        else next.delete(idx);
        setCardsKnown(id, [...next], total);

        setFlipped(false);
        setHint(false);
        if (pos + 1 < queue.length) setPos(pos + 1);
        else setFinished(true);
        cardRef.current?.focus({ preventScroll: true });
    };

    // Arrow keys: right = got it, left = still learning (Space flips the focused card)
    useEffect(() => {
        if (finished || queue.length === 0) return;
        const onKey = (e: KeyboardEvent) => {
        const t = e.target as HTMLElement;
        if (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
        if (e.key === "ArrowRight") {
            e.preventDefault();
            mark(true);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            mark(false);
        }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    if (total === 0) return <p className="text-mute">No cards yet.</p>;

    /* ---------- Finished ---------- */
    if (finished || queue.length === 0) {
        const everyIndex = cards.map((_, i) => i);
        const unknown = everyIndex.filter((i) => !known.has(i));
        const all = unknown.length === 0;

        return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5 text-center sm:p-6">
            {all && <Trophy size={28} className="mx-auto text-brand4" />}
            <p className="font-display mt-2 text-6xl font-semibold text-brand">
            {known.size}
            <span className="text-mute"> / {total}</span>
            </p>
            <p className="mt-2 text-lg font-semibold">
            {all ? "You know every card. Nice work." : `${unknown.length} still to learn`}
            </p>
            <p className="text-sm text-mute">
            {all
                ? "Come back in a few days to keep them fresh."
                : "Review only the cards you are still learning."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
            {!all && (
                <button className={btnPrimary} onClick={() => start(unknown)}>
                <RotateCcw size={16} /> Review {unknown.length} still learning
                </button>
            )}
            <button className={all ? btnPrimary : btnGhost} onClick={() => start(everyIndex)}>
                <Layers size={16} /> Study all again
            </button>
            </div>

            {known.size > 0 && (
            <button
                className="mt-4 text-sm text-mute underline-offset-2 hover:text-fg hover:underline"
                onClick={() => {
                setCardsKnown(id, [], total);
                start(everyIndex);
                }}
            >
                Reset deck progress
            </button>
            )}
        </div>
        );
    }

    /* ---------- A card ---------- */
    const idx = queue[pos];
    const card = cards[idx];

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm text-mute">
            <span>
            Card {pos + 1} of {queue.length} · {known.size}/{total} known
            </span>
            <button
            onClick={() => start(shuffled(queue))}
            className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs transition hover:text-fg"
            >
            <Shuffle size={13} /> Shuffle
            </button>
        </div>

        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-tint">
            <div
            className="h-full rounded-full bg-linear-to-r from-brand to-brand2 transition-all duration-500"
            style={{ width: `${(pos / queue.length) * 100}%` }}
            />
        </div>

        <button
            ref={cardRef}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? "Show the term again" : "Reveal the meaning"}
            className="block w-full rounded-2xl text-left outline-none focus-visible:outline-3 focus-visible:outline-brand [perspective:1200px]"
        >
            <span
            key={`${pos}-${idx}`}
            className={`grid transition-transform duration-500 motion-reduce:transition-none [transform-style:preserve-3d] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            >
            {/* Front */}
            <span
                aria-hidden={flipped}
                className="col-start-1 row-start-1 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-brand/40 bg-brand/10 p-6 text-center [-webkit-backface-visibility:hidden] [backface-visibility:hidden]"
            >
                <span className="text-xs font-medium tracking-widest text-brand uppercase">Term</span>
                <span className="font-display mt-3 text-3xl font-semibold sm:text-4xl">{card.front}</span>
                <span className="mt-6 text-xs text-mute">Tap to reveal the meaning</span>
            </span>

            {/* Back */}
            <span
                aria-hidden={!flipped}
                className="col-start-1 row-start-1 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-brand2/40 bg-brand2/10 p-6 text-center [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
                <span className="text-xs font-medium tracking-widest text-brand2 uppercase">Meaning</span>
                <span className="mt-3 text-lg leading-relaxed sm:text-xl">{card.back}</span>
            </span>
            </span>
        </button>

        {card.hint && !flipped && (
            <div className="mt-3 text-center">
            {hint ? (
                <p className="inline-block rounded-lg bg-brand4/10 px-3 py-2 text-sm">{card.hint}</p>
            ) : (
                <button
                onClick={() => setHint(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand4/50 px-3 py-1.5 text-sm text-brand4 transition hover:bg-brand4/10"
                >
                <Lightbulb size={15} /> Hint
                </button>
            )}
            </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
            <button
            onClick={() => mark(false)}
            className="flex items-center justify-center gap-2 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
            <X size={17} /> Still learning
            </button>
            <button
            onClick={() => mark(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-ok/50 bg-ok/10 px-4 py-3 text-sm font-semibold text-ok transition hover:bg-ok/20"
            >
            <Check size={17} /> Got it
            </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-mute">
            <button
            onClick={() => {
                setPos(pos - 1);
                setFlipped(false);
                setHint(false);
            }}
            disabled={pos === 0}
            className="flex items-center gap-1.5 transition hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
            >
            <ArrowLeft size={14} /> Previous card
            </button>
            <span className="hidden sm:inline">Space flips · ← still learning · → got it</span>
        </div>
        </div>
    );
    }

    /* ---------------------------- GLOSSARY ---------------------------- */

    function ListMode({ cards }: { cards: Flashcard[] }) {
    const { known } = useDeck(cards.length);
    const [q, setQ] = useState("");

    const sorted = useMemo(
        () =>
        cards
            .map((c, i) => ({ c, i }))
            .sort((a, b) => a.c.front.localeCompare(b.c.front)),
        [cards]
    );

    const term = q.trim().toLowerCase();
    const list = term
        ? sorted.filter(({ c }) => `${c.front} ${c.back}`.toLowerCase().includes(term))
        : sorted;

    return (
        <div>
        <div className="flex items-center gap-3 rounded-xl border border-line bg-page px-3">
            <Search size={17} className="shrink-0 text-mute" />
            <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms…"
            aria-label="Search terms"
            className="h-11 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-mute"
            />
        </div>
        <p className="mt-2 text-sm text-mute">
            {list.length} {list.length === 1 ? "term" : "terms"}
        </p>

        {list.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-mute">
            <SearchX size={28} />
            <p className="text-sm">No terms match “{q.trim()}”.</p>
            </div>
        )}

        <div className="mt-2">
            {list.map(({ c, i }, n) => {
            const letter = c.front.charAt(0).toUpperCase();
            const newLetter = !term && (n === 0 || letter !== list[n - 1].c.front.charAt(0).toUpperCase());
            return (
                <div key={i}>
                {newLetter && (
                    <p className="mb-1.5 mt-5 text-xs font-semibold tracking-widest text-mute uppercase">
                    {letter}
                    </p>
                )}
                <div
                    className={`mb-2.5 rounded-xl border border-l-4 border-line bg-card p-4 ${EDGE[i % 4]}`}
                >
                    <p className="flex items-center gap-2 font-semibold">
                    <span className={TONE[i % 4]}>{c.front}</span>
                    {known.has(i) && <Check size={15} className="text-ok" aria-label="Known" />}
                    </p>
                    <p className="mt-1 text-mute">{c.back}</p>
                </div>
                </div>
            );
            })}
        </div>
        </div>
    );
    }

    /* ------------------------------ PAGE ------------------------------ */

    export function FlashcardsPage({
    title,
    intro,
    colors,
    cards,
    }: {
    title: string;
    intro?: string;
    colors?: NoteColors;
    cards: Flashcard[];
    }) {
    const [mode, setMode] = useState<"cards" | "list">("cards");

    const tabs = [
        { key: "cards" as const, label: "Flashcards", Icon: Layers },
        { key: "list" as const, label: "Glossary", Icon: List },
    ];

    return (
        <Note title={title} intro={intro} colors={colors}>
        <Section title={`${cards.length} terms`}>
            <div className="mb-1 inline-grid grid-cols-2 gap-1 rounded-xl border border-line bg-tint p-1">
            {tabs.map(({ key, label, Icon }) => (
                <button
                key={key}
                onClick={() => setMode(key)}
                aria-pressed={mode === key}
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm transition ${
                    mode === key
                    ? "border border-line bg-page font-medium text-fg shadow-sm"
                    : "border border-transparent text-mute hover:text-fg"
                }`}
                >
                <Icon size={15} />
                {label}
                </button>
            ))}
            </div>

            {mode === "cards" ? <CardsMode cards={cards} /> : <ListMode cards={cards} />}
        </Section>
        </Note>
    );
    }