    import Link from "next/link";
    import { Home, LayoutDashboard } from "lucide-react";

    export default function NotFound() {
    return (
        <main className="glow-bg grid min-h-[calc(100vh-4rem)] place-items-center px-5 py-16">
        <div className="mx-auto max-w-md text-center">
            <p className="font-display bg-linear-to-r from-brand to-brand2 bg-clip-text text-8xl font-semibold text-transparent">
            404
            </p>
            <h1 className="mt-4 text-2xl font-semibold">This page doesn’t exist</h1>
            <p className="mt-2 text-mute">
            The link may be old, or the note may have moved. Try the search (Ctrl K) or head back to your classes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
                href="/"
                className="flex items-center gap-2 rounded-lg border border-brand bg-brand px-5 py-2 text-sm font-semibold text-page transition hover:opacity-90"
            >
                <Home size={16} /> All classes
            </Link>
            <Link
                href="/learning"
                className="flex items-center gap-2 rounded-lg border border-brand/50 px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10"
            >
                <LayoutDashboard size={16} /> My Learning
            </Link>
            </div>
        </div>
        </main>
    );
    }