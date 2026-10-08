    export default function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Saar logo">
        <defs>
            <linearGradient id="saar-g" x1="8" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4f46e5" />
            <stop offset="0.55" stopColor="#db2777" />
            <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#saar-g)" />
        <path
            d="M40 26C40 19 22 19 22 29C22 38 40 34 40 44C40 53 22 53 22 46"
            fill="none"
            stroke="#fff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M47 11L48.8 15.7L53.5 17.5L48.8 19.3L47 24L45.2 19.3L40.5 17.5L45.2 15.7Z" fill="#fff" />
        </svg>
    );
    }