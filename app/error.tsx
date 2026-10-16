    "use client";

    import Link from "next/link";
    import { Home, RotateCcw, TriangleAlert } from "lucide-react";

    export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <main className="glow-bg grid min-h-[calc(100vh-4rem)] place-items-center px-5 py-16">
        <div className="mx-auto max-w-md text-center">
            <TriangleAlert size={44} className="mx-auto text-accent" />
            <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-mute">
            This page couldn’t load properly. Try again, and if it keeps happening, go back to the home page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
                onClick={() => reset()}
                className="flex items-center gap-2 rounded-lg border border-brand bg-brand px-5 py-2 text-sm font-semibold text-page transition hover:opacity-90"
            >
                <RotateCcw size={16} /> Try again
            </button>
            <Link
                href="/"
                className="flex items-center gap-2 rounded-lg border border-brand/50 px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10"
            >
                <Home size={16} /> Home
            </Link>
            </div>
        </div>
        </main>
    );
    }