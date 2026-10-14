    import type { Metadata } from "next";
    import LearningView from "@/components/LearningView";
    import { getItems } from "@/lib/items";

    export const metadata: Metadata = { title: "My Learning" };

    export default function LearningPage() {
    return (
        <main className="glow-bg min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-4xl px-5 pb-10 pt-12">
            <h1 className="font-display text-4xl font-semibold sm:text-6xl">My Learning</h1>
            <p className="mt-3 text-mute">
            Your progress, bookmarks and scores. Saved on this device only, nothing is uploaded.
            </p>
            <LearningView items={getItems()} />
        </div>
        </main>
    );
    }