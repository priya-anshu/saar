    "use client";

    import { useEffect, useState } from "react";
    import { Download, WifiOff } from "lucide-react";

    interface InstallEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
    }

    /** Registers the offline service worker (production only). */
    export function ServiceWorkerRegister() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        // In dev, remove any old worker so cached files never confuse you while coding
        if (process.env.NODE_ENV !== "production") {
        navigator.serviceWorker
            .getRegistrations()
            .then((list) => list.forEach((r) => r.unregister()))
            .catch(() => {});
        return;
        }

        const register = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
        };
        if (document.readyState === "complete") {
        register();
        } else {
        window.addEventListener("load", register, { once: true });
        return () => window.removeEventListener("load", register);
        }
    }, []);

    return null;
    }

    /** Small pill at the bottom of the screen while the device has no internet. */
    export function OfflineBanner() {
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        const update = () => setOffline(!navigator.onLine);
        update();
        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        return () => {
        window.removeEventListener("online", update);
        window.removeEventListener("offline", update);
        };
    }, []);

    if (!offline) return null;

    return (
        <div
        role="status"
        className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-line bg-page px-4 py-2 text-sm shadow-lg print:hidden"
        >
        <WifiOff size={15} className="shrink-0 text-brand4" />
        You’re offline. Pages you opened before still work.
        </div>
    );
    }

    /** Shows only when the browser says the site can be installed. */
    export function InstallButton() {
    const [evt, setEvt] = useState<InstallEvent | null>(null);

    useEffect(() => {
        const onPrompt = (e: Event) => {
        e.preventDefault();
        setEvt(e as InstallEvent);
        };
        const onInstalled = () => setEvt(null);
        window.addEventListener("beforeinstallprompt", onPrompt);
        window.addEventListener("appinstalled", onInstalled);
        return () => {
        window.removeEventListener("beforeinstallprompt", onPrompt);
        window.removeEventListener("appinstalled", onInstalled);
        };
    }, []);

    if (!evt) return null;

    return (
        <button
        onClick={async () => {
            await evt.prompt();
            setEvt(null);
        }}
        className="flex items-center gap-2 rounded-full border border-brand/50 px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand/10"
        >
        <Download size={15} /> Install Saar app
        </button>
    );
    }