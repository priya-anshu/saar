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
  Image as ImageIcon,
  Languages,
  Layers,
  Leaf,
  ListChecks,
  Microscope,
  Monitor,
  PenLine,
  Receipt,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { NoteKind, NoteType } from "./data";

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
  tsx: Zap,
  html: Zap,
  image: ImageIcon,
  "3d": Box,
  pdf: FileText,
};

export const KIND_ICON: Record<NoteKind, LucideIcon> = {
  note: BookOpen,
  quiz: ListChecks,
  practice: PenLine,
  cards: Layers,
};

// Safe lookups: never return undefined
export const subjectIcon = (key: string): LucideIcon => SUBJECT_ICON[key] ?? BookOpen;
export const typeIcon = (type: NoteType): LucideIcon => TYPE_ICON[type] ?? FileText;
export const kindIcon = (kind: NoteKind): LucideIcon => KIND_ICON[kind] ?? BookOpen;