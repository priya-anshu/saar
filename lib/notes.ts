    import fs from "node:fs";
    import path from "node:path";

    import type {
    Note,
    NoteType,
    } from "@/lib/data";

    const NOTES_ROOT = path.join(
    process.cwd(),
    "public",
    "notes",
    );

    const SUPPORTED_EXTENSIONS = new Set([
    ".html",
    ".htm",
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
    ".glb",
    ".gltf",
    ]);

    function getNoteType(
    extension: string,
    ): NoteType | null {
    switch (extension.toLowerCase()) {
        case ".html":
        case ".htm":
        return "html";

        case ".pdf":
        return "pdf";

        case ".png":
        case ".jpg":
        case ".jpeg":
        case ".webp":
        case ".gif":
        case ".svg":
        return "image";

        case ".glb":
        case ".gltf":
        return "3d";

        default:
        return null;
    }
    }

    function titleFromSlug(slug: string) {
    return slug
        .replace(/^\d{4}-\d{2}-\d{2}_/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) =>
        char.toUpperCase(),
        );
    }

    function dateFromSlug(slug: string) {
    const match = slug.match(
        /^(\d{4}-\d{2}-\d{2})/,
    );

    return match?.[1] ?? "1970-01-01";
    }

    function buildNote(
    classNumber: number,
    subject: string,
    filename: string,
    ): Note | null {
    const extension = path.extname(filename);
    const type = getNoteType(extension);

    if (!type) {
        return null;
    }

    const baseName = path.basename(
        filename,
        extension,
    );

    const publicPath =
        `/notes/${classNumber}/${subject}/${filename}`;

    return {
        class: classNumber,
        subject,
        slug: baseName,
        title: titleFromSlug(baseName),
        type,
        date: dateFromSlug(baseName),
        url: publicPath,
    };
    }

    export function getAllNotes(): Note[] {
    if (!fs.existsSync(NOTES_ROOT)) {
        return [];
    }

    const classDirectories = fs
        .readdirSync(NOTES_ROOT, {
        withFileTypes: true,
        })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((name) => /^\d+$/.test(name))
        .sort(
        (a, b) =>
            Number(a) - Number(b),
        );

    const notes: Note[] = [];

    for (const classDirectory of classDirectories) {
        const classNumber = Number(
        classDirectory,
        );

        const classPath = path.join(
        NOTES_ROOT,
        classDirectory,
        );

        const subjectDirectories = fs
        .readdirSync(classPath, {
            withFileTypes: true,
        })
        .filter((entry) => entry.isDirectory());

        for (const subjectDirectory of subjectDirectories) {
        const subject = subjectDirectory.name;

        const subjectPath = path.join(
            classPath,
            subject,
        );

        const files = fs
            .readdirSync(subjectPath, {
            withFileTypes: true,
            })
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name);

        for (const filename of files) {
            const note = buildNote(
            classNumber,
            subject,
            filename,
            );

            if (note) {
            notes.push(note);
            }
        }
        }
    }

    return notes.sort((a, b) => {
        const dateComparison =
        b.date.localeCompare(a.date);

        if (dateComparison !== 0) {
        return dateComparison;
        }

        return a.title.localeCompare(b.title);
    });
    }

    export function getClassNotes(
    classNumber: number,
    ): Note[] {
    return getAllNotes().filter(
        (note) => note.class === classNumber,
    );
    }