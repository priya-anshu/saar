    export const CLASSES = [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    ] as const;

    export type NoteType =
    | "html"
    | "image"
    | "3d"
    | "pdf";

    export type SubjectIconKey =
    | "mathematics"
    | "english"
    | "evs"
    | "hindi"
    | "computer"
    | "science"
    | "social-science"
    | "physics"
    | "chemistry"
    | "biology"
    | "computer-science"
    | "economics"
    | "accountancy";

    export type Subject = {
    slug: string;
    name: string;
    icon: SubjectIconKey;
    };

    export type Note = {
    class: number;
    subject: string;
    slug: string;
    title: string;
    type: NoteType;
    date: string;
    url: string;
    };

    export const SUBJECTS: Subject[] = [
    {
        slug: "mathematics",
        name: "Mathematics",
        icon: "mathematics",
    },
    {
        slug: "english",
        name: "English",
        icon: "english",
    },
    {
        slug: "evs",
        name: "EVS",
        icon: "evs",
    },
    {
        slug: "hindi",
        name: "Hindi",
        icon: "hindi",
    },
    {
        slug: "computer",
        name: "Computer",
        icon: "computer",
    },
    {
        slug: "science",
        name: "Science",
        icon: "science",
    },
    {
        slug: "social-science",
        name: "Social Science",
        icon: "social-science",
    },
    {
        slug: "physics",
        name: "Physics",
        icon: "physics",
    },
    {
        slug: "chemistry",
        name: "Chemistry",
        icon: "chemistry",
    },
    {
        slug: "biology",
        name: "Biology",
        icon: "biology",
    },
    {
        slug: "computer-science",
        name: "Computer Science",
        icon: "computer-science",
    },
    {
        slug: "economics",
        name: "Economics",
        icon: "economics",
    },
    {
        slug: "accountancy",
        name: "Accountancy",
        icon: "accountancy",
    },
    ];

    export function subjectsFor(
    _classNumber: number,
    ): Subject[] {
    return SUBJECTS;
    }

    export const TYPE_LABEL: Record<NoteType, string> = {
    html: "Interactive",
    image: "Visual",
    "3d": "3D Model",
    pdf: "PDF",
    };

    export function formatDate(date: string) {
    const parsed = new Date(`${date}T00:00:00Z`);

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(parsed);
    }