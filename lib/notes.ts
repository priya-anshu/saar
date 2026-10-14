    import fs from "fs";
    import path from "path";
    import { CLASSES, KIND_LABEL, detectType, subjectsFor, type Note, type NoteKind } from "./data";

    const SOURCES = [
    { root: path.join(process.cwd(), "content", "notes"), isPublic: false },
    { root: path.join(process.cwd(), "public", "notes"), isPublic: true },
    ];

    // [kind_] [YYYY-MM-DD_] title        e.g. quiz_2026-10-09_what-is-matter
    const NAME = /^(?:(note|quiz|practice|cards)[_-])?(?:(\d{4}-\d{2}-\d{2})[_-]?)?(.*)$/i;

    function titleCase(text: string) {
    return text
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    export function getNotes(cls: number, subject: string): Note[] {
    const notes: Note[] = [];

    for (const { root, isPublic } of SOURCES) {
        const dir = path.join(root, String(cls), subject);
        if (!fs.existsSync(dir)) continue;

        for (const file of fs.readdirSync(dir)) {
        const type = detectType(file);
        if (!type) continue;
        // TSX files live in /content, every other type lives in /public
        if ((type === "tsx") === isPublic) continue;

        const base = file.replace(/\.[^.]+$/, "");
        const m = base.match(NAME);
        const kind = (m?.[1]?.toLowerCase() ?? "note") as NoteKind;
        const parsed = m?.[2] ? new Date(m[2]) : null;
        const date =
            parsed && !isNaN(parsed.getTime())
            ? parsed.toISOString()
            : fs.statSync(path.join(dir, file)).mtime.toISOString();

        notes.push({
            slug: base,
            class: cls,
            subject,
            title: titleCase(m?.[3] ?? base) || KIND_LABEL[kind],
            kind,
            type,
            url: isPublic ? `/notes/${cls}/${subject}/${encodeURIComponent(file)}` : "",
            date,
        });
        }
    }

    return notes;
    }

    // Newest first. Same date: name Z to A.
    const newestFirst = (a: Note, b: Note) =>
    a.date === b.date ? b.slug.localeCompare(a.slug) : b.date.localeCompare(a.date);

    export function getClassNotes(cls: number): Note[] {
    return subjectsFor(cls)
        .flatMap((s) => getNotes(cls, s.slug))
        .sort(newestFirst);
    }

    export function getAllNotes(): Note[] {
    return CLASSES.flatMap((c) => getClassNotes(c));
    }