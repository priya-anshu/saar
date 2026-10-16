    import sharp from "sharp";

    const gradient = `<defs><linearGradient id="g" x1="6" y1="2" x2="58" y2="62" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4f46e5"/><stop offset="0.55" stop-color="#db2777"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>`;
    const mark = `<path d="M43 22C43 12 21 12 21 25C21 37 43 29 43 41C43 54 21 54 21 44" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Rounded tile for normal icons
    const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${gradient}<rect width="64" height="64" rx="14" fill="url(#g)"/>${mark}</svg>`;

    // Full square with extra padding for maskable and Apple icons
    const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${gradient}<rect width="64" height="64" fill="url(#g)"/><g transform="translate(32 33) scale(0.72) translate(-32 -33)">${mark}</g></svg>`;

    const jobs = [
    ["icon-192.png", rounded, 192],
    ["icon-512.png", rounded, 512],
    ["icon-maskable-512.png", full, 512],
    ["apple-touch-icon.png", full, 180],
    ];

    for (const [file, svg, size] of jobs) {
    await sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toFile(`public/${file}`);
    console.log(`created public/${file}`);
    }