    "use client";

    import { useEffect, useRef, useState } from "react";
    import { List, Minus, Plus, Type } from "lucide-react";

    type Head = { id: string; text: string };
    type Panel = "toc" | "size" | null;

    const SIZES = [87.5, 100, 112.5, 125]; // percent of the normal text size
    const SIZE_LABELS = ["Small", "Normal", "Large", "Extra large"];
    const STORE = "saar-text-size";

    const iconBtn =
    "grid h-9 w-9 place-items-center rounded-full border transition";
    const iconIdle = "border-line bg-tint text-mute hover:text-fg";
    const iconOn = "border-brand/40 bg-brand/10 text-brand";
    const stepBtn =
    "grid h-9 w-9 place-items-center rounded-lg border border-line bg-tint text-fg transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40";

    export default function ReadingTools() {
    const barRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const headsRef = useRef<HTMLElement[]>([]);

    const [heads, setHeads] = useState<Head[]>([]);
    const [active, setActive] = useState(-1);
    const [open, setOpen] = useState<Panel>(null);
    const [size, setSize] = useState(1);

    // Build the table of contents from the note's section headings
    useEffect(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>("#note-content h2"));
        headsRef.current = els;
        setHeads(
        els.map((el, i) => {
            if (!el.id) el.id = `section-${i + 1}`;
            el.style.scrollMarginTop = "8rem";
            return { id: el.id, text: (el.textContent ?? "").trim() };
        })
        );
    }, []);

    // Reading progress and the current section
    useEffect(() => {
        let ticking = false;

        const update = () => {
        ticking = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

        let idx = -1;
        headsRef.current.forEach((h, i) => {
            if (h.getBoundingClientRect().top <= 160) idx = i;
        });
        setActive(idx);
        };

        const onScroll = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        };
    }, [heads, size]);

    // Close menus on outside click or Escape
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent | TouchEvent) => {
        if (!wrapRef.current?.contains(e.target as Node)) setOpen(null);
        };
        const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(null);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("touchstart", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("touchstart", onDown);
        document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Load the saved text size
    useEffect(() => {
        try {
        const raw = localStorage.getItem(STORE);
        if (raw !== null) {
            const n = Number(raw);
            if (Number.isInteger(n) && n >= 0 && n < SIZES.length) setSize(n);
        }
        } catch {}
    }, []);

    // Apply the text size while a note is open, and undo it when leaving
    useEffect(() => {
        document.documentElement.style.fontSize = `${SIZES[size]}%`;
        return () => {
        document.documentElement.style.fontSize = "";
        };
    }, [size]);

    const change = (delta: number) => {
        const next = Math.min(SIZES.length - 1, Math.max(0, size + delta));
        setSize(next);
        try {
        localStorage.setItem(STORE, String(next));
        } catch {}
    };

    const goTo = (i: number) => {
        headsRef.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
        setOpen(null);
    };

    return (
        <>
        {/* progress line along the bottom edge of the top bar */}
        <div
            ref={barRef}
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-linear-to-r from-brand to-brand2"
            style={{ transform: "scaleX(0)" }}
        />

        <div ref={wrapRef} className="flex items-center gap-2">
            {heads.length >= 3 && (
            <button
                onClick={() => setOpen(open === "toc" ? null : "toc")}
                aria-label="Table of contents"
                aria-expanded={open === "toc"}
                className={`${iconBtn} ${open === "toc" ? iconOn : iconIdle}`}
            >
                <List size={16} />
            </button>
            )}

            <button
            onClick={() => setOpen(open === "size" ? null : "size")}
            aria-label="Text size"
            aria-expanded={open === "size"}
            className={`${iconBtn} ${open === "size" ? iconOn : iconIdle}`}
            >
            <Type size={16} />
            </button>

            {open === "toc" && (
            <div className="absolute right-4 top-full z-30 mt-2 max-h-[60vh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-line bg-page p-2 shadow-2xl">
                <p className="px-3 pb-1 pt-2 text-xs font-medium tracking-widest text-mute uppercase">
                In this note
                </p>
                {heads.map((h, i) => (
                <button
                    key={h.id}
                    onClick={() => goTo(i)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    i === active ? "bg-brand/10 text-fg" : "text-mute hover:bg-tint hover:text-fg"
                    }`}
                >
                    <span className={`w-5 shrink-0 font-semibold ${i === active ? "text-brand" : ""}`}>
                    {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">{h.text}</span>
                </button>
                ))}
            </div>
            )}

            {open === "size" && (
            <div className="absolute right-4 top-full z-30 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-page p-3 shadow-2xl">
                <p className="mb-2 text-xs font-medium tracking-widest text-mute uppercase">Text size</p>
                <div className="flex items-center justify-between gap-2">
                <button
                    onClick={() => change(-1)}
                    disabled={size === 0}
                    aria-label="Smaller text"
                    className={stepBtn}
                >
                    <Minus size={16} />
                </button>
                <span className="text-sm font-medium">{SIZE_LABELS[size]}</span>
                <button
                    onClick={() => change(1)}
                    disabled={size === SIZES.length - 1}
                    aria-label="Larger text"
                    className={stepBtn}
                >
                    <Plus size={16} />
                </button>
                </div>
                {size !== 1 && (
                <button
                    onClick={() => change(1 - size)}
                    className="mt-3 w-full text-center text-sm text-brand hover:underline"
                >
                    Reset to normal
                </button>
                )}
            </div>
            )}
        </div>
        </>
    );
    }