import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import Link from "next/link";
import { HiAcademicCap } from "react-icons/hi2";
import { ThemeProvider } from "next-themes";

import ThemeToggle from "@/components/ThemeToggle";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Saar — Learn the essence",
  description:
    "Quality notes for Class 3 to 12. Interactive, visual, and to the point.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#f7f8fc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="saar-theme"
        >
          <header
            className="
              sticky top-0 z-50
              border-b border-black/[0.07]
              bg-white/80 backdrop-blur-2xl
              dark:border-white/[0.08]
              dark:bg-[#07070d]/80
            "
          >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
              <Link href="/" className="group flex items-center gap-2.5">
                <span
                  className="
                    grid h-9 w-9 place-items-center rounded-xl
                    bg-gradient-to-br from-indigo-500 to-amber-400
                    text-black shadow-lg shadow-indigo-500/10
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                >
                  <HiAcademicCap size={20} />
                </span>

                <span
                  className="
                    font-display text-xl font-semibold tracking-tight
                    text-zinc-950
                    dark:text-white
                  "
                >
                  Saar
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <span
                  className="
                    hidden text-sm text-zinc-500 sm:block
                    dark:text-white/45
                  "
                >
                  Learn the essence.
                </span>

                <ThemeToggle />
              </div>
            </div>
          </header>

          {children}

          <footer
            className="
              mt-24 border-t
              border-black/[0.07]
              py-8 text-center text-sm text-zinc-500
              dark:border-white/[0.08]
              dark:text-white/40
            "
          >
            Saar · Quality over quantity
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}