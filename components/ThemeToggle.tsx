    "use client";

    import { useEffect, useState } from "react";
    import { Moon, Sun } from "lucide-react";
    import { useTheme } from "next-themes";

    export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
        <div
            className="
            h-10 w-10 rounded-xl
            border border-black/[0.08]
            bg-black/[0.03]
            dark:border-white/[0.1]
            dark:bg-white/[0.05]
            "
        />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        className="
            grid h-10 w-10 place-items-center rounded-xl
            border border-black/[0.08]
            bg-black/[0.03]
            text-zinc-700
            transition-all duration-200
            hover:bg-black/[0.07]
            hover:text-zinc-950
            dark:border-white/[0.1]
            dark:bg-white/[0.05]
            dark:text-white/75
            dark:hover:bg-white/[0.1]
            dark:hover:text-white
        "
        >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
    }