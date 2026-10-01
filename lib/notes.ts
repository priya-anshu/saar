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
        .replace(/\b\w/g, (char) => char.toUpperCase());
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

    if (!SUPPORTED_EXTENSIONS.has(extension.toLowerCase())) {
        return null;
    }

    const type = getNoteType(extension);

    if (!type) {
        return null;
    }

    const slug = path.basename(
        filename,
        extension,
    );

    return {
        class: classNumber,
        subject,
        slug,
        title: titleFromSlug(slug),
        type,
        date: dateFromSlug(slug),

        // IMPORTANT:
        // This points to /public/notes, which becomes
        // the root-level /notes URL in production.
        url: `/notes/${classNumber}/${subject}/${filename}`,
    };
    }

    export function getAllNotes(): Note[] {
    if (!fs.existsSync(NOTES_ROOT)) {
        return [];
    }

    const notes: Note[] = [];

    const classDirectories = fs
        .readdirSync(NOTES_ROOT, {
        withFileTypes: true,
        })
        .filter((entry) => entry.isDirectory())
        .filter((entry) => /^\d+$/.test(entry.name))
        .sort(
        (a, b) =>
            Number(a.name) - Number(b.name),
        );

    for (const classDirectory of classDirectories) {
        const classNumber = Number(
        classDirectory.name,
        );

        const classPath = path.join(
        NOTES_ROOT,
        classDirectory.name,
        );

        const subjectDirectories = fs
        .readdirSync(classPath, {
            withFileTypes: true,
        })
        .filter((entry) => entry.isDirectory());

        for (const subjectDirectory of subjectDirectories) {
        const subject =
            subjectDirectory.name;

        const subjectPath = path.join(
            classPath,
            subject,
        );

        const files = fs
            .readdirSync(subjectPath, {
            withFileTypes: true,
            })
            .filter((entry) => entry.isFile());

        for (const file of files) {
            const note = buildNote(
            classNumber,
            subject,
            file.name,
            );

            if (note) {
            notes.push(note);
            }
        }
        }
    }

    return notes.sort((a, b) => {
        const dateCompare =
        b.date.localeCompare(a.date);

        if (dateCompare !== 0) {
        return dateCompare;
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