import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Link from "next/link";
import { HiAcademicCap } from "react-icons/hi2";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Saar — Learn the essence",
  description: "Quality notes for Class 3 to 12. Interactive, visual, and to the point.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07070d]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-amber-400 text-black">
                <HiAcademicCap size={20} />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">Saar</span>
            </Link>
            <span className="hidden text-sm text-white/50 sm:block">Learn the essence.</span>
          </div>
        </header>
        {children}
        <footer className="mt-24 border-t border-white/10 py-8 text-center text-sm text-white/40">
          Saar · Quality over quantity
        </footer>
      </body>
    </html>
  );
}