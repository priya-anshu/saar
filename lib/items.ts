    import type { SearchItem } from "@/components/SearchDialog";
    import { KIND_LABEL, noteId, subjectsFor } from "./data";
    import { getAllNotes } from "./notes";

    export function getItems(): SearchItem[] {
    const names = Object.fromEntries(subjectsFor(3).map((s) => [s.slug, s.name]));
    return getAllNotes().map((n) => ({
        id: noteId(n),
        href: `/note/${n.class}/${n.subject}/${n.slug}`,
        title: n.title,
        cls: n.class,
        subjectName: names[n.subject] ?? n.subject,
        kind: n.kind,
        kindLabel: KIND_LABEL[n.kind],
        date: n.date,
    }));
    }