"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CLASSES } from "@/lib/data";

const band = (c: number) =>
  c <= 5
    ? "from-emerald-400/30 to-teal-500/10"
    : c <= 8
    ? "from-sky-400/30 to-indigo-500/10"
    : c <= 10
    ? "from-violet-400/30 to-fuchsia-500/10"
    : "from-amber-400/30 to-rose-500/10";

export default function Home() {
  return (
    <main className="glow-bg">
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-20 text-center sm:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-5 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs tracking-widest text-white/60 uppercase"
        >
          Class 3 – 12 · Notes
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-7xl"
        >
          Learn the{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            essence.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg"
        >
          Fewer notes. Better notes. Interactive lessons, 3D models and clear visuals for every class.
        </motion.p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <h2 className="mb-5 text-sm font-medium tracking-widest text-white/50 uppercase">
          Choose your class
        </h2>
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
                className="glass group relative block overflow-hidden rounded-3xl p-6 transition hover:border-white/25"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${band(c)} opacity-0 transition group-hover:opacity-100`} />
                <div className="relative">
                  <p className="text-xs tracking-widest text-white/50 uppercase">Class</p>
                  <p className="font-display mt-1 text-6xl font-semibold">{c}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm text-white/50 transition group-hover:text-white/90">
                    Open subjects
                    <ArrowRight size={14} className="transition group-hover:translate-x-1" />
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