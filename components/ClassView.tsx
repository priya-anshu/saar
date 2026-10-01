    "use client";

    import Link from "next/link";
    import { useState } from "react";
    import { motion } from "framer-motion";
    import { ChevronRight, Inbox } from "lucide-react";
    import { SUBJECT_ICON, TYPE_ICON } from "@/lib/icons";
    import { TYPE_LABEL, formatDate, type Note, type Subject } from "@/lib/data";

    export default function ClassView({
    cls,
    subjects,
    notes,
    }: {
    cls: number;
    subjects: Subject[];
    notes: Note[];
    }) {
    const first = subjects.find((s) => notes.some((n) => n.subject === s.slug)) ?? subjects[0];
    const [active, setActive] = useState(first.slug);
    const list = notes.filter((n) => n.subject === active);

    return (
        <>
        <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2">
            {subjects.map((s) => {
            const Icon = SUBJECT_ICON[s.icon];
            const count = notes.filter((n) => n.subject === s.slug).length;
            const isActive = active === s.slug;
            return (
                <button
                key={s.slug}
                onClick={() => setActive(s.slug)}
                className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm transition ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
                >
                {isActive && (
                    <motion.span
                    layoutId="subject-pill"
                    className="absolute inset-0 rounded-full border border-white/15 bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                )}
                <span className="relative flex items-center gap-2">
                    <Icon size={16} />
                    {s.name}
                    <span className="text-xs text-white/40">{count}</span>
                </span>
                </button>
            );
            })}
        </div>

        <div key={active} className="mt-6 space-y-3">
            {list.length === 0 && (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-white/50"
            >
                <Inbox size={32} />
                <p>No notes yet. Fresh content is coming soon.</p>
            </motion.div>
            )}

            {list.map((note, i) => {
            const Icon = TYPE_ICON[note.type];
            return (
                <motion.div
                key={note.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                >
                <Link
                    href={`/note/${cls}/${note.subject}/${note.slug}`}
                    className="glass group flex items-center gap-4 rounded-2xl p-5 transition hover:border-white/25 hover:bg-white/[0.07]"
                >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/5 text-indigo-300">
                    <Icon size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{note.title}</p>
                    <p className="mt-0.5 text-xs text-white/50">
                        {TYPE_LABEL[note.type]} · {formatDate(note.date)}
                    </p>
                    </div>
                    {i === 0 && (
                    <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-300">
                        Latest
                    </span>
                    )}
                    <ChevronRight
                    size={18}
                    className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white"
                    />
                </Link>
                </motion.div>
            );
            })}
        </div>
        </>
    );
    }