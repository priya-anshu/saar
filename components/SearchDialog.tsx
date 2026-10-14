    "use client";

    import Link from "next/link";
    import { useRouter } from "next/navigation";
    import { useEffect, useMemo, useRef, useState } from "react";
    import { AnimatePresence, motion } from "framer-motion";
    import { CornerDownLeft, Search, SearchX } from "lucide-react";
    import { kindIcon } from "@/lib/icons";
    import { useProgress } from "@/lib/store";
    import type { NoteKind } from "@/lib/data";

    export type SearchItem = {
    id: string;
    href: string;
    title: string;
    cls: number;
    subjectName: string;
    kind: NoteKind;
    kindLabel: string;
    date: string;
    };

    const TONES = ["text-brand", "text-brand2", "text-brand3", "text-brand4"];
    const CHIPS = ["bg-brand/15", "bg-brand2/15", "bg-brand3/15", "bg-brand4/15"];

    function rank(items: SearchItem[], q: string): SearchItem[] {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    const scored: { item: SearchItem; score: number }[] = [];
    for (const item of items) {
        const title = item.title.toLowerCase();
        const hay = `${title} ${item.subjectName.toLowerCase()} ${item.kindLabel.toLowerCase()} class ${item.cls}`;
        if (!tokens.every((t) => hay.includes(t))) continue;

        let score = 0;
        for (const t of tokens) {
        if (title.startsWith(t)) score += 3;
        else if (title.includes(t)) score += 2;
        else score += 1;
        }
        scored.push({ item, score });
    }

    return scored
        .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
        .slice(0, 30)
        .map((s) => s.item);
    }

    export default function SearchDialog({ items }: { items: SearchItem[] }) {
    const router = useRouter();
    const { progress } = useProgress();
    const listRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const [mod, setMod] = useState("Ctrl");

    useEffect(() => {
        if (/Mac|iPhone|iPad/.test(navigator.platform)) setMod("⌘");
    }, []);

    const close = () => {
        setOpen(false);
        setQuery("");
        setActive(0);
    };

    // Global shortcuts
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            setOpen((o) => !o);
            return;
        }
        if (e.key === "/" && !open) {
            const t = e.target as HTMLElement;
            if (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable) return;
            e.preventDefault();
            setOpen(true);
        }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Lock page scroll while open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.body.style.overflow = prev;
        };
    }, [open]);

    const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

    const recent = useMemo(
        () =>
        progress.recent
            .map((r) => byId.get(r.id))
            .filter((x): x is SearchItem => !!x)
            .slice(0, 5),
        [progress.recent, byId]
    );

    const searching = query.trim().length > 0;
    const results = useMemo(() => rank(items, query), [items, query]);
    const list = searching ? results : recent;

    // Keep the highlighted row visible
    useEffect(() => {
        listRef.current
        ?.querySelector(`[data-idx="${active}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }, [active]);

    const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, list.length - 1));
        } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        } else if (e.key === "Enter" && list[active]) {
        router.push(list[active].href);
        close();
        } else if (e.key === "Escape") {
        close();
        }
    };

    return (
        <>
        <button
            onClick={() => setOpen(true)}
            aria-label="Search"
            className="flex h-9 items-center gap-2 rounded-full border border-line bg-tint px-3 text-sm text-mute transition hover:text-fg"
        >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] sm:inline">
            {mod} K
            </kbd>
        </button>

        <AnimatePresence>
            {open && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={close}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Search notes"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
                className="mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-line bg-page shadow-2xl"
                >
                <div className="flex items-center gap-3 border-b border-line px-4">
                    <Search size={18} className="shrink-0 text-mute" />
                    <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                    }}
                    onKeyDown={onInputKey}
                    placeholder="Search notes, quizzes, subjects…"
                    aria-label="Search"
                    className="h-14 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-mute"
                    />
                    <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-mute">Esc</kbd>
                </div>

                <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
                    {!searching && (
                    <p className="px-3 pb-1 pt-2 text-xs font-medium tracking-widest text-mute uppercase">
                        {recent.length > 0 ? "Recently viewed" : "Quick tip"}
                    </p>
                    )}

                    {!searching && recent.length === 0 && (
                    <p className="px-3 pb-4 text-sm text-mute">
                        Type a topic, subject or class. Try “class 7 chemistry” or “quiz”.
                    </p>
                    )}

                    {searching && list.length === 0 && (
                    <div className="flex flex-col items-center gap-2 px-3 py-10 text-center text-mute">
                        <SearchX size={28} />
                        <p className="text-sm">No results for “{query.trim()}”.</p>
                    </div>
                    )}

                    {list.map((item, i) => {
                    const Icon = kindIcon(item.kind);
                    return (
                        <Link
                        key={item.id}
                        href={item.href}
                        data-idx={i}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                            i === active ? "bg-tint" : ""
                        }`}
                        >
                        <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${CHIPS[i % 4]} ${TONES[i % 4]}`}
                        >
                            <Icon size={17} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{item.title}</span>
                            <span className="block truncate text-xs text-mute">
                            Class {item.cls} · {item.subjectName} · {item.kindLabel}
                            </span>
                        </span>
                        {i === active && <CornerDownLeft size={15} className="shrink-0 text-mute" />}
                        </Link>
                    );
                    })}
                </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
        </>
    );
    }