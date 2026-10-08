import type { Metadata } from "next";
import { Inter, Fraunces, Caveat } from "next/font/google";
import Link from "next/link";
import { HiAcademicCap } from "react-icons/hi2";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Saar — Learn the essence",
  description: "Quality notes for Class 3 to 12. Interactive, visual, and to the point.",
};

// Runs before first paint so there is no light/dark flash
const THEME_SCRIPT = `try{var t=localStorage.getItem("saar-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-line bg-page/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand4 text-black">
                <HiAcademicCap size={20} />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">Saar</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-mute sm:block">Learn the essence.</span>
              <ThemeToggle />
            </div>
          </div>
        </header>
        {children}
        <footer className="mt-24 border-t border-line py-8 text-center text-sm text-mute">
          Saar · Quality over quantity
        </footer>
      </body>
    </html>
  );
}