import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CLASSES, subjectsFor } from "@/lib/data";
import { getClassNotes } from "@/lib/notes";
import ClassView from "@/components/ClassView";

export const dynamicParams = false;

export function generateStaticParams() {
  return CLASSES.map((c) => ({ n: String(c) }));
}

export default async function ClassPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const cls = Number(n);
  if (!CLASSES.includes(cls)) notFound();

  return (
    <main className="glow-bg min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-5 pt-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
          <ArrowLeft size={16} /> All classes
        </Link>
        <h1 className="font-display mt-4 text-4xl font-semibold sm:text-6xl">Class {cls}</h1>
        <p className="mt-3 text-white/60">Pick a subject. Newest notes appear first.</p>

        <ClassView cls={cls} subjects={subjectsFor(cls)} notes={getClassNotes(cls)} />
      </div>
    </main>
  );
}