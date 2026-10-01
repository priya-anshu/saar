    import {
    Atom,
    BookOpen,
    Box,
    Calculator,
    Code,
    Dna,
    FileText,
    FlaskConical,
    Globe,
    ImageIcon,
    Languages,
    Leaf,
    Microscope,
    Monitor,
    Receipt,
    TrendingUp,
    Zap,
    type LucideIcon,
    } from "lucide-react";
    import type { NoteType } from "./data";

    export const SUBJECT_ICON: Record<string, LucideIcon> = {
    math: Calculator,
    book: BookOpen,
    leaf: Leaf,
    language: Languages,
    computer: Monitor,
    science: Microscope,
    globe: Globe,
    physics: Atom,
    chemistry: FlaskConical,
    biology: Dna,
    code: Code,
    economics: TrendingUp,
    accounts: Receipt,
    };

    export const TYPE_ICON: Record<NoteType, LucideIcon> = {
    html: Zap,
    image: ImageIcon,
    "3d": Box,
    pdf: FileText,
    };