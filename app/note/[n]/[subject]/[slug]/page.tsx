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

    return (
        <main className="flex h-[calc(100vh-4rem)] flex-col">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3">
            <Link
            href={`/class/${note.class}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 hover:text-white"
            >
            <ArrowLeft size={15} /> Back
            </Link>
            <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{note.title}</p>
            <p className="text-xs text-white/50">
                Class {note.class} · {sub?.name ?? note.subject}
            </p>
            </div>
            {(note.type === "html" || note.type === "pdf") && (
            <a
                href={note.url}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-1.5 text-sm text-white/50 hover:text-white"
            >
                <ExternalLink size={15} />
                <span className="hidden sm:inline">Full screen</span>
            </a>
            )}
        </div>

        <div className="mx-auto min-h-0 w-full max-w-6xl flex-1 px-3 pb-3 sm:px-5 sm:pb-5">
            <div className="glass h-full overflow-hidden rounded-2xl">
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
        </div>
        </main>
    );
    }