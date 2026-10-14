    "use client";

    import { useEffect } from "react";
    import { Bookmark, CheckCircle2 } from "lucide-react";
    import { useProgress } from "@/lib/store";

    export default function NoteActions({ id }: { id: string }) {
    const { isDone, isSaved, toggleDone, toggleSaved, markViewed } = useProgress();

    useEffect(() => {
        markViewed(id);
    }, [id, markViewed]);

    const done = isDone(id);
    const saved = isSaved(id);

    return (
        <div className="flex shrink-0 items-center gap-2">
        <button
            onClick={() => toggleSaved(id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove bookmark" : "Bookmark this"}
            className={`grid h-9 w-9 place-items-center rounded-full border transition ${
            saved
                ? "border-brand4/50 bg-brand4/15 text-brand4"
                : "border-line bg-tint text-mute hover:text-fg"
            }`}
        >
            <Bookmark size={16} className={saved ? "fill-current" : ""} />
        </button>

        <button
            onClick={() => toggleDone(id)}
            aria-pressed={done}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition ${
            done
                ? "border-ok/40 bg-ok/15 text-ok"
                : "border-line bg-tint text-mute hover:text-fg"
            }`}
        >
            <CheckCircle2 size={16} />
            <span className="hidden sm:inline">{done ? "Completed" : "Mark done"}</span>
        </button>
        </div>
    );
    }