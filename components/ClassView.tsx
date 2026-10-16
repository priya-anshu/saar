"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, CheckCircle2, ChevronRight, Inbox } from "lucide-react";
import { kindIcon, subjectIcon, typeIcon } from "@/lib/icons";
import { useProgress } from "@/lib/store";
import {
  KINDS,
  KIND_LABEL,
  TYPE_LABEL,
  formatDate,
  noteId,
  type Note,
  type NoteKind,
  type Subject,
} from "@/lib/data";

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
  const [kind, setKind] = useState<NoteKind>("note");
  const { progress, isDone, isSaved } = useProgress();

  const inSubject = notes.filter((n) => n.subject === active);
  const list = inSubject.filter((n) => n.kind === kind);
  const doneCount = list.filter((n) => isDone(noteId(n))).length;
  const kindCount = (k: NoteKind) => inSubject.filter((n) => n.kind === k).length;
  const emptyText = KINDS.find((k) => k.key === kind)?.empty ?? "Nothing here yet.";

  const hasNotes = (slug: string) => notes.some((n) => n.subject === slug);
  const ordered = [...subjects].sort(
    (a, b) => Number(hasNotes(b.slug)) - Number(hasNotes(a.slug))
  );

  return (
    <>
      {/* Subjects */}
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

      {/* Notes / Quizzes / Practice / Flashcards */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-tint p-1 sm:flex sm:w-fit">
        {KINDS.map((k, ki) => {
          const Icon = kindIcon(k.key);
          const on = kind === k.key;
          return (
            <button
              key={k.key}
              onClick={() => setKind(k.key)}
              className={`relative flex items-center justify-center rounded-xl px-3 py-2 text-sm transition sm:px-5 ${
                on ? "font-medium text-fg" : "text-mute hover:text-fg"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="kind-pill"
                  className="absolute inset-0 rounded-xl border border-line bg-page shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={15} className={TONES[ki % 4].text} />
                {k.label}
                <span className="text-xs text-mute">{kindCount(k.key)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress strip */}
      {list.length > 0 && (
        <div className="mt-6 flex items-center gap-3 text-sm text-mute">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-tint">
            <div
              className="h-full rounded-full bg-linear-to-r from-brand3 to-ok transition-all duration-500"
              style={{ width: `${(doneCount / list.length) * 100}%` }}
            />
          </div>
          <span>
            {doneCount} of {list.length} done
          </span>
        </div>
      )}

      {/* List */}
      <div key={`${active}-${kind}`} className="mt-4 space-y-3">
        {list.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-mute"
          >
            <Inbox size={32} />
            <p>{emptyText}</p>
          </motion.div>
        )}

        {list.map((note, i) => {
          const Icon = note.kind === "note" ? typeIcon(note.type) : kindIcon(note.kind);
          const tone = TONES[i % 4];
          const id = noteId(note);

          const stat = note.kind === "quiz" ? progress.quiz[id] : undefined;
          const bestOk = stat ? stat.best / stat.bestTotal >= 0.7 : false;

          const deck = note.kind === "cards" ? progress.cards[id] : undefined;
          const deckKnown = deck ? Math.min(deck.known.length, deck.total) : 0;

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
                    {note.kind === "note" ? TYPE_LABEL[note.type] : KIND_LABEL[note.kind]} ·{" "}
                    {formatDate(note.date)}
                  </p>
                </div>
                {stat && (
                  <span
                    className={`shrink-0 rounded-full bg-tint px-2.5 py-1 text-xs font-medium ${
                      bestOk ? "text-ok" : "text-brand4"
                    }`}
                  >
                    Best {stat.best}/{stat.bestTotal}
                  </span>
                )}
                {deck && (
                  <span
                    className={`shrink-0 rounded-full bg-tint px-2.5 py-1 text-xs font-medium ${
                      deckKnown >= deck.total ? "text-ok" : "text-brand3"
                    }`}
                  >
                    {deckKnown}/{deck.total} known
                  </span>
                )}
                {i === 0 && note.order === undefined && (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone.badge}`}>
                    Latest
                  </span>
                )}
                {isSaved(id) && <Bookmark size={16} className="shrink-0 fill-current text-brand4" />}
                {isDone(id) && <CheckCircle2 size={18} className="shrink-0 text-ok" />}
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