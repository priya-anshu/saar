"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { CLASSES } from "@/lib/data";

const band = (c: number) =>
  c <= 5
    ? "from-emerald-400/20 to-teal-500/5"
    : c <= 8
      ? "from-sky-400/20 to-indigo-500/5"
      : c <= 10
        ? "from-violet-400/20 to-fuchsia-500/5"
        : "from-amber-400/20 to-rose-500/5";

export default function Home() {
  return (
    <main className="glow-bg min-h-[calc(100vh-4rem)]">
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-20 text-center sm:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            mx-auto mb-5 w-fit rounded-full
            border border-black/[0.08]
            bg-black/[0.025]
            px-4 py-1.5
            text-xs font-medium tracking-widest
            text-zinc-500 uppercase
            dark:border-white/[0.1]
            dark:bg-white/[0.05]
            dark:text-white/50
          "
        >
          Class 3 – 12 · Notes
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            font-display text-5xl font-semibold
            leading-[1.05] tracking-tight
            text-zinc-950
            sm:text-7xl
            dark:text-white
          "
        >
          Learn the{" "}
          <span
            className="
              bg-gradient-to-r from-indigo-500
              via-fuchsia-500 to-amber-500
              bg-clip-text text-transparent
            "
          >
            essence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            mx-auto mt-6 max-w-xl
            text-base leading-7
            text-zinc-600
            sm:text-lg
            dark:text-white/60
          "
        >
          Fewer notes. Better notes. Interactive lessons,
          3D models and clear visuals for every class.
        </motion.p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-5 flex items-center justify-between">
          <h2
            className="
              text-sm font-semibold tracking-widest
              text-zinc-500 uppercase
              dark:text-white/50
            "
          >
            Choose your class
          </h2>

          <span className="text-xs text-zinc-400 dark:text-white/30">
            Class 3–12
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CLASSES.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/class/${c}`}
                className="
                  glass group relative block
                  overflow-hidden rounded-3xl p-6
                  transition-all duration-300
                  hover:border-black/[0.15]
                  hover:shadow-xl hover:shadow-black/5
                  dark:hover:border-white/[0.2]
                  dark:hover:shadow-black/20
                "
              >
                <div
                  className={`
                    absolute inset-0
                    bg-gradient-to-br ${band(c)}
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                  `}
                />

                <div className="relative">
                  <p
                    className="
                      text-xs tracking-widest
                      text-zinc-400 uppercase
                      dark:text-white/40
                    "
                  >
                    Class
                  </p>

                  <p
                    className="
                      font-display mt-1 text-6xl
                      font-semibold
                      text-zinc-900
                      dark:text-white
                    "
                  >
                    {c}
                  </p>

                  <p
                    className="
                      mt-4 flex items-center gap-1.5
                      text-sm text-zinc-500
                      transition
                      group-hover:text-zinc-900
                      dark:text-white/50
                      dark:group-hover:text-white/90
                    "
                  >
                    Open subjects
                    <ArrowRight
                      size={14}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}