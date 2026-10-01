    import type { LucideIcon } from "lucide-react";

    import {
    Atom,
    BookOpen,
    BookOpenText,
    Box,
    Calculator,
    Code2,
    Cpu,
    Dna,
    FileCode2,
    FileText,
    FlaskConical,
    Globe2,
    Image as ImageIcon,
    Languages,
    Leaf,
    Laptop,
    ReceiptText,
    Sigma,
    Sparkles,
    TrendingUp,
    } from "lucide-react";

    import type {
    NoteType,
    SubjectIconKey,
    } from "@/lib/data";

    export const SUBJECT_ICON: Record<
    SubjectIconKey,
    LucideIcon
    > = {
    mathematics: Sigma,
    english: Languages,
    evs: Leaf,
    hindi: BookOpenText,
    computer: Laptop,
    science: Sparkles,
    "social-science": Globe2,
    physics: Atom,
    chemistry: FlaskConical,
    biology: Dna,
    "computer-science": Code2,
    economics: TrendingUp,
    accountancy: ReceiptText,
    };

    export const TYPE_ICON: Record<
    NoteType,
    LucideIcon
    > = {
    html: FileCode2,
    image: ImageIcon,
    "3d": Box,
    pdf: FileText,
    };