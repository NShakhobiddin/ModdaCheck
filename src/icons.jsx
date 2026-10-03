/* =====================================================================
 *  MODDACHECK — ikonkalar to'plami (maxsus chizilgan)
 *  24×24 setka, 1.75 chiziq, yumaloq uchlar. Hammasi currentColor.
 *  Ishlatish: <Ic.Search className="w-5 h-5" />
 * ===================================================================== */
const Svg = ({ size = 24, sw = 1.75, children, className, ...rest }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" focusable="false" className={className} {...rest}>{children}</svg>
);
const STAR = (cx, cy, r) => {
    const k = r * 0.22; // egilish
    return `M${cx} ${cy - r}C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy}C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r}C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy}C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
};

const Ic = {
    // --- Navigatsiya ---
    Search: (p) => <Svg {...p}><circle cx="10.75" cy="10.75" r="6.25" /><path d="m19.5 19.5-4.3-4.3" /></Svg>,
    Scan: (p) => <Svg {...p}><path d="M4 8.5V6.5A2.5 2.5 0 0 1 6.5 4h2M15.5 4h2A2.5 2.5 0 0 1 20 6.5v2M20 15.5v2a2.5 2.5 0 0 1-2.5 2.5h-2M8.5 20h-2A2.5 2.5 0 0 1 4 17.5v-2" /><path d="M7.5 12h9" /></Svg>,
    Assistant: (p) => <Svg {...p}><path d="M20 11.5a7.75 7.75 0 0 1-11.4 6.85L4 19.75l1.45-4.25A7.75 7.75 0 1 1 20 11.5Z" /><path d={STAR(12.25, 11.5, 3.6)} fill="currentColor" stroke="none" /></Svg>,
    Book: (p) => <Svg {...p}><path d="M12 6.75C10.4 5.4 8.2 4.8 4 5v13.25c4.2-.2 6.4.4 8 1.75 1.6-1.35 3.8-1.95 8-1.75V5c-4.2-.2-6.4.4-8 1.75Z" /><path d="M12 6.75V20" /></Svg>,
    Info: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.75" /><path d="M12 11v5.25" /><path d="M12 7.75h.01" strokeWidth="2.4" /></Svg>,
    ChevronLeft: (p) => <Svg {...p}><path d="M14.5 5.5 8 12l6.5 6.5" /></Svg>,
    ChevronRight: (p) => <Svg {...p}><path d="M9.5 5.5 16 12l-6.5 6.5" /></Svg>,
    Close: (p) => <Svg {...p}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></Svg>,
    ArrowUp: (p) => <Svg {...p}><path d="M12 19V5.5M6.5 11 12 5.5 17.5 11" /></Svg>,

    // --- Brend ---
    Shield: (p) => <Svg {...p}><path d="M12 3.25 19 6v5.25c0 4.55-2.95 8.05-7 9.75-4.05-1.7-7-5.2-7-9.75V6l7-2.75Z" /><path d="m8.9 12.1 2.2 2.2 4.1-4.4" /></Svg>,

    // --- Toifalar ---
    Ban: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M6 6l12 12" /></Svg>,
    Rx: (p) => <Svg {...p}><path d="M6.5 20V4h4.75a3.6 3.6 0 0 1 0 7.2H6.5" /><path d="M9.6 11.2 18.5 20.5" /><path d="M18.5 13.5 12 20.5" /></Svg>,
    // Cheklangan (dori shishasi + qulf)
    Restricted: (p) => <Svg {...p}><rect x="4" y="3" width="8" height="3" rx=".9" /><path d="M4.5 6h7l.75 2.5v10a2 2 0 0 1-2 2H5.75a2 2 0 0 1-2-2v-10L4.5 6Z" /><path d="M8 11.25v4M6 13.25h4" /><rect x="13.25" y="14" width="8" height="6.75" rx="1.6" /><path d="M15.25 14v-1.6a2 2 0 0 1 4 0V14" /></Svg>,
    Globe: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.75" /><path d="M3.25 12h17.5" /><path d="M12 3.25c2.4 2.4 3.6 5.3 3.6 8.75S14.4 18.35 12 20.75C9.6 18.35 8.4 15.45 8.4 12S9.6 5.65 12 3.25Z" /></Svg>,
    Capsule: (p) => <Svg {...p}><g transform="rotate(-45 12 12)"><rect x="3.25" y="8.25" width="17.5" height="7.5" rx="3.75" /><path d="M12 8.25v7.5" /><path d="M12 8.25h4.25a3.75 3.75 0 0 1 0 7.5H12Z" fill="currentColor" fillOpacity=".22" stroke="none" /></g></Svg>,
    Flask: (p) => <Svg {...p}><path d="M9 3.5h6" /><path d="M10.25 3.5v5.4L5.4 17.4a2.1 2.1 0 0 0 1.85 3.1h9.5a2.1 2.1 0 0 0 1.85-3.1l-4.85-8.5V3.5" /><path d="M7.6 14.5h8.8" /></Svg>,
    Bolt: (p) => <Svg {...p}><path d="M13.25 3 5.75 13.25h5.75L10.75 21l7.5-10.25H12.5L13.25 3Z" /></Svg>,

    // --- Holat ---
    CheckCircle: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.75" /><path d="m8.4 12.2 2.45 2.45 4.75-4.9" /></Svg>,
    XCircle: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.75" /><path d="m9.4 9.4 5.2 5.2M14.6 9.4l-5.2 5.2" /></Svg>,
    Alert: (p) => <Svg {...p}><path d="M10.35 4.35 3.1 17.1a1.9 1.9 0 0 0 1.65 2.85h14.5a1.9 1.9 0 0 0 1.65-2.85L13.65 4.35a1.9 1.9 0 0 0-3.3 0Z" /><path d="M12 9.5v4" /><path d="M12 16.75h.01" strokeWidth="2.4" /></Svg>,
    Sparkle: (p) => <Svg {...p}><path d={STAR(11, 11, 7.5)} fill="currentColor" stroke="none" /><path d={STAR(18.5, 17.75, 2.75)} fill="currentColor" stroke="none" /></Svg>,
    WifiOff: (p) => <Svg {...p}><path d="M3.5 3.5l17 17" /><path d="M8.75 16.25a4.75 4.75 0 0 1 6.5 0" /><path d="M5.5 12.75a9.5 9.5 0 0 1 4.6-2.6M13.9 10.15a9.5 9.5 0 0 1 4.6 2.6" /><path d="M2.5 9.25a14 14 0 0 1 3.9-2.55M10.4 5.6A14 14 0 0 1 21.5 9.25" /><path d="M12 19.75h.01" strokeWidth="2.4" /></Svg>,

    // --- Hujjat / harakatlar ---
    Doc: (p) => <Svg {...p}><path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8L14 3.5Z" /><path d="M14 3.5V8h4.5" /><path d="M9 12.5h6M9 16h4" /></Svg>,
    Declare: (p) => <Svg {...p}><path d="M12.5 20.5h-5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H14l4.5 4.5v3.25" /><path d="M9 9h4.5M9 12.5h3" /><path d="m15.25 20.75.55-2.4 4.15-4.15a1.25 1.25 0 0 1 1.8 1.8L17.6 20.15l-2.35.6Z" /></Svg>,
    Clock: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.75" /><path d="M12 7.5V12l3 1.75" /></Svg>,
    Package: (p) => <Svg {...p}><path d="M12 3.25 19.75 7.4v9.2L12 20.75 4.25 16.6V7.4L12 3.25Z" /><path d="M4.25 7.4 12 11.55l7.75-4.15M12 11.55v9.2" /><path d="m8.1 5.3 7.8 4.2" /></Svg>,
    History: (p) => <Svg {...p}><path d="M3.75 12a8.25 8.25 0 1 0 2.45-5.85" /><path d="M3.75 4.75v4h4" /><path d="M12 8v4.25l2.75 1.6" /></Svg>,
    Share: (p) => <Svg {...p}><path d="M12 14.75V3.5M8 7.25 12 3.25l4 4" /><path d="M8 10.5H6.75a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H16" /></Svg>,
    Trash: (p) => <Svg {...p}><path d="M4.5 7h15" /><path d="M9.5 7V5.25a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7" /><path d="m6.5 7 .85 11.6a2 2 0 0 0 2 1.85h5.3a2 2 0 0 0 2-1.85L17.5 7" /></Svg>,
    External: (p) => <Svg {...p}><path d="M14 4.5h5.5V10M19.5 4.5l-8 8" /><path d="M17 13.5v4a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" /></Svg>,
    Camera: (p) => <Svg {...p}><path d="M4 8.75a2 2 0 0 1 2-2h1.9l1.5-2.25h5.2l1.5 2.25H18a2 2 0 0 1 2 2v8.75a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.75Z" /><circle cx="12" cy="12.75" r="3.25" /></Svg>,
    Image: (p) => <Svg {...p}><rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.5" /><circle cx="9" cy="9.75" r="1.6" /><path d="m20.25 15.25-4.6-4.6L7 19.25" /></Svg>,
    Light: (p) => <Svg {...p}><circle cx="12" cy="12" r="3.75" /><path d="M12 3.5v1.75M12 18.75v1.75M3.5 12h1.75M18.75 12h1.75M6 6l1.25 1.25M16.75 16.75 18 18M6 18l1.25-1.25M16.75 7.25 18 6" /></Svg>,
    Focus: (p) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M4 8.5V6.5A2.5 2.5 0 0 1 6.5 4h2M15.5 4h2A2.5 2.5 0 0 1 20 6.5v2M20 15.5v2a2.5 2.5 0 0 1-2.5 2.5h-2M8.5 20h-2A2.5 2.5 0 0 1 4 17.5v-2" /></Svg>,
    Level: (p) => <Svg {...p}><rect x="3.5" y="8.5" width="17" height="7" rx="2" /><path d="M10.25 8.5v7M13.75 8.5v7" /><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none" /></Svg>,
    Landmark: (p) => <Svg {...p}><path d="M3.5 9.25 12 4.25l8.5 5H3.5Z" /><path d="M6 9.75v7.5M10 9.75v7.5M14 9.75v7.5M18 9.75v7.5" /><path d="M3.5 20h17" /></Svg>,
    Kit: (p) => <Svg {...p}><rect x="3.5" y="7" width="17" height="12.5" rx="2.5" /><path d="M9 7V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7" /><path d="M12 10.5v5.5M9.25 13.25h5.5" /></Svg>,
    PlaneUp: (p) => <Svg {...p}><path d="M3 20h18" /><path d="M4.6 14.9 2.9 12.6l1.5-.55 2.45 1.25 3.35-1.75-4.3-3.9 1.9-.7 6 2.45 3.05-1.6a1.75 1.75 0 0 1 1.65 3.1L7.75 16.1a2.25 2.25 0 0 1-3.15-1.2Z" /></Svg>,
    PlaneDown: (p) => <Svg {...p}><path d="M3 20h18" /><path d="m4.3 6.7 1.45-.3 2.1 1.95 3.65.95-1.6-5.55 2 .2 4.1 6.4 3.35.95a1.75 1.75 0 0 1-.9 3.4L5.2 11.3a2.25 2.25 0 0 1-.9-4.6Z" /></Svg>,
    Pill: (p) => <Svg {...p}><g transform="rotate(-45 12 12)"><rect x="3.75" y="8.5" width="16.5" height="7" rx="3.5" /><path d="M12 8.5v7" /></g></Svg>,

    // --- O'ram turlari ---
    Blister: (p) => <Svg {...p}><rect x="4.5" y="3.5" width="15" height="17" rx="3" /><circle cx="9.25" cy="8" r="1.6" /><circle cx="14.75" cy="8" r="1.6" /><circle cx="9.25" cy="12" r="1.6" /><circle cx="14.75" cy="12" r="1.6" /><circle cx="9.25" cy="16" r="1.6" /><circle cx="14.75" cy="16" r="1.6" /></Svg>,
    Vial: (p) => <Svg {...p}><path d="M9 3.5h6" /><path d="M10 3.5v3M14 3.5v3" /><rect x="7" y="6.5" width="10" height="14" rx="2.5" /><path d="M7 13.5h10" /><path d="M9.5 16.25h.01M12 17.5h.01M14.5 16.25h.01" strokeWidth="2.2" /></Svg>,
    Granules: (p) => <Svg {...p}><path d="M9.75 3.5h4.5v2.75h-4.5z" /><path d="M8 8.25a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10.25a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8.25Z" /><circle cx="10.75" cy="13.5" r="1.05" fill="currentColor" stroke="none" /><circle cx="13.25" cy="13.5" r="1.05" fill="currentColor" stroke="none" /><circle cx="12" cy="15.6" r="1.05" fill="currentColor" stroke="none" /><circle cx="10.75" cy="17.7" r="1.05" fill="currentColor" stroke="none" /><circle cx="13.25" cy="17.7" r="1.05" fill="currentColor" stroke="none" /></Svg>,
    Bottle: (p) => <Svg {...p}><rect x="9.25" y="3.25" width="5.5" height="3" rx=".8" /><path d="M8.5 6.25h7l1 3V18.5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V9.25l1-3Z" /><path d="M12 11.5c1.15 1.35 1.75 2.35 1.75 3.15a1.75 1.75 0 0 1-3.5 0c0-.8.6-1.8 1.75-3.15Z" /></Svg>,
    Syringe: (p) => <Svg {...p}><path d="m17.5 2.75 3.75 3.75M19.4 4.6l-3.1 3.1" /><path d="m14.25 5.75 4 4-9.5 9.5H4.75v-4l9.5-9.5Z" /><path d="M4.75 19.25 2.75 21.25" /><path d="m10.5 9.5 1.5 1.5M8.5 11.5l1.5 1.5" /></Svg>,
    Tube: (p) => <Svg {...p}><path d="M6.5 3.5h11L15.6 15.5H8.4L6.5 3.5Z" /><path d="M7 6h10" /><path d="M9.75 15.5h4.5v2h-4.5z" /><path d="M10.25 17.5h3.5V20a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1-.75-.75v-2.5Z" /></Svg>,
};

/* Brend belgisi: qalqon + belgi (ilova ikonkasi bilan bir xil) */
const LogoMark = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
        <defs>
            <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#24366F" />
                <stop offset="1" stopColor="#0B1224" />
            </linearGradient>
            <linearGradient id="lm-sh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#DCE3F5" />
            </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#lm-bg)" />
        <path d="M32 11.5 48.5 18v12.5c0 10.6-6.9 18.7-16.5 22.5-9.6-3.8-16.5-11.9-16.5-22.5V18L32 11.5Z" fill="url(#lm-sh)" />
        <path d="m23.75 31.5 5.75 5.75 11-11.5" fill="none" stroke="#E5484D" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
