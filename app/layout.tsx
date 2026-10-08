import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Caveat } from "next/font/google";
import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: { default: "Saar — Learn the essence", template: "%s · Saar" },
  description:
    "Saar: quality notes for Class 3 to 12. Interactive lessons, 3D models and clear visuals, built for understanding.",
  applicationName: "Saar",
  authors: [{ name: "Saar" }],
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=2",
  },
  openGraph: {
    title: "Saar — Learn the essence",
    description: "Quality notes for Class 3 to 12. Interactive, visual, and to the point.",
    siteName: "Saar",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07070d" },
  ],
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
            <Link href="/" className="flex items-center gap-2.5" aria-label="Saar home">
              <LogoMark className="h-9 w-9" />
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