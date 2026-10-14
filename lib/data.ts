    export type NoteType = "tsx" | "html" | "image" | "3d" | "pdf";
    export type NoteKind = "note" | "quiz" | "practice" | "cards";

    export type Subject = { slug: string; name: string; icon: string };

    export type Note = {
    slug: string;
    class: number;
    subject: string;
    title: string;
    kind: NoteKind;
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

    // Every class gets every subject. A subject with no content simply shows 0.
    export function subjectsFor(cls: number): Subject[] {
    void cls;
    return ALL_SUBJECTS;
    }

    export const KINDS: { key: NoteKind; label: string; empty: string }[] = [
    { key: "note", label: "Notes", empty: "No notes yet. Fresh content is coming soon." },
    { key: "quiz", label: "Quizzes", empty: "No quizzes yet. Check back soon." },
    { key: "practice", label: "Practice", empty: "No practice questions yet. Check back soon." },
    { key: "cards", label: "Flashcards", empty: "No flashcards yet. Check back soon." },
    ];

    export const KIND_LABEL: Record<NoteKind, string> = {
    note: "Note",
    quiz: "Quiz",
    practice: "Practice questions",
    cards: "Flashcards",
    };

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

    // Unique id used for progress, bookmarks and search
    export const noteId = (n: Pick<Note, "class" | "subject" | "slug">) =>
    `${n.class}/${n.subject}/${n.slug}`;