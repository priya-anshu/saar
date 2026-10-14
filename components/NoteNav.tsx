    import Link from "next/link";
    import { ArrowLeft, ArrowRight } from "lucide-react";
    import type { Note } from "@/lib/data";

    const href = (n: Note) => `/note/${n.class}/${n.subject}/${n.slug}`;

    export default function NoteNav({
    prev,
    next,
    label,
    }: {
    prev: Note | null;
    next: Note | null;
    label: string;
    }) {
    if (!prev && !next) return null;

    return (
        <nav aria-label={`More ${label}s in this subject`} className="mx-auto grid max-w-4xl gap-3 px-5 pb-16 sm:grid-cols-2">
        {prev && (
            <Link
            href={href(prev)}
            className="glass group flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand/50 hover:bg-brand/5"
            >
            <ArrowLeft
                size={20}
                className="shrink-0 text-mute transition group-hover:-translate-x-1 group-hover:text-brand"
            />
            <div className="min-w-0 flex-1">
                <p className="text-xs tracking-widest text-mute uppercase">Previous {label}</p>
                <p className="mt-0.5 truncate font-semibold">{prev.title}</p>
            </div>
            </Link>
        )}

        {next && (
            <Link
            href={href(next)}
            className="glass group flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand2/50 hover:bg-brand2/5 sm:col-start-2"
            >
            <div className="min-w-0 flex-1 text-right">
                <p className="text-xs tracking-widest text-mute uppercase">Next {label}</p>
                <p className="mt-0.5 truncate font-semibold">{next.title}</p>
            </div>
            <ArrowRight
                size={20}
                className="shrink-0 text-mute transition group-hover:translate-x-1 group-hover:text-brand2"
            />
            </Link>
        )}
        </nav>
    );
    }