"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Inbox } from "lucide-react";

import { SUBJECT_ICON, TYPE_ICON } from "@/lib/icons";
import {
  TYPE_LABEL,
  formatDate,
  type Note,
  type Subject,
} from "@/lib/data";

export default function ClassView({
  cls,
  subjects,
  notes,
}: {
  cls: number;
  subjects: Subject[];
  notes: Note[];
}) {
  const first =
    subjects.find((subject) =>
      notes.some((note) => note.subject === subject.slug),
    ) ?? subjects[0];

  const [active, setActive] = useState(first.slug);

  const list = notes.filter(
    (note) => note.subject === active,
  );

  return (
    <>
      <div
        className="
          no-scrollbar -mx-5 mt-10
          flex gap-2 overflow-x-auto
          px-5 pb-2
        "
      >
        {subjects.map((subject) => {
          const Icon = SUBJECT_ICON[subject.icon];

          const count = notes.filter(
            (note) => note.subject === subject.slug,
          ).length;

          const isActive = active === subject.slug;

          return (
            <button
              key={subject.slug}
              type="button"
              onClick={() => setActive(subject.slug)}
              className={`
                relative shrink-0 rounded-full
                px-4 py-2.5 text-sm
                transition
                ${
                  isActive
                    ? "text-zinc-950 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-white/50 dark:hover:text-white/80"
                }
              `}
            >
              {isActive && (
                <motion.span
                  layoutId="subject-pill"
                  className="
                    absolute inset-0 rounded-full
                    border border-black/[0.08]
                    bg-black/[0.04]
                    dark:border-white/[0.15]
                    dark:bg-white/[0.08]
                  "
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.5,
                  }}
                />
              )}

              <span className="relative flex items-center gap-2">
                <Icon size={16} />

                {subject.name}

                <span
                  className="
                    text-xs text-zinc-400
                    dark:text-white/35
                  "
                >
                  {count}
                </span>
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
            className="
              glass flex flex-col
              items-center gap-3
              rounded-3xl p-12
              text-zinc-500
              dark:text-white/50
            "
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
                href={`/note/${cls}/${note.subject}/${encodeURIComponent(note.slug)}`}
                className="
                  glass group
                  flex items-center gap-4
                  rounded-2xl p-5
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-black/[0.14]
                  hover:bg-black/[0.02]
                  dark:hover:border-white/[0.18]
                  dark:hover:bg-white/[0.055]
                "
              >
                <span
                  className="
                    grid h-12 w-12 shrink-0
                    place-items-center rounded-xl
                    bg-indigo-500/10
                    text-indigo-600
                    dark:text-indigo-300
                  "
                >
                  <Icon size={22} />
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate font-semibold
                      text-zinc-900
                      dark:text-white
                    "
                  >
                    {note.title}
                  </p>

                  <p
                    className="
                      mt-0.5 text-xs
                      text-zinc-500
                      dark:text-white/50
                    "
                  >
                    {TYPE_LABEL[note.type]} ·{" "}
                    {formatDate(note.date)}
                  </p>
                </div>

                {i === 0 && (
                  <span
                    className="
                      rounded-full
                      bg-amber-500/10
                      px-3 py-1
                      text-xs font-medium
                      text-amber-700
                      dark:bg-amber-400/15
                      dark:text-amber-300
                    "
                  >
                    Latest
                  </span>
                )}

                <ChevronRight
                  size={18}
                  className="
                    text-zinc-300
                    transition
                    group-hover:translate-x-1
                    group-hover:text-zinc-700
                    dark:text-white/25
                    dark:group-hover:text-white/80
                  "
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}