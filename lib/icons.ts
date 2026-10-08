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
  tsx: Zap,
  html: Zap,
  image: ImageIcon,
  "3d": Box,
  pdf: FileText,
};

// Safe lookups: never return undefined
export const subjectIcon = (key: string): LucideIcon => SUBJECT_ICON[key] ?? BookOpen;
export const typeIcon = (type: NoteType): LucideIcon => TYPE_ICON[type] ?? FileText;