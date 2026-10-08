import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { subjectsFor } from "@/lib/data";
import { getAllNotes } from "@/lib/notes";
import ThreeViewer from "@/components/ThreeViewer";

export const dynamicParams = false;

export function generateStaticParams() {
  const all = getAllNotes();
  if (all.length === 0) return [{ n: "0", subject: "none", slug: "none" }];
  return all.map((note) => ({
    n: String(note.class),
    subject: note.subject,
    slug: note.slug,
  }));
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ n: string; subject: string; slug: string }>;
}) {
  const { n, subject, slug } = await params;
  const note = getAllNotes().find(
    (x) => x.class === Number(n) && x.subject === subject && x.slug === decodeURIComponent(slug)
  );
  if (!note) notFound();

  const sub = subjectsFor(note.class).find((s) => s.slug === note.subject);

  const Body =
    note.type === "tsx"
      ? (
          await import(
            `../../../../../content/notes/${note.class}/${note.subject}/${note.slug}.tsx`
          )
        ).default
      : null;

  return (
    <main className="min-h-[calc(100dvh-4rem)]">
      <div className="sticky top-16 z-20 border-b border-line bg-page/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-2.5">
          <Link
            href={`/class/${note.class}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-tint px-4 py-1.5 text-sm text-mute transition hover:text-fg"
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{note.title}</p>
            <p className="text-xs text-mute">
              Class {note.class} · {sub?.name ?? note.subject}
            </p>
          </div>
          {(note.type === "html" || note.type === "pdf") && (
            <a
              href={note.url}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-1.5 text-sm text-mute hover:text-fg"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">Full screen</span>
            </a>
          )}
        </div>
      </div>

      {Body ? (
        <Body />
      ) : (
        <div className="h-[calc(100dvh-7.5rem)] w-full">
          {note.type === "html" && (
            <iframe
              src={note.url}
              sandbox="allow-scripts allow-popups"
              className="h-full w-full bg-white"
              title={note.title}
            />
          )}
          {note.type === "image" && (
            <div className="grid h-full place-items-center overflow-auto p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={note.url} alt={note.title} className="max-h-full max-w-full rounded-xl" />
            </div>
          )}
          {note.type === "3d" && <ThreeViewer src={note.url} />}
          {note.type === "pdf" && <iframe src={note.url} className="h-full w-full" title={note.title} />}
        </div>
      )}
    </main>
  );
}