import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import NoteActions from "@/components/NoteActions";
import NoteNav from "@/components/NoteNav";
import PrintButton from "@/components/PrintButton";
import ReadingTools from "@/components/ReadingTools";
import ThreeViewer from "@/components/ThreeViewer";
import { KIND_LABEL, noteId, subjectsFor } from "@/lib/data";
import { getAllNotes } from "@/lib/notes";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string; subject: string; slug: string }>;
}) {
  const { n, subject, slug } = await params;
  const note = getAllNotes().find(
    (x) => x.class === Number(n) && x.subject === subject && x.slug === decodeURIComponent(slug)
  );
  return { title: note?.title ?? "Note" };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ n: string; subject: string; slug: string }>;
}) {
  const { n, subject, slug } = await params;
  const all = getAllNotes();
  const note = all.find(
    (x) => x.class === Number(n) && x.subject === subject && x.slug === decodeURIComponent(slug)
  );
  if (!note) notFound();

  const sub = subjectsFor(note.class).find((s) => s.slug === note.subject);

  // Same class, subject and type, newest first. Previous = older, Next = newer.
  const siblings = all.filter(
    (x) => x.class === note.class && x.subject === note.subject && x.kind === note.kind
  );
  const at = siblings.findIndex((x) => x.slug === note.slug);
  const newer = at > 0 ? siblings[at - 1] : null;
  const older = at >= 0 && at < siblings.length - 1 ? siblings[at + 1] : null;

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
      <div className="sticky top-16 z-20 border-b border-line bg-page/80 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-2.5">
          <Link
            href={`/class/${note.class}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-tint px-4 py-1.5 text-sm text-mute transition hover:text-fg"
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{note.title}</p>
            <p className="truncate text-xs text-mute">
              Class {note.class} · {sub?.name ?? note.subject}
              {note.kind !== "note" && ` · ${KIND_LABEL[note.kind]}`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {note.type === "tsx" && <ReadingTools />}
            {note.type === "tsx" && <PrintButton />}
            <NoteActions id={noteId(note)} />
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
        <>
          {/* only visible on paper */}
          <p className="hidden px-5 pt-4 text-sm text-mute print:block">
            Saar · Class {note.class} · {sub?.name ?? note.subject} · {KIND_LABEL[note.kind]}
          </p>

          <article id="note-content">
            <Body />
          </article>

          <div className="print:hidden">
            <NoteNav prev={older} next={newer} label={KIND_LABEL[note.kind].toLowerCase()} />
          </div>
        </>
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