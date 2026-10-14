    "use client";

    import { useSyncExternalStore } from "react";

    export type QuizStat = { best: number; bestTotal: number; attempts: number; at: number };
    export type Attempt = { id: string; score: number; total: number; at: number };
    export type DeckStat = { known: number[]; total: number };

    export type Progress = {
    done: string[];
    saved: string[];
    recent: { id: string; at: number }[];
    quiz: Record<string, QuizStat>;
    history: Attempt[];
    days: string[];
    cards: Record<string, DeckStat>;
    };

    const KEY = "saar-progress-v1";
    const EMPTY: Progress = {
    done: [],
    saved: [],
    recent: [],
    quiz: {},
    history: [],
    days: [],
    cards: {},
    };

    let cache: Progress = EMPTY;
    let loaded = false;
    const listeners = new Set<() => void>();

    function load() {
    if (loaded) return;
    loaded = true;
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) cache = { ...EMPTY, ...JSON.parse(raw) };
    } catch {
        cache = EMPTY;
    }
    }

    function save(next: Progress) {
    cache = next;
    try {
        localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    listeners.forEach((l) => l());
    }

    function subscribe(cb: () => void) {
    listeners.add(cb);
    // keeps other open tabs in sync
    const onStorage = (e: StorageEvent) => {
        if (e.key !== KEY) return;
        loaded = false;
        load();
        cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", onStorage);
    };
    }

    const getSnapshot = () => {
    load();
    return cache;
    };
    const getServerSnapshot = () => EMPTY;

    /* ---------- study days and streaks ---------- */

    export const dayKey = (d: Date = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const parse = (k: string) => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d, 12);
    };

    const shift = (k: string, delta: number) => {
    const d = parse(k);
    d.setDate(d.getDate() + delta);
    return dayKey(d);
    };

    export const shortDay = (k: string) =>
    parse(k).toLocaleDateString("en-IN", { weekday: "short" });

    /** The last n day keys, ending with today. */
    export const lastDays = (n: number, today: string) =>
    Array.from({ length: n }, (_, i) => shift(today, i - (n - 1)));

    export function streakOf(days: string[], today: string) {
    const set = new Set(days);
    let cursor = set.has(today) ? today : shift(today, -1);
    let current = 0;
    while (set.has(cursor)) {
        current++;
        cursor = shift(cursor, -1);
    }

    const sorted = [...set].sort();
    let longest = 0;
    let run = 0;
    sorted.forEach((k, i) => {
        run = i > 0 && shift(sorted[i - 1], 1) === k ? run + 1 : 1;
        longest = Math.max(longest, run);
    });

    return { current, longest, todayDone: set.has(today) };
    }

    const withToday = (p: Progress): Progress => {
    const k = dayKey();
    return p.days.includes(k) ? p : { ...p, days: [...p.days, k].slice(-400) };
    };

    /* ---------- actions ---------- */

    const flip = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

    export const toggleDone = (id: string) => {
    load();
    const marking = !cache.done.includes(id);
    const next = { ...cache, done: flip(cache.done, id) };
    save(marking ? withToday(next) : next);
    };

    export const toggleSaved = (id: string) => {
    load();
    save({ ...cache, saved: flip(cache.saved, id) });
    };

    export const markViewed = (id: string) => {
    load();
    const sameTop = cache.recent[0]?.id === id;
    if (sameTop && cache.days.includes(dayKey())) return;
    const recent = sameTop
        ? cache.recent
        : [{ id, at: Date.now() }, ...cache.recent.filter((r) => r.id !== id)].slice(0, 12);
    save(withToday({ ...cache, recent }));
    };

    /** Saves a finished quiz: best score, attempt count, history, and marks it done. */
    export const recordQuiz = (id: string, score: number, total: number) => {
    load();
    const prev = cache.quiz[id];
    const now = Date.now();
    const beatsBest = !prev || score / total > prev.best / prev.bestTotal;

    const stat: QuizStat =
        beatsBest || !prev
        ? { best: score, bestTotal: total, attempts: (prev?.attempts ?? 0) + 1, at: now }
        : { ...prev, attempts: prev.attempts + 1, at: now };

    save(
        withToday({
        ...cache,
        quiz: { ...cache.quiz, [id]: stat },
        history: [{ id, score, total, at: now }, ...cache.history].slice(0, 40),
        done: cache.done.includes(id) ? cache.done : [...cache.done, id],
        })
    );
    };

    /** Saves which flashcards a student knows. Knowing every card marks the deck done. */
    export const setCardsKnown = (id: string, known: number[], total: number) => {
    load();
    const all = total > 0 && known.length >= total;
    save(
        withToday({
        ...cache,
        cards: {
            ...cache.cards,
            [id]: { known: [...known].sort((a, b) => a - b), total },
        },
        done: all && !cache.done.includes(id) ? [...cache.done, id] : cache.done,
        })
    );
    };

    export const resetAll = () => {
    load();
    save(EMPTY);
    };

    export function useProgress() {
    const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return {
        progress,
        isDone: (id: string) => progress.done.includes(id),
        isSaved: (id: string) => progress.saved.includes(id),
        toggleDone,
        toggleSaved,
        markViewed,
        recordQuiz,
        setCardsKnown,
    };
    }