"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Inbox } from "lucide-react";
import { subjectIcon, typeIcon } from "@/lib/icons";
import { TYPE_LABEL, formatDate, type Note, type Subject } from "@/lib/data";

const TONES = [
  { text: "text-brand", chip: "bg-brand/15 text-brand", edge: "border-l-brand", pill: "border-brand/50 bg-brand/15", hover: "hover:border-brand/60 hover:bg-brand/5", arrow: "group-hover:text-brand", badge: "bg-brand/15 text-brand" },
  { text: "text-brand2", chip: "bg-brand2/15 text-brand2", edge: "border-l-brand2", pill: "border-brand2/50 bg-brand2/15", hover: "hover:border-brand2/60 hover:bg-brand2/5", arrow: "group-hover:text-brand2", badge: "bg-brand2/15 text-brand2" },
  { text: "text-brand3", chip: "bg-brand3/15 text-brand3", edge: "border-l-brand3", pill: "border-brand3/50 bg-brand3/15", hover: "hover:border-brand3/60 hover:bg-brand3/5", arrow: "group-hover:text-brand3", badge: "bg-brand3/15 text-brand3" },
  { text: "text-brand4", chip: "bg-brand4/15 text-brand4", edge: "border-l-brand4", pill: "border-brand4/50 bg-brand4/15", hover: "hover:border-brand4/60 hover:bg-brand4/5", arrow: "group-hover:text-brand4", badge: "bg-brand4/15 text-brand4" },
];

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
  const hasNotes = (slug: string) => notes.some((n) => n.subject === slug);
  const ordered = [...subjects].sort(
    (a, b) => Number(hasNotes(b.slug)) - Number(hasNotes(a.slug))
  );
  return (
    <>
      <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2">
        {ordered.map((s, si) => {
          const Icon = subjectIcon(s.icon);
          const tone = TONES[si % 4];
          const count = notes.filter((n) => n.subject === s.slug).length;
          const isActive = active === s.slug;
          return (
            <button
              key={s.slug}
              onClick={() => setActive(s.slug)}
              className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm transition ${
                isActive ? "font-medium text-fg" : "text-mute hover:text-fg"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="subject-pill"
                  className={`absolute inset-0 rounded-full border ${tone.pill}`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={16} className={tone.text} />
                {s.name}
                <span className="text-xs text-mute">{count}</span>
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
            className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-mute"
          >
            <Inbox size={32} />
            <p>No notes yet. Fresh content is coming soon.</p>
          </motion.div>
        )}

        {list.map((note, i) => {
          const Icon = typeIcon(note.type);
          const tone = TONES[i % 4];
          return (
            <motion.div
              key={note.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/note/${cls}/${note.subject}/${note.slug}`}
                className={`glass group flex items-center gap-4 rounded-2xl border-l-4 p-5 transition ${tone.edge} ${tone.hover}`}
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tone.chip}`}>
                  <Icon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{note.title}</p>
                  <p className="mt-0.5 text-xs text-mute">
                    {TYPE_LABEL[note.type]} · {formatDate(note.date)}
                  </p>
                </div>
                {i === 0 && (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone.badge}`}>
                    Latest
                  </span>
                )}
                <ChevronRight
                  size={18}
                  className={`text-mute transition group-hover:translate-x-1 ${tone.arrow}`}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}