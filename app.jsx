
        const { useState, useEffect, useRef } = React;
        
        // --- BACKEND PROXY (Cloudflare Worker) ---
        // Anthropic API kaliti bu faylda EMAS — u Worker ichida maxfiy saqlanadi.
        // Worker'ni deploy qilgandan so'ng, uning manzilini shu yerga yozing:
        const PROXY_URL = "https://taqiqcheck-proxy.g775fr6ndy.workers.dev";

        // --- ICONS ---
        const SearchIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
        const CameraIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
        const ShieldAlert = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
        const InfoIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
        const PillIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>;
        const BookIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
        const FileTextIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
        const ListIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
        const CheckIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
        const XCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
        const SparklesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 5h4"/><path d="M18.8 1.2 17.6 4.8"/><path d="M21.2 6H16.8"/></svg>;
        const ArrowLeft = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
        const PlaneIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12h20"/><path d="m19 12-4-7"/><path d="M11 5 6 12"/><path d="m22 12-4 7"/><path d="M13 19 6 12"/></svg>;
        const SixteenPointIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2L14.4 4.2L17.6 3.6L18.3 6.8L21.4 7.9L20.5 11L22.6 13.6L20.1 15.9L20.7 19.1L17.5 19.7L15.6 22.4L12.5 20.9L9.4 22.4L7.5 19.7L4.3 19.1L4.9 15.9L2.4 13.6L4.5 11L3.6 7.9L6.7 6.8L7.4 3.6L10.6 4.2L12 2Z" /></svg>;
        const MessageCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>;
        const SendIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
        const SettingsIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
        const KeyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21 2-2 2m-7.6 7.6a6 6 0 1 1-8.48-8.48L5 2m9 9L21 21s0 2 2 2 2 0 2-2l-2-2m-2-2l-2-2"/></svg>;

        // Specific VM-191 Icons
        const VialIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v8"/><path d="m12 2 4 4"/><path d="m12 2-4 4"/><path d="m10 10-5 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8l-5-2"/><path d="M10 14h4"/></svg>;
        const TabletIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="7" cy="7" r="5"/><circle cx="17" cy="17" r="5"/><path d="M12 17h10"/><path d="m3.46 10.54 7.08-7.08"/></svg>;
        const DropIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 2-5.5 8.5a5.5 5.5 0 0 0 11 0L12 2Z"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" opacity="0.2"/></svg>;
        const SyringeIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>;

        // Dynamic Icons based on type
        const StopIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>;
        const WarningIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
        const DangerIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.228-5.385-2.632-6.879A1 1 0 0 0 6.4 1.254L6 1.117a1 1 0 0 0-1.246.853c-.344 1.706-1.336 6.946-1.638 8.441-.353 1.748-.616 4.589 4.384 4.09Z"/><path d="m12.729 17.522 1.34-4.02a4.953 4.953 0 0 1-1.096-2.486l-1.91 1.91"/><path d="m18.5 12.5 2.5.5a1 1 0 0 1 .8 1l-2 1a1 1 0 0 1-1-1Z"/><path d="M15 11l-3 3"/><path d="M22 22v-3h-3l-2.05-2.05a2 2 0 0 0-2.83 0 2 2 0 0 0 0 2.83l2.256 2.256a1 1 0 0 0 .911.272L22 22Z"/></svg>;

        // PACK TYPES FOR CALCULATOR
        const PACK_TYPES = [
            { id: 'tablet', label: 'Tabletkalar', sub: 'kapsula, draje, kukun', limit: 100, unit: 'dona', icon: <TabletIcon /> },
            { id: 'vial', label: 'Eritma uchun kukun', sub: 'flakonlarda', limit: 500, unit: 'gramm', icon: <VialIcon /> },
            { id: 'homeo', label: 'Gomeopatiya', sub: 'granulalar', limit: 50, unit: 'gramm', icon: <PillIcon /> },
            { id: 'liquid', label: 'Eritmalar', sub: 'infuzion, oral', limit: 500, unit: 'ml', icon: <DropIcon /> },
            { id: 'injection', label: 'Inyeksiyalar', sub: 'ampula, flakon', limit: 10, unit: 'dona', icon: <SyringeIcon /> },
            { id: 'external', label: 'Tashqi dorilar', sub: 'maz, gel, krem', limit: 200, unit: 'ml/gr', icon: <FileTextIcon /> }
        ];

        // --- OGOHLANTIRISH TURLARI ---
        const WARNING_TYPES = {
            "O‘zbekiston Respublikasida muomalada bo‘lishi taqiqlangan giyohvandlik vositasi": {
                shortLabel: "TAQIQLANGAN GIYOHVANDLIK (I RO'YXAT)",
                colorClass: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200",
                bgClass: "bg-red-50 text-red-900 border-red-200",
                iconType: "stop",
                law: "VMQ-330, 4-ilova",
                lawUrl: "https://lex.uz/docs/2815342#2817182",
                desc: "Oʻzbekiston Respublikasida muomalada boʻlishi taqiqlangan giyohvandlik vositalarining roʻyxati"
            },
            "O‘zbekiston Respublikasida muomalada bo‘lishi cheklangan giyohvandlik vositasi": {
                shortLabel: "CHEKLANGAN GIYOHVANDLIK (II RO'YXAT)",
                colorClass: "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-orange-200",
                bgClass: "bg-orange-50 text-orange-900 border-orange-200",
                iconType: "warning",
                law: "VMQ-330, 5-ilova",
                lawUrl: "https://lex.uz/docs/2815342#2817182",
                desc: "Oʻzbekiston Respublikasida muomalada boʻlishi cheklangan giyohvandlik vositalarining roʻyxati"
            },
            "O‘zbekiston Respublikasida muomalada bo‘lishi cheklangan psixotrop modda": {
                shortLabel: "CHEKLANGAN PSIXOTROP (III RO'YXAT)",
                colorClass: "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-200",
                bgClass: "bg-amber-50 text-amber-900 border-amber-200",
                iconType: "warning",
                law: "VMQ-330, 6-ilova",
                lawUrl: "https://lex.uz/docs/2815342#2817182",
                desc: "Oʻzbekiston Respublikasida muomalada boʻlishi cheklangan psixotrop moddalarning roʻyxati"
            },
            "O‘zbekiston Respublikasida muomalada bo‘lishi cheklangan prekursor": {
                shortLabel: "PREKURSOR (IV RO'YXAT)",
                colorClass: "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-cyan-200",
                bgClass: "bg-cyan-50 text-cyan-900 border-cyan-200",
                iconType: "info",
                law: "VMQ-330, 7-ilova",
                lawUrl: "https://lex.uz/docs/2815342#2817182",
                desc: "Oʻzbekiston Respublikasida muomalada boʻlishi cheklangan prekursorlarning roʻyxati"
            },
            "Kuchli ta'sir qiluvchi modda": {
                shortLabel: "KUCHLI TA'SIR QILUVCHI MODDA",
                colorClass: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200",
                bgClass: "bg-purple-50 text-purple-900 border-purple-200",
                iconType: "danger",
                law: "VMQ-818, 1-ilova",
                lawUrl: "https://lex.uz/docs/-4532164",
                desc: "Oʻzbekiston Respublikasida muomalada boʻlishi cheklangan kuchli taʼsir qiluvchi moddalar roʻyxati"
            }
        };

        // --- MA'LUMOTLAR BAZASI (TASHQI FAYLDAN OLINADI) ---
        // Agar database.js yuklanmasa, bo'sh massiv bo'lib qoladi va xatolik bermaydi.
        const DATABASE = window.TAQIQ_DATABASE || [];

        // --- HELPERS: FUZZY SEARCH ---
        const levenshtein = (a, b) => {
            if (a.length === 0) return b.length;
            if (b.length === 0) return a.length;
            const matrix = [];
            for (let i = 0; i <= b.length; i++) matrix[i] = [i];
            for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        };

        const App = () => {
            // Ilova ishga tushganda Telegram Web App'ni to'liq ekranga moslashtirish
            useEffect(() => {
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.ready();
                    window.Telegram.WebApp.expand();
                    
                    // Telegram Header panelini bg-slate-900 ga bo'yab berish orqali tepadan ko'rinishni chiroyli qilamiz
                    try {
                        window.Telegram.WebApp.setHeaderColor('#0f172a');
                        window.Telegram.WebApp.setBackgroundColor('#f8fafc');
                    } catch (e) {
                        console.log("Telegram header color set failed", e);
                    }
                }
            }, []);

            // AI backend proxy (Cloudflare Worker) orqali ishlaydi.
            // Foydalanuvchi hech qanday kalit kiritmaydi. PROXY_URL to'ldirilgan bo'lsa AI tayyor.
            const aiReady = PROXY_URL && !PROXY_URL.includes('YOUR-SUBDOMAIN');
            const [showSettings, setShowSettings] = useState(false);

            const [mode, setMode] = useState('search'); 
            const [query, setQuery] = useState('');
            const [results, setResults] = useState([]);
            const [selectedItem, setSelectedItem] = useState(null);
            const [selectedCategory, setSelectedCategory] = useState(null);
            const [showLegislation, setShowLegislation] = useState(false);
            const [legTab, setLegTab] = useState('main'); 
            const [calcType, setCalcType] = useState(PACK_TYPES[0]);
            const [calcValue, setCalcValue] = useState('');
            const [selectedImage, setSelectedImage] = useState(null);
            const [isScanning, setIsScanning] = useState(false);
            const [scanStatus, setScanStatus] = useState(''); 
            const [ocrText, setOcrText] = useState(''); 
            const [foundItemsList, setFoundItemsList] = useState([]); 
            const fileInputRef = useRef(null);
            const [messages, setMessages] = useState([
                {role: 'assistant', text: "Assalomu alaykum! Men bojxona bo'yicha sun'iy intellekt yordamchisiman. Dori vositalarini olib kirish qoidalari bo'yicha savolingiz bormi?"}
            ]);
            const [chatInput, setChatInput] = useState('');
            const [isLoadingChat, setIsLoadingChat] = useState(false);
            const chatEndRef = useRef(null);

            useEffect(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, [messages]);

            useEffect(() => {
                if (query.trim().length === 0) {
                    setResults([]);
                    return;
                }
                const lowerQuery = query.toLowerCase();
                const filtered = DATABASE.filter(item => {
                    const nameMatch = item.name.toLowerCase().includes(lowerQuery);
                    const aliasMatch = item.aliases.some(alias => alias.toLowerCase().includes(lowerQuery));
                    const medMatch = item.medicines && item.medicines.some(med => med.toLowerCase().includes(lowerQuery));
                    return nameMatch || aliasMatch || medMatch;
                });
                setResults(filtered);
            }, [query]);

            const getWarningConfig = (category) => {
                const config = WARNING_TYPES[category];
                return config || {
                    shortLabel: "NOMA'LUM STATUS",
                    colorClass: "bg-gray-500 text-white",
                    bgClass: "bg-gray-100 text-gray-800 border-gray-200",
                    iconType: "info",
                    law: "Noma'lum"
                };
            };

            const getIcon = (type) => {
                switch(type) {
                    case 'stop': return <StopIcon />;
                    case 'warning': return <WarningIcon />;
                    case 'danger': return <DangerIcon />;
                    default: return <InfoIcon />;
                }
            };

            const clearSearch = () => {
                setQuery('');
                setResults([]);
                setSelectedItem(null);
                setSelectedCategory(null);
            };

            const handleModeChange = (newMode) => {
                if ((newMode === 'chat' || newMode === 'scan') && !aiReady) {
                    setShowSettings(true);
                    return;
                }
                setMode(newMode);
                setSelectedItem(null);
                setSelectedImage(null);
                setSelectedCategory(null);
                setQuery('');
                setShowLegislation(false);
                setLegTab('main'); 
                setScanStatus('');
                setOcrText('');
                setFoundItemsList([]);
            };

            //  CHAT LOGIC (FIXED)
            const handleSendMessage = async () => {
                if (!aiReady) {
                    setShowSettings(true);
                    return;
                }
                if (!chatInput.trim()) return;

                const userMsg = chatInput;
                setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
                setChatInput('');
                setIsLoadingChat(true);

                // Context generation
                const lowerMsg = userMsg.toLowerCase();
                let foundDrugContext = "";
                const mentions = DATABASE.filter(d => 
                    lowerMsg.includes(d.name.toLowerCase()) || 
                    d.aliases.some(a => lowerMsg.includes(a.toLowerCase())) ||
                    (d.medicines && d.medicines.some(m => lowerMsg.includes(m.toLowerCase())))
                );

                if (mentions.length > 0) {
                    foundDrugContext = "\nFoydalanuvchi so'ragan moddalar bo'yicha bazadan ma'lumot:\n";
                    mentions.forEach(d => {
                        foundDrugContext += `- ${d.name} (${d.category}): ${d.description}. Qonun: ${WARNING_TYPES[d.category]?.law}\n`;
                    });
                }

                const systemPrompt = `
                    Siz O'zbekiston bojxona qonunchiligi bo'yicha "TAQIQCHECK" ilovasining sun'iy intellekt maslahatchisisiz.
                    
                    Asosiy qoidalar (VMQ-191 va VMQ-330):
                    1. Jismoniy shaxslar shaxsiy ehtiyoj uchun ruxsatnomasiz: 10 xil nomdagi va har biridan 5 o'ramgacha dori olib o'tishi mumkin. Tibbiy buyumlar - 5 donagacha.
                    2. I ro'yxat (Taqiqlangan): Olib o'tish qat'iyan man etiladi.
                    3. II ro'yxat (Cheklangan): Ruxsatnoma va retsept shart.
                    4. III ro'yxat (Psixotrop): Retsept shart, deklaratsiya to'ldiriladi.
                    5. Kuchli ta'sir qiluvchi (Lirika, Tramadol va b.): Jinoiy javobgarlik.
                    
                    ${foundDrugContext}

                    Javobingiz qisqa, aniq va do'stona bo'lsin.
                `;

                try {
                    const response = await fetch(PROXY_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: 'claude-sonnet-4-6',
                            max_tokens: 1024,
                            system: systemPrompt,
                            messages: [{ role: 'user', content: userMsg }]
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
                    }

                    const data = await response.json();
                    const reply = data.content?.[0]?.text || "Uzr, javobni ololmadim.";
                    
                    setMessages(prev => [...prev, {role: 'assistant', text: reply}]);

                } catch (error) {
                    console.error("Chat API Error:", error);
                    let userErrorMessage = "Xatolik: " + (error.message || "noma'lum");
                    if (error.message && error.message.includes('Failed to fetch')) {
                        userErrorMessage = "Worker'ga ulanib bo'lmadi (CORS yoki manzil). Cloudflare'da ALLOWED_ORIGIN to'g'riligini yoki PROXY_URL ni tekshiring.";
                    } else if (error.message && error.message.includes('ANTHROPIC_API_KEY')) {
                        userErrorMessage = "Worker'da kalit (ANTHROPIC_API_KEY) sozlanmagan. Cloudflare → Settings → Variables and Secrets ga qo'shing va Deploy bosing.";
                    }
                    setMessages(prev => [...prev, {role: 'assistant', text: userErrorMessage}]);
                } finally {
                    setIsLoadingChat(false);
                }
            };

            //  IMAGE ANALYSIS (FIXED)
            const handleImageUpload = async (e) => {
                if (!aiReady) {
                    setShowSettings(true);
                    return;
                }
                const file = e.target.files[0];
                if (!file) return;

                const imageUrl = URL.createObjectURL(file);
                setSelectedImage(imageUrl);
                setIsScanning(true);
                setScanStatus("Sun'iy intellekt tahlil qilmoqda...");
                setSelectedItem(null);
                setOcrText('');
                setFoundItemsList([]);

                try {
                    // Rasmni base64 ga aylantirish
                    const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                    const base64String = dataUrl.split(',')[1];
                    
                    // MIME type ni aniqlaymiz (bo'sh bo'lsa jpg deb olamiz)
                    const mimeType = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';

                    setScanStatus("Claude AI tahlil qilmoqda...");

                    const response = await fetch(PROXY_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: 'claude-sonnet-4-6',
                            max_tokens: 1024,
                            messages: [{
                                role: 'user',
                                content: [
                                    {
                                        type: 'image',
                                        source: { type: 'base64', media_type: mimeType, data: base64String }
                                    },
                                    {
                                        type: 'text',
                                        text: "Ushbu rasmdagi barcha dori vositalari yoki kimyoviy moddalar nomlarini aniqlang. Faqatgina aniqlangan nomlarni JSON formatidagi ro'yxat (array of strings) sifatida qaytaring. Masalan: [\"Tramadol\", \"Kyupene\"]. Hech qanday markdown formatsiz, faqat toza JSON matnini qaytar. Agar dori nomi topilmasa, bo'sh massiv qaytaring: []"
                                    }
                                ]
                            }]
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error?.message || `API xatosi: ${response.status}`);
                    }

                    const data = await response.json();
                    const textResponse = data.content?.[0]?.text || '[]';
                    
                    let foundNames = [];
                    try {
                        // Markdown fences ni tozalaymiz
                        const cleaned = textResponse.replace(/```json|```/g, '').trim();
                        foundNames = JSON.parse(cleaned);
                    } catch (parseError) {
                        console.error("JSON parse xato:", parseError, textResponse);
                        foundNames = [];
                    }

                    if (!Array.isArray(foundNames)) foundNames = [];

                    setOcrText(foundNames.join(", ")); 

                    let foundItems = [];
                    const addedIds = new Set();

                    for (const detectedName of foundNames) {
                        const lowerToken = detectedName.toLowerCase();
                        
                        for (const item of DATABASE) {
                            if (addedIds.has(item.id)) continue;
                            let match = false;
                            const namesToCheck = [item.name, ...item.aliases, ...(item.medicines || [])];
                            for (const dbName of namesToCheck) {
                                const lowerDbName = dbName.toLowerCase();
                                if (lowerToken.includes(lowerDbName) || lowerDbName.includes(lowerToken)) {
                                    match = true;
                                    break;
                                }
                                const dist = levenshtein(lowerToken, lowerDbName);
                                if (dist <= 2 && lowerDbName.length > 4) { // Fuzzy threshold
                                    match = true;
                                    break;
                                }
                            }
                            if (match) {
                                foundItems.push(item);
                                addedIds.add(item.id);
                            }
                        }
                    }

                    setIsScanning(false);

                    if (foundItems.length > 0) {
                        setFoundItemsList(foundItems);
                        if (foundItems.length === 1) setSelectedItem(foundItems[0]);
                        setScanStatus(`AI tahlili: ${foundItems.length} ta xavfli modda topildi.`);
                    } else {
                        setScanStatus("Xavfli moddalar aniqlanmadi.");
                    }

                } catch (err) {
                    console.error("Scan API Error:", err);
                    setIsScanning(false);
                    let errorMsg = "Tahlil xatoligi: " + (err.message || "noma'lum");
                    if (err.message && err.message.includes('Failed to fetch')) {
                        errorMsg = "Worker'ga ulanib bo'lmadi (CORS yoki manzil). Cloudflare ALLOWED_ORIGIN/PROXY_URL ni tekshiring.";
                    } else if (err.message && err.message.includes('ANTHROPIC_API_KEY')) {
                        errorMsg = "Worker'da kalit (ANTHROPIC_API_KEY) sozlanmagan.";
                    }
                    setScanStatus(errorMsg);
                }
            };

            const SettingsModal = () => (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 fade-in">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                        <button 
                            onClick={() => setShowSettings(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                        
                        <div className="mb-4 flex items-center gap-3">
                            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                <SettingsIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Sozlamalar</h3>
                        </div>

                        <div className="space-y-4">
                            {aiReady ? (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="text-sm font-bold text-green-700 mb-1">✅ AI tayyor</p>
                                    <p className="text-xs text-green-600 leading-relaxed">
                                        Sun'iy intellekt Claude AI orqali ishlaydi. Hech qanday API kalit kiritish shart emas.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm font-bold text-amber-700 mb-1">⚠️ AI hali ulanmagan</p>
                                    <p className="text-xs text-amber-600 leading-relaxed">
                                        Dasturchi <code className="font-mono">index.html</code> faylidagi <code className="font-mono">PROXY_URL</code> manzilini Cloudflare Worker manziliga to'ldirishi kerak. Qidiruv funksiyasi shusiz ham ishlaydi.
                                    </p>
                                </div>
                            )}
                            
                            <button 
                                onClick={() => setShowSettings(false)}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                            >
                                Yopish
                            </button>
                        </div>
                    </div>
                </div>
            );

            return (
                <div className="w-full max-w-md bg-white min-h-[100dvh] shadow-2xl flex flex-col relative">
                    
                    {showSettings && <SettingsModal />}

                    {/* Header - maxsus safe-area padding qo'shildi */}
                    <div 
                        className="bg-slate-900 text-white px-6 pb-6 sticky top-0 z-50 shadow-lg border-b border-slate-700/50"
                        style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="relative group cursor-pointer">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative p-3 bg-slate-950 ring-1 ring-white/10 rounded-xl leading-none flex items-center justify-center shadow-2xl">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" className="fill-slate-900 stroke-slate-500" strokeWidth="2"/>
                                            <path d="M9 12L11 14L15 10" className="stroke-red-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-black tracking-tight text-white leading-none mb-1">
                                        MODDA<span className="text-red-500">CHECK</span>
                                    </h1>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-80">Taqiqlangan moddalarni aniqlash</p>
                                </div>
                            </div>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex bg-slate-800/80 backdrop-blur-sm p-1.5 rounded-xl mb-4 border border-slate-700/50">
                            <button 
                                onClick={() => handleModeChange('search')}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'search' && !showLegislation ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                            >
                                <SearchIcon className="w-4 h-4" /> Matn
                            </button>
                            <button 
                                onClick={() => handleModeChange('scan')}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'scan' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                            >
                                <CameraIcon className="w-4 h-4" /> 
                                <span>Rasm</span>
                                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider flex items-center gap-1">
                                    AI <SparklesIcon className="w-2 h-2" />
                                </span>
                            </button>
                            <button 
                                onClick={() => handleModeChange('chat')}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'chat' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                            >
                                <MessageCircleIcon className="w-4 h-4" /> AI Chat
                            </button>
                        </div>

                        {/* Search Input */}
                        {mode === 'search' && !showLegislation && (
                            <div className="relative fade-in group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-focus-within:opacity-50 transition duration-500"></div>
                                <input 
                                    type="text" 
                                    className="relative w-full pl-11 pr-10 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-slate-600 transition-all text-sm font-medium shadow-inner"
                                    placeholder="Modda nomini kiriting..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedItem(null);
                                        setSelectedCategory(null);
                                    }}
                                />
                                <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                    <SearchIcon />
                                </div>
                                {query && (
                                    <button 
                                        onClick={clearSearch}
                                        className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-full p-0.5"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className={`flex-1 p-5 overflow-y-auto overflow-x-hidden bg-slate-50 ${mode === 'chat' ? 'pb-6' : 'pb-24'}`}>
                        
                        {/* --- LEGISLATION MODE --- */}
                        {showLegislation ? (
                            <div className="fade-in pb-10">
                                {/* Navigation */}
                                <div className="flex items-center justify-between mb-6">
                                    <button 
                                        onClick={() => setShowLegislation(false)}
                                        className="text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Orqaga
                                    </button>
                                    <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">VMQ-191 (08.06.2016)</span>
                                </div>
                                
                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
                                    {/* Modal Header */}
                                    <div className="bg-slate-900 p-6 text-white relative overflow-hidden shrink-0">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-150 transform translate-x-4 -translate-y-4">
                                            <BookIcon width="120" height="120" />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-xl font-bold leading-tight mb-2 tracking-tight">
                                                Jismoniy shaxslar uchun me'yorlar
                                            </h2>
                                            <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-[90%]">
                                                Dori vositalarini olib o'tish tartibi.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Modern Tabs */}
                                    <div className="px-6 mt-6 shrink-0">
                                        <div className="flex p-1 bg-slate-100 rounded-xl relative overflow-x-auto">
                                            <button 
                                                onClick={() => setLegTab('main')}
                                                className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all duration-300 z-10 whitespace-nowrap ${legTab === 'main' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Dori
                                            </button>
                                            <button 
                                                onClick={() => setLegTab('calc')}
                                                className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all duration-300 z-10 flex items-center justify-center gap-1.5 whitespace-nowrap ${legTab === 'calc' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                O'ram ✨
                                            </button>
                                            <button 
                                                onClick={() => setLegTab('cases')}
                                                className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all duration-300 z-10 whitespace-nowrap ${legTab === 'cases' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Istisnolar
                                            </button>
                                            <button 
                                                onClick={() => setLegTab('drugs')}
                                                className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all duration-300 z-10 whitespace-nowrap ${legTab === 'drugs' ? 'bg-red-600 text-white shadow-md shadow-red-200' : 'text-red-500 hover:bg-red-50'}`}
                                            >
                                                Giyohvandlik
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 overflow-y-auto flex-1">
                                        
                                        {/* TAB 1: MAIN RULES */}
                                        {legTab === 'main' && (
                                            <div className="fade-in space-y-6">
                                                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
                                                    <div className="flex items-start gap-4 relative z-10">
                                                        <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-sm ring-1 ring-blue-100">
                                                            <InfoIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Ruxsatnomasiz</h3>
                                                            <p className="text-slate-600 text-xs leading-relaxed font-medium">
                                                                Tibbiyot muassasasi hujjati taqdim etilmasdan quyidagi miqdorda ruxsat etiladi:
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
                                                        <span className="text-4xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">10</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Xil nomdagi Dori</span>
                                                    </div>
                                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
                                                        <span className="text-4xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">5</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">O'ramgacha</span>
                                                        <span className="text-[9px] text-slate-300 font-medium">(har biridan)</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                                     <span className="text-xs font-bold text-slate-700 uppercase tracking-wide pl-2">Tibbiy buyumlar:</span>
                                                     <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold">5 birlikgacha</span>
                                                </div>

                                                <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 relative overflow-hidden">
                                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50"></div>
                                                    <div className="flex items-start gap-4 relative z-10">
                                                        <div className="bg-white/80 p-2 rounded-xl text-amber-600 shadow-sm">
                                                            <FileTextIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-amber-900 text-sm mb-1.5">Me'yordan ortiq olib o'tishda</h3>
                                                            <p className="text-amber-800/90 text-xs leading-relaxed font-medium">
                                                                Ortiq miqdorda olib o‘tishda tibbiyot muassasasidan dori vositasining, nomini, miqdorini va shaklini ko‘rsatgan holda muayyan jismoniy shaxsga berilgan hujjatni taqdim etadilar
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB 2: CALCULATOR */}
                                        {legTab === 'calc' && (
                                            <div className="fade-in space-y-6">
                                                <div className="text-center mb-2">
                                                     <h3 className="text-sm font-bold text-slate-900">"Bir o'ram" miqdorini hisoblash</h3>
                                                     <p className="text-xs text-slate-400 mt-1">Dori turini tanlang va miqdorini kiriting</p>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    {PACK_TYPES.map(type => (
                                                        <button
                                                            key={type.id}
                                                            onClick={() => { setCalcType(type); setCalcValue(''); }}
                                                            className={`p-4 rounded-2xl border text-left transition-all duration-200 group ${calcType.id === type.id ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'}`}
                                                        >
                                                            <div className={`mb-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${calcType.id === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'}`}>
                                                                {React.cloneElement(type.icon, { width: 16, height: 16 })}
                                                            </div>
                                                            <div className="font-bold text-xs text-slate-800 mb-0.5">{type.label}</div>
                                                            <div className="text-[10px] text-slate-400 font-medium">{type.sub}</div>
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="bg-white p-1 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50">
                                                    <div className="bg-slate-50 p-5 rounded-[20px] border border-slate-100">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Miqdorni kiriting</label>
                                                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                                                                <span className="text-[10px] font-bold text-slate-600">LIMIT:</span>
                                                                <span className="text-[10px] font-black text-red-500">{calcType.limit}</span>
                                                                <span className="text-[8px] font-bold text-white bg-slate-400 px-1 py-0.5 rounded uppercase">{calcType.unit}</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <input 
                                                                type="number" 
                                                                value={calcValue}
                                                                onChange={(e) => setCalcValue(e.target.value)}
                                                                className="w-full text-4xl font-black p-4 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center text-slate-900 placeholder-slate-200"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        
                                                        {calcValue && (
                                                            <div className={`mt-4 p-4 rounded-xl border flex items-center gap-4 animate-pulse-once shadow-sm transition-colors ${Number(calcValue) <= calcType.limit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                                                <div className={`p-3 rounded-full shrink-0 ${Number(calcValue) <= calcType.limit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                    {Number(calcValue) <= calcType.limit ? <CheckIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />}
                                                                </div>
                                                                <div>
                                                                    <div className={`font-bold text-sm mb-0.5 ${Number(calcValue) <= calcType.limit ? 'text-green-800' : 'text-red-800'}`}>
                                                                        {Number(calcValue) <= calcType.limit ? 'Ruxsat etiladi' : 'Limitdan oshdi!'}
                                                                    </div>
                                                                    <div className={`text-xs font-medium ${Number(calcValue) <= calcType.limit ? 'text-green-700/80' : 'text-red-700/80'}`}>
                                                                        {Number(calcValue) <= calcType.limit ? "Bu miqdor 1 o'ram deb hisoblanadi." : "Bu miqdor 1 o'ram hisoblanmaydi."}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB 3: CASES */}
                                        {legTab === 'cases' && (
                                            <div className="fade-in">
                                                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10 mb-4">
                                                    <h3 className="font-bold text-base mb-3 leading-snug">
                                                        Davlat ro'yxatidan va bojxona rasmiylashtiruvidan o'tkazmasdan dori vositalarini olib o'tish mumkin:
                                                    </h3>
                                                    <div className="h-1 w-12 bg-blue-500 rounded-full mb-4"></div>
                                                    <ul className="space-y-3">
                                                        {[
                                                            "Mamlakatda bo'lish davrida shaxsiy foydalanish uchun.",
                                                            "Tasdiqlangan tibbiy ko'rsatma asosida davolash kursi uchun.",
                                                            "Diplomatik xodimlar va ularning oila a'zolari uchun.",
                                                            "Transport yo'lovchilariga birinchi yordam ko'rsatish uchun (aptechka).",
                                                            "Xalqaro tadbirlar va ekspeditsiyalar ishtirokchilarini davolash uchun."
                                                        ].map((item, idx) => (
                                                            <li key={idx} className="text-sm text-slate-300 flex gap-4 items-start">
                                                                <span className="flex-shrink-0 w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">{idx + 1}</span>
                                                                <span className="leading-relaxed">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB 4: GIYOHVANDLIK VA PSIXOTROP */}
                                        {legTab === 'drugs' && (
                                            <div className="fade-in space-y-4">
                                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                                            <WarningIcon className="w-5 h-5" />
                                                        </div>
                                                        <h3 className="font-bold text-amber-900 text-sm">Psixotrop moddalar</h3>
                                                    </div>
                                                    <p className="text-amber-800/80 text-xs mb-4 font-medium">(Tibbiyot muassasasi hujjatisiz)</p>
                                                    <div className="flex gap-2">
                                                        <div className="bg-white px-3 py-2 rounded-xl border border-amber-100 shadow-sm flex-1 text-center">
                                                            <span className="block text-xl font-black text-amber-600">5</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">dori</span>
                                                        </div>
                                                        <div className="bg-white px-3 py-2 rounded-xl border border-amber-100 shadow-sm flex-1 text-center">
                                                            <span className="block text-xl font-black text-amber-600">2</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">o'ramgacha</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                                                    <div className="flex items-center gap-3 mb-4 relative z-10">
                                                        <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                                            <DangerIcon className="w-5 h-5" />
                                                        </div>
                                                        <h3 className="font-bold text-red-900 text-sm">Giyohvandlik vositalari</h3>
                                                    </div>
                                                    
                                                    <div className="bg-white px-4 py-3 rounded-xl border border-red-100 shadow-sm text-center mb-5 relative z-10">
                                                        <span className="block text-2xl font-black text-red-600 mb-1">7 sutkalik</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">ehtiyojdan ortiq boʻlmagan miqdorda</span>
                                                    </div>

                                                    <div className="space-y-3 relative z-10">
                                                        <div className="flex items-center gap-2 mb-2 opacity-80">
                                                            <div className="h-px bg-red-300 flex-1"></div>
                                                            <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Hujjat talablari</span>
                                                            <div className="h-px bg-red-300 flex-1"></div>
                                                        </div>

                                                        <div className="bg-white/80 backdrop-blur-sm border border-red-100/50 rounded-xl p-3 shadow-sm hover:border-red-200 transition-colors">
                                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                                <PlaneIcon className="w-3.5 h-3.5 rotate-45 text-red-500" /> Olib chiqishda
                                                            </h4>
                                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                                Tibbiyot muassasasining davolash-maslahat komissiyasining muhri bilan tasdiqlangan xulosa.
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="bg-white/80 backdrop-blur-sm border border-red-100/50 rounded-xl p-3 shadow-sm hover:border-red-200 transition-colors">
                                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                                <PlaneIcon className="w-3.5 h-3.5 rotate-[135deg] text-red-500" /> Olib kirishda
                                                            </h4>
                                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                                Yashash yoki boʻlish mamlakatining tibbiyot muassasasi tomonidan berilgan, davolash kursining tavsiya etiladigan soni koʻrsatilgan hujjatlar.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-red-500 text-white rounded-2xl p-5 shadow-lg shadow-red-200 relative overflow-hidden">
                                                    <div className="relative z-10 flex gap-3">
                                                        <ShieldAlert className="w-6 h-6 shrink-0 text-red-200" />
                                                        <div>
                                                            <h4 className="font-black text-xs uppercase tracking-wide mb-1">Ogohlantirish!</h4>
                                                            <p className="text-xs font-medium opacity-90 leading-relaxed">
                                                                Deklaratsiyada ko'rsatilmagan va tibbiyot muassasi tasdiqlangan hujjati (retsept) mavjud bo'lmagan holda olib o'tish jinoiy javobgarlikka sabab bo'ladi
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    
                                    <div className="bg-slate-50 p-4 border-t border-slate-100 text-center shrink-0">
                                        <p className="text-[10px] font-medium text-slate-400">
                                            Manba: <a href="https://lex.uz/docs/-2978664" target="_blank" className="text-blue-500 hover:text-blue-600 transition-colors underline decoration-blue-200 underline-offset-2">VMQ-191 (08.06.2016)</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* --- SEARCH MODE CONTENT --- */}
                        {mode === 'search' && !showLegislation && (
                            <>
                                {!selectedItem && !selectedCategory && !query && (
                                    <div className="mb-8 fade-in">
                                        <div 
                                            onClick={() => setShowLegislation(true)}
                                            className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center gap-5 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 group relative overflow-hidden"
                                        >
                                            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-70"></div>
                                            
                                            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-inner group-hover:scale-110 transition duration-300 relative z-10">
                                                <BookIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 relative z-10">
                                                <h3 className="font-bold text-slate-900 text-base mb-1">Dori vositalarini olib o'tish tartibi</h3>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">Jismoniy shaxslar uchun me'yorlar (VMQ-191).</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-all relative z-10">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {!query && !selectedItem && !selectedCategory && (
                                    <div className="fade-in space-y-5">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Moddalar guruhlari</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {Object.entries(WARNING_TYPES).map(([key, config]) => (
                                                <div 
                                                    key={key}
                                                    onClick={() => setSelectedCategory(key)}
                                                    className="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 cursor-pointer overflow-hidden"
                                                >
                                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${config.colorClass.replace('text-white', '')}`}></div>
                                                    
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${config.colorClass} ${config.colorClass.includes('red') ? 'shadow-red-200' : config.colorClass.includes('orange') ? 'shadow-orange-200' : config.colorClass.includes('amber') ? 'shadow-amber-200' : config.colorClass.includes('cyan') ? 'shadow-cyan-200' : 'shadow-purple-200'}`}>
                                                            {getIcon(config.iconType)}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 truncate">
                                                                {config.shortLabel}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                                    {config.law}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                                {config.desc}
                                                            </p>
                                                        </div>

                                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {selectedCategory && !selectedItem && (
                                    <div className="fade-in">
                                        <button 
                                            onClick={() => setSelectedCategory(null)}
                                            className="mb-4 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Orqaga
                                        </button>

                                        <div className={`p-6 rounded-3xl mb-6 shadow-lg ${WARNING_TYPES[selectedCategory].colorClass}`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-2 text-white">
                                                        {WARNING_TYPES[selectedCategory].shortLabel}
                                                    </h3>
                                                    <p className="text-sm text-white/90 font-medium leading-relaxed max-w-xs">
                                                        {WARNING_TYPES[selectedCategory].desc}
                                                    </p>
                                                </div>
                                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                                    {getIcon(WARNING_TYPES[selectedCategory].iconType)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {DATABASE.filter(item => item.category === selectedCategory).map(item => (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => setSelectedItem(item)}
                                                    className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-blue-400 hover:shadow-md cursor-pointer shadow-sm active:bg-slate-50 transition flex justify-between items-center group"
                                                >
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                                        <div className="flex gap-2 mt-1.5">
                                                            {item.aliases.slice(0, 3).map(alias => (
                                                                <span key={alias} className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-md font-medium">
                                                                    {alias}
                                                                </span>
                                                            ))}
                                                            {item.aliases.length > 3 && (
                                                                <span className="text-[10px] text-slate-400 font-medium">+{item.aliases.length - 3}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-slate-300 group-hover:text-blue-500 transition-colors">→</div>
                                                </div>
                                            ))}
                                            {DATABASE.filter(item => item.category === selectedCategory).length === 0 && (
                                                <div className="text-center py-12 text-slate-400">
                                                    <p>Ushbu kategoriyada hozircha moddalar yo'q.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {query && !selectedItem && (
                                    <div className="space-y-3 fade-in">
                                        <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Topilgan natijalar: {results.length} ta</p>
                                        {results.map(item => {
                                            const config = getWarningConfig(item.category);
                                            return (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => setSelectedItem(item)}
                                                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 cursor-pointer shadow-sm active:bg-slate-50 transition group"
                                                >
                                                    <div className="flex justify-between items-start gap-3 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-slate-800 break-words leading-tight">{item.name}</h3>
                                                        </div>
                                                        <span className={`shrink-0 px-2.5 py-1 rounded-md text-[9px] font-black text-center uppercase tracking-wide leading-tight shadow-sm ${config.colorClass} max-w-[45%]`}>
                                                            {config.shortLabel}
                                                        </span>
                                                    </div>
                                                    {item.medicines && item.medicines.length > 0 && (
                                                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                            <PillIcon className="w-3.5 h-3.5 text-slate-400" />
                                                            <span className="font-semibold text-slate-600 truncate">{item.medicines.join(', ')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {results.length === 0 && (
                                            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                                <div className="text-slate-300 mb-3 mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                                                    <SearchIcon className="w-6 h-6" />
                                                </div>
                                                <h3 className="font-bold text-slate-700">Hech narsa topilmadi</h3>
                                                <p className="text-sm text-slate-400 mt-1">"{query}" bo'yicha bazada ma'lumot yo'q.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </>
                        )}
                        
                        {/* --- SCAN MODE CONTENT --- */}
                         {mode === 'scan' && !selectedItem && (
                             <div className="fade-in flex flex-col items-center">
                                {!selectedImage ? (
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className="w-full h-64 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group bg-white"
                                    >
                                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <div className="relative">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur opacity-40 animate-pulse"></div>
                                                <div className="relative bg-white rounded-full p-3 text-blue-600">
                                                    <CameraIcon width="32" height="32" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-800 font-bold text-lg mt-2 text-center px-4">Preparatning tarkibi rasmini yuklang</p>
                                        <p className="text-slate-500 text-xs mt-1 text-center px-8 font-medium">Sun'iy idrok rasmdagi modda nomlarini aniqlaydi va ro'yxat bilan solishtiradi</p>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden" 
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                                        <img src={selectedImage} alt="Uploaded" className="w-full h-auto opacity-80" />
                                        
                                        {isScanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                                <div className="relative">
                                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                                                        <SparklesIcon className="animate-pulse" />
                                                    </div>
                                                </div>
                                                <div className="text-white font-bold mt-4 animate-pulse tracking-wide text-sm">{scanStatus}</div>
                                            </div>
                                        )}

                                        {!isScanning && (
                                            <button 
                                                onClick={() => {setSelectedImage(null); setSelectedItem(null); setScanStatus(''); setOcrText(''); setFoundItemsList([]);}}
                                                className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70 transition"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                            </button>
                                        )}
                                    </div>
                                )}
                                
                                {ocrText && !selectedItem && (
                                    <div className="mt-6 p-5 bg-white border border-slate-200 rounded-3xl text-left w-full shadow-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                                 <SparklesIcon className="w-4 h-4" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">AI Aniqlagan moddalar:</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {ocrText.split(', ').map((text, i) => (
                                                <span key={i} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600">
                                                    {text}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {foundItemsList.length > 0 && !selectedItem && (
                                    <div className="mt-4 w-full">
                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 items-start shadow-sm animate-pulse-once">
                                            <div className="text-red-600 mt-0.5 shrink-0">
                                                <ShieldAlert />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-red-800 text-sm uppercase tracking-wide flex items-center gap-2">
                                                    DIQQAT: TAQIQLANGAN MODDA ANIQLANDI!
                                                </h4>
                                                <p className="text-red-700/90 text-xs mt-1 font-medium leading-relaxed">
                                                    Deklaratsiyada ko'rsatilmagan va tibbiyot muassasi tasdiqlangan hujjati (retsept) mavjud bo'lmagan holda olib o'tish jinoiy javobgarlikka sabab bo'ladi
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 pl-2">Bazadan topilgan xavfli moddalar:</p>
                                        <div className="space-y-3">
                                            {foundItemsList.map(item => (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => setSelectedItem(item)}
                                                    className="bg-white border border-red-100 rounded-2xl p-4 hover:border-red-300 cursor-pointer shadow-sm hover:shadow-md transition flex justify-between items-center group relative overflow-hidden"
                                                >
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                                                    <div className="pl-3">
                                                        <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
                                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide mt-1 block">{getWarningConfig(item.category).shortLabel}</span>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                        →
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {scanStatus && !isScanning && foundItemsList.length === 0 && (
                                    <div className="mt-4 p-4 bg-green-50 text-green-800 text-sm rounded-2xl border border-green-200 w-full text-center flex flex-col items-center gap-2 shadow-sm">
                                        <div className="p-2 bg-green-100 rounded-full text-green-600"><CheckIcon className="w-6 h-6" /></div>
                                        <div>
                                            <p className="font-bold text-green-900">Xavfsiz</p>
                                            <p className="text-xs text-green-700/80 mt-0.5">Taqiqlangan moddalar ro'yxatida topilmadi</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                         )}

                        {/* --- DETAIL VIEW --- */}
                         {selectedItem && (
                            <div className="fade-in">
                                <button 
                                    onClick={() => setSelectedItem(null)}
                                    className="mb-6 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
                                </button>

                                {(() => {
                                    const config = getWarningConfig(selectedItem.category);
                                    return (
                                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                            <div className={`p-8 text-center relative overflow-hidden ${config.colorClass}`}>
                                                <div className="absolute inset-0 bg-black/10"></div>
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl mb-4 shadow-lg ring-1 ring-white/30">
                                                        {getIcon(config.iconType)}
                                                    </div>
                                                    <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/90 mb-2 border border-white/10">
                                                        {config.shortLabel}
                                                    </span>
                                                    <h2 className="text-3xl font-black text-white tracking-tight">{selectedItem.name}</h2>
                                                </div>
                                            </div>

                                            <div className="p-6 space-y-6">
                                                {selectedItem.medicines && selectedItem.medicines.length > 0 && (
                                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                            <PillIcon className="w-3 h-3" /> Savdo nomlari
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedItem.medicines.map(med => (
                                                                <span key={med} className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 shadow-sm">
                                                                    {med}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid gap-4">
                                                    <div className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition bg-white shadow-sm">
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tavsif</h4>
                                                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                                            {selectedItem.description}
                                                        </p>
                                                    </div>

                                                    {selectedItem.aliases && selectedItem.aliases.length > 0 && (
                                                        <div className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition bg-white shadow-sm">
                                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sinonimlar</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {selectedItem.aliases.map((alias, idx) => (
                                                                    <span key={idx} className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                                                                        {alias}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition bg-white shadow-sm flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Qonunchilik asosi</h4>
                                                            <p className="text-sm font-bold text-slate-800">{config.law}</p>
                                                        </div>
                                                        {config.lawUrl && (
                                                            <a 
                                                                href={config.lawUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
                                                            >
                                                                O'qish →
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-200">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                                        <ShieldAlert width="64" height="64" />
                                                    </div>
                                                    <div className="relative z-10">
                                                        <h4 className="font-black text-sm uppercase tracking-wide flex items-center gap-2 mb-2">
                                                            <span className="bg-white/20 p-1 rounded-full"><ShieldAlert className="w-4 h-4" /></span>
                                                            Diqqat: Ogohlantirish
                                                        </h4>
                                                        <p className="text-xs font-medium leading-relaxed opacity-90">
                                                            Deklaratsiyada ko'rsatilmagan va tibbiyot muassasi tasdiqlangan hujjati (retsept) mavjud bo'lmagan holda olib o'tish jinoiy javobgarlikka sabab bo'ladi
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                         )}

                        {/* --- CHAT MODE --- */}
                        {mode === 'chat' && (
                            <div className="fade-in flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 mb-4 pr-1">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role === 'assistant' && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white mr-2 shrink-0 shadow-sm">
                                                    <SparklesIcon className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div className={`chat-bubble ${msg.role} shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoadingChat && (
                                        <div className="flex justify-start">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white mr-2">
                                                <SparklesIcon className="w-4 h-4 animate-spin" />
                                            </div>
                                            <div className="chat-bubble ai bg-slate-100 text-slate-500 italic">
                                                Yozmoqda...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                                
                                <div className="relative mt-auto shrink-0">
                                    <textarea
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Savolingizni batafsil yozing..."
                                        rows="3"
                                        className="w-full pl-4 pr-14 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all shadow-lg shadow-slate-200/50 resize-none text-sm"
                                    ></textarea>
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={isLoadingChat || !chatInput.trim()}
                                        className="absolute right-3 bottom-3 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all shadow-md shadow-purple-200"
                                    >
                                        <SendIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 text-center shrink-0 z-10">
                        <h3 className="font-bold text-slate-700 text-sm flex items-center justify-center gap-2 mb-1">
                            <SixteenPointIcon className="w-5 h-5 text-blue-600" />
                            "Toshkent-AERO" IBK
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                            by <a href="https://t.me/ShNormamatov" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">Shakhobiddin Normamatov</a>
                        </p>
                    </div>

                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    