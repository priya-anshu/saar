    "use client";

    import Link from "next/link";
    import { useEffect, useMemo, useState, type ReactNode } from "react";
    import {
    Bookmark,
    CheckCircle2,
    ChevronRight,
    Clock,
    Compass,
    Flame,
    ListChecks,
    PlayCircle,
    Trash2,
    Trophy,
    type LucideIcon,
    } from "lucide-react";
    import type { SearchItem } from "@/components/SearchDialog";
    import { kindIcon } from "@/lib/icons";
    import {
    dayKey,
    lastDays,
    resetAll,
    shortDay,
    streakOf,
    useProgress,
    type Attempt,
    } from "@/lib/store";

    const EDGE = ["border-l-brand", "border-l-brand2", "border-l-brand3", "border-l-brand4"];
    const CHIP = ["bg-brand/15 text-brand", "bg-brand2/15 text-brand2", "bg-brand3/15 text-brand3", "bg-brand4/15 text-brand4"];
    const CARD = [
    "border-brand/30 bg-brand/10 text-brand",
    "border-brand2/30 bg-brand2/10 text-brand2",
    "border-brand3/30 bg-brand3/10 text-brand3",
    "border-brand4/30 bg-brand4/10 text-brand4",
    ];

    function ago(ts: number, now: number) {
    const s = (now - ts) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
    if (s < 86400 * 7) return `${Math.floor(s / 86400)} days ago`;
    return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }

    function Heading({ Icon, tone, children }: { Icon: LucideIcon; tone: string; children: ReactNode }) {
    return (
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium tracking-widest text-mute uppercase">
        <Icon size={15} className={tone} />
        {children}
        </h2>
    );
    }

    function StatCard({
    Icon,
    value,
    label,
    sub,
    tone,
    }: {
    Icon: LucideIcon;
    value: number;
    label: string;
    sub?: string;
    tone: number;
    }) {
    return (
        <div className={`rounded-2xl border p-4 ${CARD[tone % 4]}`}>
        <Icon size={20} />
        <p className="font-display mt-3 text-4xl font-semibold text-fg">{value}</p>
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-mute">{sub}</p>}
        </div>
    );
    }

    function ItemRow({ item, i, right }: { item: SearchItem; i: number; right?: ReactNode }) {
    const Icon = kindIcon(item.kind);
    return (
        <Link
        href={item.href}
        className={`glass group flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 transition hover:bg-tint ${EDGE[i % 4]}`}
        >
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${CHIP[i % 4]}`}>
            <Icon size={18} />
        </span>
        <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{item.title}</span>
            <span className="block truncate text-xs text-mute">
            Class {item.cls} · {item.subjectName} · {item.kindLabel}
            </span>
        </span>
        {right}
        <ChevronRight
            size={17}
            className="shrink-0 text-mute transition group-hover:translate-x-1 group-hover:text-fg"
        />
        </Link>
    );
    }

    export default function LearningView({ items }: { items: SearchItem[] }) {
    const { progress, isDone } = useProgress();
    const [clock, setClock] = useState<{ today: string; now: number } | null>(null);
    const [confirm, setConfirm] = useState(false);

    // Dates are read after mount so the server and browser always agree
    useEffect(() => {
        setClock({ today: dayKey(), now: Date.now() });
    }, []);

    const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

    if (!clock) return <div className="mt-10 h-64" aria-hidden />;

    const recent = progress.recent
        .map((r) => byId.get(r.id))
        .filter((x): x is SearchItem => !!x);
    const saved = [...progress.saved]
        .reverse()
        .map((id) => byId.get(id))
        .filter((x): x is SearchItem => !!x);
    const history = progress.history
        .map((h) => ({ h, item: byId.get(h.id) }))
        .filter((x): x is { h: Attempt; item: SearchItem } => !!x.item)
        .slice(0, 8);

    const empty =
        recent.length === 0 && saved.length === 0 && history.length === 0 && progress.done.length === 0;

    if (empty) {
        return (
        <div className="glass mt-10 flex flex-col items-center gap-4 rounded-3xl p-12 text-center">
            <Compass size={36} className="text-brand" />
            <div>
            <p className="text-lg font-semibold">Your learning journey starts here</p>
            <p className="mt-1 text-sm text-mute">
                Open a note, take a quiz or bookmark something and it will show up on this page.
            </p>
            </div>
            <Link
            href="/"
            className="rounded-lg border border-brand bg-brand px-5 py-2 text-sm font-semibold text-page transition hover:opacity-90"
            >
            Browse classes
            </Link>
        </div>
        );
    }

    const streak = streakOf(progress.days, clock.today);
    const week = lastDays(7, clock.today);
    const active = new Set(progress.days);
    const streakMsg = streak.todayDone
        ? "You studied today. Keep it up."
        : streak.current > 0
        ? "Study today to keep your streak alive."
        : "Open any note to start a new streak.";

    const resume = recent[0];

    return (
        <div className="mt-10 space-y-10">
        {/* Continue */}
        {resume && (
            <Link
            href={resume.href}
            className="group block rounded-3xl border border-brand/30 bg-linear-to-br from-brand/20 via-brand2/10 to-transparent p-6 transition hover:border-brand/60 sm:p-8"
            >
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest text-brand uppercase">
                <PlayCircle size={15} /> Continue where you left off
            </p>
            <p className="font-display mt-3 text-2xl font-semibold sm:text-3xl">{resume.title}</p>
            <p className="mt-1 text-sm text-mute">
                Class {resume.cls} · {resume.subjectName} · {resume.kindLabel}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-page transition group-hover:opacity-90">
                Resume <ChevronRight size={16} />
            </span>
            </Link>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
            Icon={Flame}
            tone={3}
            value={streak.current}
            label={streak.current === 1 ? "day streak" : "day streak"}
            sub={`Best: ${streak.longest} ${streak.longest === 1 ? "day" : "days"}`}
            />
            <StatCard Icon={CheckCircle2} tone={2} value={progress.done.length} label="completed" />
            <StatCard Icon={Bookmark} tone={0} value={progress.saved.length} label="bookmarks" />
            <StatCard Icon={ListChecks} tone={1} value={progress.history.length} label="quiz attempts" />
        </div>

        {/* Week */}
        <section>
            <Heading Icon={Flame} tone="text-brand4">
            This week
            </Heading>
            <div className="glass rounded-2xl p-4">
            <div className="grid grid-cols-7 gap-2 text-center">
                {week.map((k) => {
                const on = active.has(k);
                const today = k === clock.today;
                return (
                    <div key={k} className="flex flex-col items-center gap-1.5">
                    <span className={`text-xs ${today ? "font-semibold text-fg" : "text-mute"}`}>
                        {shortDay(k)}
                    </span>
                    <span
                        className={`grid h-9 w-9 place-items-center rounded-full ${
                        on ? "bg-brand4 text-page" : "bg-tint text-mute"
                        } ${today ? "ring-2 ring-brand4/50" : ""}`}
                    >
                        {on ? <CheckCircle2 size={17} /> : null}
                    </span>
                    </div>
                );
                })}
            </div>
            <p className="mt-4 text-center text-sm text-mute">{streakMsg}</p>
            </div>
        </section>

        {/* Recently viewed */}
        {recent.length > 1 && (
            <section>
            <Heading Icon={Clock} tone="text-brand3">
                Recently viewed
            </Heading>
            <div className="space-y-2.5">
                {recent.slice(1, 6).map((item, i) => (
                <ItemRow
                    key={item.id}
                    item={item}
                    i={i}
                    right={isDone(item.id) ? <CheckCircle2 size={17} className="shrink-0 text-ok" /> : null}
                />
                ))}
            </div>
            </section>
        )}

        {/* Bookmarks */}
        <section>
            <Heading Icon={Bookmark} tone="text-brand">
            Bookmarks
            </Heading>
            {saved.length === 0 ? (
            <p className="glass rounded-2xl p-5 text-sm text-mute">
                Tap the bookmark icon on any note to keep it here for quick access.
            </p>
            ) : (
            <div className="space-y-2.5">
                {saved.map((item, i) => (
                <ItemRow
                    key={item.id}
                    item={item}
                    i={i}
                    right={isDone(item.id) ? <CheckCircle2 size={17} className="shrink-0 text-ok" /> : null}
                />
                ))}
            </div>
            )}
        </section>

        {/* Quiz history */}
        <section>
            <Heading Icon={Trophy} tone="text-brand2">
            Quiz history
            </Heading>
            {history.length === 0 ? (
            <p className="glass rounded-2xl p-5 text-sm text-mute">
                Finish a quiz and your scores will appear here.
            </p>
            ) : (
            <div className="space-y-2.5">
                {history.map(({ h, item }, i) => {
                const pct = Math.round((h.score / h.total) * 100);
                const tone = pct >= 70 ? "text-ok" : pct >= 40 ? "text-brand4" : "text-accent";
                return (
                    <Link
                    key={`${h.id}-${h.at}`}
                    href={item.href}
                    className={`glass group flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 transition hover:bg-tint ${EDGE[i % 4]}`}
                    >
                    <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{item.title}</span>
                        <span className="block truncate text-xs text-mute">
                        Class {item.cls} · {item.subjectName} · {ago(h.at, clock.now)}
                        </span>
                    </span>
                    <span className={`shrink-0 rounded-full bg-tint px-3 py-1 text-sm font-semibold ${tone}`}>
                        {h.score}/{h.total} · {pct}%
                    </span>
                    <ChevronRight
                        size={17}
                        className="shrink-0 text-mute transition group-hover:translate-x-1 group-hover:text-fg"
                    />
                    </Link>
                );
                })}
            </div>
            )}
        </section>

        {/* Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
            <p className="text-xs text-mute">Everything here is stored only in this browser.</p>
            <button
            onClick={() => {
                if (confirm) {
                resetAll();
                setConfirm(false);
                } else {
                setConfirm(true);
                }
            }}
            onBlur={() => setConfirm(false)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-1.5 text-sm transition ${
                confirm
                ? "border-accent bg-accent/10 text-accent"
                : "border-line text-mute hover:text-fg"
            }`}
            >
            <Trash2 size={15} />
            {confirm ? "Tap again to confirm" : "Clear my progress"}
            </button>
        </div>
        </div>
    );
    }