    import type { CSSProperties, ReactNode } from "react";

    /** 4 colours for light mode and 4 for dark mode, as hex codes. Set inside each note file. */
    export type NoteColors = {
    light: [string, string, string, string];
    dark: [string, string, string, string];
    };

    const NAMES = ["--brand", "--brand2", "--brand3", "--brand4"];

    function toVars(colors?: NoteColors): CSSProperties | undefined {
    if (!colors) return undefined;
    const vars: Record<string, string> = {};
    NAMES.forEach((name, i) => {
        vars[name] = `light-dark(${colors.light[i]}, ${colors.dark[i]})`;
    });
    return vars as CSSProperties;
    }

    /** Full-page note wrapper with a coloured header band. Use once, as the root. */
    export function Note({
    title,
    intro,
    colors,
    children,
    }: {
    title: string;
    intro?: ReactNode;
    colors?: NoteColors;
    children: ReactNode;
    }) {
    return (
        <div style={toVars(colors)}>
        <div className="bg-gradient-to-br from-brand/25 via-brand2/15 to-brand3/10">
            <header className="mx-auto max-w-4xl px-5 pb-10 pt-12 sm:pt-16">
            <div className="mb-5 flex gap-1.5">
                <span className="h-1.5 w-10 rounded-full bg-brand" />
                <span className="h-1.5 w-10 rounded-full bg-brand2" />
                <span className="h-1.5 w-10 rounded-full bg-brand3" />
                <span className="h-1.5 w-10 rounded-full bg-brand4" />
            </div>
            <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">{title}</h1>
            {intro && <p className="mt-4 max-w-2xl text-lg text-mute">{intro}</p>}
            </header>
        </div>
        <div className="note-body mx-auto max-w-4xl space-y-14 px-5 pb-20 pt-10">{children}</div>
        </div>
    );
    }

    /** Heading + open content. Takes the next colour in the cycle automatically. */
    export function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="leading-relaxed">
        <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold">
            <span className="sec-bg h-7 w-1.5 rounded-full" />
            {title}
        </h2>
        <div className="space-y-3 text-[1.05rem]">{children}</div>
        </section>
    );
    }

    /** Key term in the current section's colour. */
    export function Hl({ children }: { children: ReactNode }) {
    return <b className="sec-text font-semibold">{children}</b>;
    }

    /** Highlighted remark with a coloured edge. */
    export function Callout({ children }: { children: ReactNode }) {
    return (
        <div className="sec-soft sec-edge rounded-r-xl border-l-4 px-4 py-3">{children}</div>
    );
    }