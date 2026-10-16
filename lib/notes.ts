    import fs from "fs";
    import path from "path";
    import { CLASSES, KIND_LABEL, detectType, subjectsFor, type Note, type NoteKind } from "./data";

    const SOURCES = [
    { root: path.join(process.cwd(), "content", "notes"), isPublic: false },
    { root: path.join(process.cwd(), "public", "notes"), isPublic: true },
    ];

    // [kind_] [YYYY-MM-DD_] [NN-] title
    // e.g. quiz_2026-10-16_10-nouns-set-1  ->  quiz, dated, lesson number 10, title "Nouns Set 1"
    const NAME = /^(?:(note|quiz|practice|cards)[_-])?(?:(\d{4}-\d{2}-\d{2})[_-]?)?(?:(\d{1,3})[_-])?(.*)$/i;

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
            title: titleCase(m?.[4] ?? base) || KIND_LABEL[kind],
            kind,
            type,
            url: isPublic ? `/notes/${cls}/${subject}/${encodeURIComponent(file)}` : "",
            date,
            order: m?.[3] ? Number(m[3]) : undefined,
        });
        }
    }

    return notes;
    }

    const newestFirst = (a: Note, b: Note) =>
    a.date === b.date ? b.slug.localeCompare(a.slug) : b.date.localeCompare(a.date);

    // What students see in lists: numbered lessons in teaching order (10, 11, 20...),
    // then everything else newest first.
    function listOrder(a: Note, b: Note) {
    if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order || a.slug.localeCompare(b.slug);
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return newestFirst(a, b);
    }

    // What the note page uses for Previous / Next. That page treats the item before
    // the current one as "newer", so numbered lessons go highest number first here.
    function navOrder(a: Note, b: Note) {
    if (a.order !== undefined && b.order !== undefined) {
        return b.order - a.order || b.slug.localeCompare(a.slug);
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return newestFirst(a, b);
    }

    const collectClass = (cls: number) => subjectsFor(cls).flatMap((s) => getNotes(cls, s.slug));

    export function getClassNotes(cls: number): Note[] {
    return collectClass(cls).sort(listOrder);
    }

    export function getAllNotes(): Note[] {
    return CLASSES.flatMap(collectClass).sort(navOrder);
    }