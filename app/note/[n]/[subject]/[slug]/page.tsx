import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { subjectsFor } from "@/lib/data";
import {
  getAllNotes,
  getNoteHtml,
} from "@/lib/notes";
import ThreeViewer from "@/components/ThreeViewer";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNotes().map((note) => ({
    n: String(note.class),
    subject: note.subject,
    slug: note.slug,
  }));
}

export default async function NotePage({
  params,
}: {
  params: Promise<{
    n: string;
    subject: string;
    slug: string;
  }>;
}) {
  const { n, subject, slug } = await params;

  const classNumber = Number(n);
  const decodedSlug = decodeURIComponent(slug);

  const note = getAllNotes().find(
    (item) =>
      item.class === classNumber &&
      item.subject === subject &&
      item.slug === decodedSlug,
  );

  if (!note) {
    notFound();
  }

  const sub = subjectsFor(note.class).find(
    (item) => item.slug === note.subject,
  );

  const html =
    note.type === "html"
      ? getNoteHtml(
          note.class,
          note.subject,
          note.slug,
        )
      : null;

  if (note.type === "html" && html === null) {
    notFound();
  }

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3">
        <Link
          href={`/class/${note.class}`}
          className="
            flex shrink-0 items-center gap-1.5
            rounded-full
            border border-black/[0.08]
            bg-black/[0.025]
            px-4 py-1.5
            text-sm
            text-zinc-600
            transition
            hover:border-black/[0.14]
            hover:text-zinc-950
            dark:border-white/[0.1]
            dark:bg-white/[0.05]
            dark:text-white/70
            dark:hover:text-white
          "
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-zinc-950 dark:text-white">
            {note.title}
          </p>

          <p className="text-xs text-zinc-500 dark:text-white/50">
            Class {note.class} · {sub?.name ?? note.subject}
          </p>
        </div>

        {(note.type === "html" || note.type === "pdf") && (
          <a
            href={note.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex shrink-0 items-center gap-1.5
              text-sm
              text-zinc-500
              transition
              hover:text-zinc-950
              dark:text-white/50
              dark:hover:text-white
            "
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">
              Full screen
            </span>
          </a>
        )}
      </div>

      <div className="mx-auto min-h-0 w-full max-w-6xl flex-1 px-3 pb-3 sm:px-5 sm:pb-5">
        <div
          className="
            glass h-full overflow-hidden rounded-2xl
            shadow-xl shadow-black/5
            dark:shadow-black/30
          "
        >
          {note.type === "html" && html !== null && (
            <iframe
              title={note.title}
              srcDoc={html}
              loading="eager"
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation"
            />
          )}

          {note.type === "image" && (
            <div className="grid h-full place-items-center overflow-auto p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={note.url}
                alt={note.title}
                className="max-h-full max-w-full rounded-xl object-contain"
              />
            </div>
          )}

          {note.type === "3d" && (
            <ThreeViewer src={note.url} />
          )}

          {note.type === "pdf" && (
            <iframe
              src={note.url}
              title={note.title}
              className="h-full w-full border-0"
            />
          )}
        </div>
      </div>
    </main>
  );
}