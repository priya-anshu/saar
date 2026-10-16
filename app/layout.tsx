import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Caveat } from "next/font/google";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { InstallButton, OfflineBanner, ServiceWorkerRegister } from "@/components/PwaBits";
import SearchDialog from "@/components/SearchDialog";
import ThemeToggle from "@/components/ThemeToggle";
import { getItems } from "@/lib/items";
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
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Saar", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=2",
    apple: "/apple-touch-icon.png",
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
        <header className="sticky top-0 z-30 border-b border-line bg-page/70 backdrop-blur-xl print:hidden">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Saar home">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-xl font-semibold tracking-tight">Saar</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-mute lg:block">Learn the essence.</span>
              <SearchDialog items={getItems()} />
              <Link
                href="/learning"
                aria-label="My Learning"
                className="flex h-9 items-center gap-2 rounded-full border border-line bg-tint px-3 text-sm text-mute transition hover:text-fg"
              >
                <LayoutDashboard size={16} />
                <span className="hidden md:inline">My Learning</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-24 flex flex-col items-center gap-3 border-t border-line py-8 text-center text-sm text-mute print:hidden">
          <p>Saar · Quality over quantity</p>
          <InstallButton />
        </footer>

        <OfflineBanner />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}