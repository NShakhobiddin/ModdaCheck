/* =====================================================================
 *  MODDACHECK — illyustratsiyalar (intro va skaner). Ranglar CSS
 *  o'zgaruvchilaridan olinadi, shuning uchun yorug'/qorong'i rejimga mos.
 * ===================================================================== */
const ArtSearch = () => (
    <svg viewBox="0 0 260 200" className="w-full h-auto" aria-hidden="true" focusable="false">
        <circle cx="130" cy="102" r="90" className="fill-brand-soft" />
        <rect x="52" y="34" width="156" height="136" rx="20" className="fill-surface stroke-line" strokeWidth="2" />
        <rect x="66" y="50" width="128" height="24" rx="12" className="fill-surface-2" />
        <circle cx="80" cy="62" r="5" className="stroke-ink-3" strokeWidth="2.2" fill="none" />
        <path d="m84 66 4 4" className="stroke-ink-3" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="94" y="58.5" width="52" height="7" rx="3.5" className="fill-ink-3" opacity=".35" />
        {[{ y: 88, c: 'sev1' }, { y: 114, c: 'sev3' }, { y: 140, c: 'ok' }].map((r, i) => (
            <g key={i}>
                <rect x="66" y={r.y} width="22" height="18" rx="6" className={`fill-${r.c}-soft`} />
                <circle cx="77" cy={r.y + 9} r="4" className={`fill-${r.c}`} />
                <rect x="96" y={r.y + 3} width={i === 1 ? 54 : 66} height="6" rx="3" className="fill-ink" opacity=".75" />
                <rect x="96" y={r.y + 12} width={i === 2 ? 34 : 44} height="4" rx="2" className="fill-ink-3" opacity=".45" />
                <rect x="168" y={r.y + 3} width="26" height="12" rx="6" className={`fill-${r.c}-soft`} />
            </g>
        ))}
        <circle cx="198" cy="146" r="22" className="fill-surface stroke-brand" strokeWidth="6" />
        <path d="m214 162 14 14" className="stroke-brand" strokeWidth="8" strokeLinecap="round" />
        <path d="m189 146 6 6 11-12" className="stroke-brand" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArtScan = () => (
    <svg viewBox="0 0 260 200" className="w-full h-auto" aria-hidden="true" focusable="false">
        <circle cx="130" cy="102" r="90" className="fill-brand-soft" />
        <g>
            <rect x="80" y="54" width="100" height="92" rx="12" className="fill-surface stroke-line" strokeWidth="2" />
            <rect x="80" y="54" width="100" height="26" rx="12" className="fill-brand" />
            <rect x="80" y="68" width="100" height="12" className="fill-brand" />
            <rect x="92" y="62" width="40" height="6" rx="3" fill="#fff" opacity=".9" />
            <rect x="92" y="92" width="62" height="6" rx="3" className="fill-ink" opacity=".75" />
            <rect x="92" y="104" width="76" height="4" rx="2" className="fill-ink-3" opacity=".45" />
            <rect x="92" y="113" width="68" height="4" rx="2" className="fill-ink-3" opacity=".45" />
            <rect x="92" y="122" width="54" height="4" rx="2" className="fill-ink-3" opacity=".45" />
            <path d="M163 120h10M168 115v10" className="stroke-sev1" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <g className="stroke-brand" strokeWidth="5" fill="none" strokeLinecap="round">
            <path d="M60 64V52a12 12 0 0 1 12-12h12" />
            <path d="M176 40h12a12 12 0 0 1 12 12v12" />
            <path d="M200 136v12a12 12 0 0 1-12 12h-12" />
            <path d="M84 160H72a12 12 0 0 1-12-12v-12" />
        </g>
        <rect x="66" y="98" width="128" height="4" rx="2" className="fill-brand scan-sweep" opacity=".85" />
        <path d="M214 46c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9Z" className="fill-brand" />
        <path d="M44 132c.6 3.6 1.8 4.8 5.4 5.4-3.6.6-4.8 1.8-5.4 5.4-.6-3.6-1.8-4.8-5.4-5.4 3.6-.6 4.8-1.8 5.4-5.4Z" className="fill-brand" opacity=".6" />
    </svg>
);

const ArtRules = () => (
    <svg viewBox="0 0 260 200" className="w-full h-auto" aria-hidden="true" focusable="false">
        <circle cx="130" cy="102" r="90" className="fill-brand-soft" />
        <rect x="58" y="40" width="108" height="130" rx="14" className="fill-surface stroke-line" strokeWidth="2" />
        <rect x="72" y="56" width="56" height="7" rx="3.5" className="fill-ink" opacity=".75" />
        <rect x="72" y="70" width="78" height="4" rx="2" className="fill-ink-3" opacity=".45" />
        <g>
            <rect x="72" y="86" width="36" height="34" rx="9" className="fill-surface-2" />
            <text x="90" y="110" textAnchor="middle" className="fill-ink" style={{ font: '800 18px Inter, system-ui, sans-serif' }}>10</text>
            <rect x="114" y="86" width="36" height="34" rx="9" className="fill-surface-2" />
            <text x="132" y="110" textAnchor="middle" className="fill-ink" style={{ font: '800 18px Inter, system-ui, sans-serif' }}>5</text>
        </g>
        <rect x="72" y="132" width="78" height="4" rx="2" className="fill-ink-3" opacity=".45" />
        <rect x="72" y="142" width="60" height="4" rx="2" className="fill-ink-3" opacity=".45" />
        <path d="M184 64 216 77v24c0 21-13.5 37-32 44.5-18.5-7.5-32-23.5-32-44.5V77l32-13Z" className="fill-brand" />
        <path d="M184 64 216 77v24c0 21-13.5 37-32 44.5Z" fill="#000" opacity=".12" />
        <path d="m169 103 10.5 10.5 20-21" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* Skaner ekranidagi "kamera ko'rinishi" (qorong'i fon — ikkala rejimda bir xil) */
const ViewfinderArt = () => (
    <svg viewBox="0 0 320 240" className="w-full h-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
        <defs>
            <radialGradient id="vf-glow" cx="50%" cy="45%" r="60%">
                <stop offset="0" stopColor="#3355FF" stopOpacity=".35" />
                <stop offset="1" stopColor="#3355FF" stopOpacity="0" />
            </radialGradient>
        </defs>
        <rect width="320" height="240" fill="url(#vf-glow)" />
        <g transform="translate(108 62)">
            <rect width="104" height="116" rx="12" fill="#1C2540" stroke="#33406A" strokeWidth="2" />
            <rect width="104" height="30" rx="12" fill="#3355FF" />
            <rect y="16" width="104" height="14" fill="#3355FF" />
            <rect x="12" y="10" width="44" height="7" rx="3.5" fill="#fff" opacity=".9" />
            <rect x="12" y="44" width="58" height="6" rx="3" fill="#E6EBF7" opacity=".85" />
            <rect x="12" y="58" width="80" height="4" rx="2" fill="#8F9BBA" opacity=".6" />
            <rect x="12" y="68" width="70" height="4" rx="2" fill="#8F9BBA" opacity=".6" />
            <rect x="12" y="78" width="76" height="4" rx="2" fill="#8F9BBA" opacity=".6" />
            <rect x="12" y="88" width="50" height="4" rx="2" fill="#8F9BBA" opacity=".6" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".95">
            <path d="M84 70V58a12 12 0 0 1 12-12h14" />
            <path d="M210 46h14a12 12 0 0 1 12 12v12" />
            <path d="M236 170v12a12 12 0 0 1-12 12h-14" />
            <path d="M110 194H96a12 12 0 0 1-12-12v-12" />
        </g>
        <rect x="92" y="118" width="136" height="3" rx="1.5" fill="#7C95FF" className="scan-sweep" />
    </svg>
);
