    import { Loader2 } from "lucide-react";

    export default function Loading() {
    return (
        <main className="grid min-h-[calc(100vh-4rem)] place-items-center" aria-busy="true">
        <div className="flex flex-col items-center gap-3 text-mute">
            <Loader2 size={28} className="animate-spin text-brand" />
            <p className="text-sm">Loading…</p>
        </div>
        </main>
    );
    }