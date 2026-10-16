    "use client";

    import { Printer } from "lucide-react";

    export default function PrintButton() {
    return (
        <button
        onClick={() => window.print()}
        aria-label="Print or save as PDF"
        title="Print or save as PDF"
        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-tint text-mute transition hover:text-fg"
        >
        <Printer size={16} />
        </button>
    );
    }