import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CLASSES, subjectsFor } from "@/lib/data";
import { getClassNotes } from "@/lib/notes";
import ClassView from "@/components/ClassView";

export const dynamicParams = false;

export function generateStaticParams() {
  return CLASSES.map((c) => ({
    n: String(c),
  }));
}

function isValidClass(
  value: number,
): value is (typeof CLASSES)[number] {
  return CLASSES.includes(
    value as (typeof CLASSES)[number],
  );
}

export default async function ClassPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;

  const cls = Number(n);

  if (!Number.isInteger(cls) || !isValidClass(cls)) {
    notFound();
  }

  const subjects = subjectsFor(cls);
  const notes = getClassNotes(cls);

  return (
    <main className="glow-bg min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-5 pb-16 pt-12">
        <Link
          href="/"
          className="
            inline-flex items-center gap-1.5
            rounded-full
            text-sm
            text-zinc-500
            transition
            hover:text-zinc-950
            dark:text-white/50
            dark:hover:text-white
          "
        >
          <ArrowLeft size={16} />
          All classes
        </Link>

        <div className="mt-7">
          <p
            className="
              text-xs font-semibold tracking-[0.2em]
              text-indigo-500 uppercase
              dark:text-indigo-300
            "
          >
            Learning library
          </p>

          <h1
            className="
              font-display mt-3 text-4xl
              font-semibold tracking-tight
              text-zinc-950
              sm:text-6xl
              dark:text-white
            "
          >
            Class {cls}
          </h1>

          <p
            className="
              mt-3 max-w-xl text-base
              text-zinc-600
              dark:text-white/55
            "
          >
            Pick a subject. Newest notes appear first.
          </p>
        </div>

        <ClassView
          cls={cls}
          subjects={subjects}
          notes={notes}
        />
      </div>
    </main>
  );
}