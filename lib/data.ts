    export type NoteType = "tsx" | "html" | "image" | "3d" | "pdf";

    export type Subject = { slug: string; name: string; icon: string };

    export type Note = {
    slug: string;
    class: number;
    subject: string;
    title: string;
    type: NoteType;
    url: string;
    date: string;
    };

    const s = (name: string, icon: string): Subject => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    icon,
    });

    export const CLASSES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const ALL_SUBJECTS: Subject[] = [
    s("Mathematics", "math"),
    s("Science", "science"),
    s("Physics", "physics"),
    s("Chemistry", "chemistry"),
    s("Biology", "biology"),
    s("Social Science", "globe"),
    s("English", "book"),
    s("Hindi", "language"),
    s("Computer", "computer"),
    s("Computer Science", "code"),
    s("Economics", "economics"),
    s("Accountancy", "accounts"),
    s("EVS", "leaf"),
    ];

    // Every class gets every subject. A subject with no notes simply shows "0".
    export function subjectsFor(cls: number): Subject[] {
    void cls;
    return ALL_SUBJECTS;
    }

    export function detectType(filename: string): NoteType | null {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "tsx") return "tsx";
    if (["html", "htm"].includes(ext)) return "html";
    if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) return "image";
    if (ext === "glb") return "3d";
    if (ext === "pdf") return "pdf";
    return null;
    }

    export const TYPE_LABEL: Record<NoteType, string> = {
    tsx: "Interactive",
    html: "Interactive",
    image: "Image",
    "3d": "3D Model",
    pdf: "PDF",
    };

    export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
    }