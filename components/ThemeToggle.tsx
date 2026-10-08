    "use client";

    import { useEffect, useState } from "react";
    import { Moon, Sun } from "lucide-react";

    export default function ThemeToggle() {
    const [dark, setDark] = useState<boolean | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("saar-theme");
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDark(saved ? saved === "dark" : systemDark);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.dataset.theme = next ? "dark" : "light";
        localStorage.setItem("saar-theme", next ? "dark" : "light");
    };

    // Same size before the theme is known, so the header doesn't jump
    if (dark === null) return <span className="h-9 w-9" />;

    return (
        <button
        onClick={toggle}
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-tint text-mute transition hover:text-fg"
        >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
    );
    }