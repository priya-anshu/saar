    import fs from "fs";
    import path from "path";
    import { CLASSES, detectType, subjectsFor, type Note } from "./data";

    const ROOT = path.join(process.cwd(), "public", "notes");
    const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})[_-]?(.*)$/;

    function titleCase(text: string) {
    return text
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    export function getNotes(cls: number, subject: string): Note[] {
    const dir = path.join(ROOT, String(cls), subject);
    if (!fs.existsSync(dir)) return [];

    const notes: Note[] = [];

    for (const file of fs.readdirSync(dir)) {
        const type = detectType(file);
        if (!type) continue;

        const base = file.replace(/\.[^.]+$/, "");
        const match = base.match(DATE_PREFIX);

        const date = match
        ? new Date(match[1]).toISOString()
        : fs.statSync(path.join(dir, file)).mtime.toISOString();

        notes.push({
        slug: base,
        class: cls,
        subject,
        title: titleCase(match ? match[2] : base) || "Untitled",
        type,
        url: `/notes/${cls}/${subject}/${encodeURIComponent(file)}`,
        date,
        });
    }

    return notes;
    }

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