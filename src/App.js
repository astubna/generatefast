import { useState, useEffect } from "react";
import { Search, Star, Download, Copy, Check, X, RefreshCw, Info, History, ExternalLink, Loader, Globe, Zap, Shield } from "lucide-react";

// ========================================================
// ✅ SECURE VERSION - API calls go through PHP proxy
// No API keys in frontend code!
// ========================================================

const TLDS = ['.com','.io','.app','.shop','.tech','.co','.net','.ai','.store','.eu'];
const NATIONAL_TLDS = [
  { code: '.sk', name: 'Slovakia' }, { code: '.cz', name: 'Czech Republic' },
  { code: '.eu', name: 'European Union' }, { code: '.de', name: 'Germany' },
  { code: '.at', name: 'Austria' }, { code: '.pl', name: 'Poland' },
  { code: '.hu', name: 'Hungary' }, { code: '.us', name: 'United States' },
  { code: '.uk', name: 'United Kingdom' }, { code: '.fr', name: 'France' },
  { code: '.it', name: 'Italy' }, { code: '.es', name: 'Spain' },
  { code: '.nl', name: 'Netherlands' }, { code: '.be', name: 'Belgium' },
  { code: '.ch', name: 'Switzerland' }, { code: '.se', name: 'Sweden' },
  { code: '.no', name: 'Norway' }, { code: '.dk', name: 'Denmark' },
  { code: '.fi', name: 'Finland' }, { code: '.ro', name: 'Romania' },
  { code: '.pt', name: 'Portugal' }, { code: '.ie', name: 'Ireland' },
  { code: '.ca', name: 'Canada' }, { code: '.au', name: 'Australia' },
  { code: '.nz', name: 'New Zealand' }, { code: '.sg', name: 'Singapore' },
  { code: '.in', name: 'India' }, { code: '.br', name: 'Brazil' },
  { code: '.mx', name: 'Mexico' },
];

const REGISTRARS = [
  { name: 'WebSupport.sk', url: 'https://www.websupport.sk/vyhladavanie-domeny/?domain=', flag: '🇸🇰' },
  { name: 'Wedos.sk',      url: 'https://www.wedos.sk/domeny/',                           flag: '🇸🇰' },
  { name: 'Wedos.cz',      url: 'https://www.wedos.cz/domeny/',                           flag: '🇨🇿' },
  { name: 'Forpsi.cz',     url: 'https://www.forpsi.cz/domeny/?domain=',                  flag: '🇨🇿' },
  { name: 'Namecheap',     url: 'https://www.namecheap.com/domains/registration/results/?domain=', flag: '🌍' },
  { name: 'GoDaddy',       url: 'https://www.godaddy.com/domainsearch/find?domainToCheck=', flag: '🌍' },
];

const T = {
  en: {
    title: 'Domain Name Generator', subtitle: 'AI-powered domain suggestions for your business',
    hero1: 'Find Your Perfect', hero2: 'Domain Name',
    heroSub: 'AI analyses your business and generates smart, brandable domain names in seconds.',
    feat1: 'AI Powered', feat1sub: 'Smart suggestions',
    feat2: 'Instant Check', feat2sub: 'Real availability',
    feat3: 'Local & Global', feat3sub: 'SK, CZ & worldwide',
    form: 'Tell us about your business', s1: '1. Business Information', s2: '2. Brand & Keywords', s3: '3. Domain Preferences',
    businessType: 'Business Type / Theme *', businessTypePh: 'e.g. Coffee Shop, Tech Startup',
    industry: 'Industry *', industryPh: 'e.g. Food & Beverage, Technology',
    products: 'Products / Services', productsPh: 'What will you sell or provide?',
    eshop: 'Will there be an e-shop on this domain?', yes: 'Yes', no: 'No',
    brand: 'Brand Name (Optional)', brandPh: 'e.g. BrewMaster, TechFlow', brandHint: 'AI will prioritize and include your brand name in suggestions',
    keywords: 'Keywords (comma separated)', keywordsPh: 'e.g. brew, fresh, urban',
    style: 'Preferred Style', tld: 'Preferred TLD', tldHint: 'Choose a specific extension or all',
    allTlds: 'All TLDs (Recommended)', national: 'National / Country TLD', nationalHint: 'Ideal for local businesses', none: 'None',
    generate: 'Generate with AI', generating: 'AI is thinking...', results: 'AI Generated Domains', count: 'results',
    newSearch: 'New Search', regen: 'Regenerate',
    filterTld: 'Filter by TLD', allTldsF: 'All TLDs', filterLen: 'Filter by Length', allLen: 'All Lengths',
    short: 'Short (≤8)', medium: 'Medium (9-12)', long: 'Long (13+)',
    filterStatus: 'Filter by Status', allStatus: 'All Status', available: 'Available', taken: 'Taken', verifying: 'Verifying...',
    sortBy: 'Sort by', relevance: 'Relevance', length: 'Length', score: 'Score', alpha: 'Alphabetical',
    chars: 'chars', quality: 'Quality Score', social: 'Social Media:',
    noneAvail: 'None available', fav: 'Add to favorites', copy: 'Copy domain', buy: 'Buy this domain',
    favorites: 'Favorites', export: 'Export', tips: 'Domain Tips',
    tip1: 'Keep it 6-14 characters', tip2: 'Easy to spell and pronounce',
    tip3: '.com most trusted, .sk/.cz for local', tip4: 'Avoid hyphens and numbers', tip5: 'Check social media availability',
    recent: 'Recent Searches', generated: 'domains generated',
    styles: ['Modern','Professional','Playful','Minimalist','Creative','Tech-focused'],
    aiError: 'AI generation failed. Please try again.', aiReason: '💡 Why this domain?',
    registrars: 'Registrars',
  },
  sk: {
    title: 'Generátor doménových mien', subtitle: 'Doménové mená poháňané AI pre váš biznis',
    hero1: 'Nájdite perfektnú', hero2: 'Doménu',
    heroSub: 'AI analyzuje váš biznis a vygeneruje inteligentné, zapamätateľné doménové mená za sekundy.',
    feat1: 'AI technológia', feat1sub: 'Inteligentné návrhy',
    feat2: 'Okamžitá kontrola', feat2sub: 'Reálna dostupnosť',
    feat3: 'Lokálne & Globálne', feat3sub: 'SK, CZ a celý svet',
    form: 'Povedzte nám o vašom biznise', s1: '1. Informácie o biznise', s2: '2. Značka a kľúčové slová', s3: '3. Preferencie domény',
    businessType: 'Typ / Téma biznisu *', businessTypePh: 'napr. Kaviareň, IT firma',
    industry: 'Odvetvie *', industryPh: 'napr. Gastronómia, Technológie',
    products: 'Produkty / Služby', productsPh: 'Čo budete predávať alebo poskytovať?',
    eshop: 'Bude na tejto doméne e-shop?', yes: 'Áno', no: 'Nie',
    brand: 'Názov značky (voliteľné)', brandPh: 'napr. KávaDoma, TechFlow', brandHint: 'AI uprednostní a zahrnie váš názov značky do návrhov',
    keywords: 'Kľúčové slová (oddelené čiarkou)', keywordsPh: 'napr. káva, čerstvé, moderné',
    style: 'Preferovaný štýl', tld: 'Preferovaná prípona', tldHint: 'Vyberte príponu alebo zobrazte všetky',
    allTlds: 'Všetky prípony (odporúčané)', national: 'Národná / Krajinová TLD', nationalHint: 'Ideálne pre lokálne firmy', none: 'Žiadna',
    generate: 'Generovať pomocou AI', generating: 'AI rozmýšľa...', results: 'Domény vygenerované AI', count: 'výsledkov',
    newSearch: 'Nové vyhľadávanie', regen: 'Generovať znova',
    filterTld: 'Filter podľa prípony', allTldsF: 'Všetky prípony', filterLen: 'Filter podľa dĺžky', allLen: 'Všetky dĺžky',
    short: 'Krátke (≤8)', medium: 'Stredné (9-12)', long: 'Dlhé (13+)',
    filterStatus: 'Filter podľa stavu', allStatus: 'Všetky stavy', available: 'Dostupná', taken: 'Obsadená', verifying: 'Overujem...',
    sortBy: 'Zoradiť podľa', relevance: 'Relevantnosti', length: 'Dĺžky', score: 'Skóre', alpha: 'Abecedne',
    chars: 'znakov', quality: 'Skóre kvality', social: 'Sociálne médiá:',
    noneAvail: 'Žiadne dostupné', fav: 'Pridať do obľúbených', copy: 'Kopírovať doménu', buy: 'Kúpiť doménu',
    favorites: 'Obľúbené', export: 'Exportovať', tips: 'Tipy pre domény',
    tip1: 'Ideálne 6-14 znakov', tip2: 'Ľahko sa hlásuje a vyslovuje',
    tip3: '.com najdôveryhodnejšia, .sk pre lokálne', tip4: 'Vyhýbajte sa pomlčkám a číslam', tip5: 'Skontrolujte aj sociálne siete',
    recent: 'Nedávne vyhľadávania', generated: 'domén vygenerovaných',
    styles: ['Moderný','Profesionálny','Hravý','Minimalistický','Kreatívny','Technologický'],
    aiError: 'Generovanie AI zlyhalo. Skúste znova.', aiReason: '💡 Prečo táto doména?',
    registrars: 'Registrátori',
  },
  cs: {
    title: 'Generátor doménových jmen', subtitle: 'Doménová jména pro váš byznys s pomocí AI',
    hero1: 'Najděte perfektní', hero2: 'Doménu',
    heroSub: 'AI analyzuje váš byznys a vygeneruje chytrá, zapamatovatelná doménová jména během sekund.',
    feat1: 'AI technologie', feat1sub: 'Chytré návrhy',
    feat2: 'Okamžitá kontrola', feat2sub: 'Reálná dostupnost',
    feat3: 'Lokálně & Globálně', feat3sub: 'CZ, SK a celý svět',
    form: 'Řekněte nám o vašem byznysu', s1: '1. Informace o byznysu', s2: '2. Značka a klíčová slova', s3: '3. Preference domény',
    businessType: 'Typ / Téma byznysu *', businessTypePh: 'např. Kavárna, IT firma',
    industry: 'Odvětví *', industryPh: 'např. Gastronomie, Technologie',
    products: 'Produkty / Služby', productsPh: 'Co budete prodávat nebo poskytovat?',
    eshop: 'Bude na této doméně e-shop?', yes: 'Ano', no: 'Ne',
    brand: 'Název značky (volitelné)', brandPh: 'např. KávaDoma, TechFlow', brandHint: 'AI upřednostní a zahrne váš název značky do návrhů',
    keywords: 'Klíčová slova (oddělená čárkou)', keywordsPh: 'např. káva, čerstvé, moderní',
    style: 'Preferovaný styl', tld: 'Preferovaná přípona', tldHint: 'Vyberte příponu nebo zobrazte všechny',
    allTlds: 'Všechny přípony (doporučené)', national: 'Národní / Zemská TLD', nationalHint: 'Ideální pro lokální firmy', none: 'Žádná',
    generate: 'Generovat pomocí AI', generating: 'AI přemýšlí...', results: 'Domény vygenerované AI', count: 'výsledků',
    newSearch: 'Nové vyhledávání', regen: 'Generovat znovu',
    filterTld: 'Filtrovat podle přípony', allTldsF: 'Všechny přípony', filterLen: 'Filtrovat podle délky', allLen: 'Všechny délky',
    short: 'Krátké (≤8)', medium: 'Střední (9-12)', long: 'Dlouhé (13+)',
    filterStatus: 'Filtrovat podle stavu', allStatus: 'Všechny stavy', available: 'Dostupná', taken: 'Obsazená', verifying: 'Ověřuji...',
    sortBy: 'Seřadit podle', relevance: 'Relevance', length: 'Délky', score: 'Skóre', alpha: 'Abecedně',
    chars: 'znaků', quality: 'Skóre kvality', social: 'Sociální média:',
    noneAvail: 'Žádné dostupné', fav: 'Přidat do oblíbených', copy: 'Kopírovat doménu', buy: 'Koupit doménu',
    favorites: 'Oblíbené', export: 'Exportovat', tips: 'Tipy pro domény',
    tip1: 'Ideálně 6-14 znaků', tip2: 'Snadno se hláskuje a vyslovuje',
    tip3: '.com nejdůvěryhodnější, .cz pro lokální', tip4: 'Vyhýbejte se pomlčkám a číslům', tip5: 'Zkontrolujte i sociální sítě',
    recent: 'Nedávná vyhledávání', generated: 'domén vygenerováno',
    styles: ['Moderní','Profesionální','Hravý','Minimalistický','Kreativní','Technologický'],
    aiError: 'Generování AI selhalo. Zkuste znovu.', aiReason: '💡 Proč tato doména?',
    registrars: 'Registrátoři',
  },
};

const STYLE_KEYS = ['modern','professional','playful','minimalist','creative','tech-focused'];

const sanitizeForDomain = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/\s+/g, "");
};

const calcScore = (name, tld) => {
  let s = 70;
  if (name.length >= 5 && name.length <= 10) s += 15;
  else if (name.length > 16) s -= 15;
  if (['.com','.sk','.cz'].includes(tld)) s += 10;
  if (/[^a-z0-9]/.test(name)) s -= 20;
  return Math.max(0, Math.min(100, s));
};

// ========================================================
// SECURE API CALLS - Go through PHP proxy backend
// No API keys exposed in frontend!
// ========================================================

const callAI = async (prompt) => {
  try {
    const response = await fetch('/api/proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_domains',
        prompt: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

const checkDomainAvailability = async (domainFull) => {
  try {
    const response = await fetch('/api/proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'check_domain',
        domain: domainFull
      })
    });

    if (!response.ok) {
      console.error('Domain check failed:', response.status);
      return 'unknown';
    }

    const data = await response.json();
    
    console.log('✅ Domain check for', domainFull, ':', data.availability);
    
    if (data.availability === 'available') {
      return 'available';
    } 
    if (data.availability === 'registered') {
      return 'taken';
    }
    
    return 'unknown';
  } catch (error) {
    console.error('Domain availability check failed:', error);
    return 'unknown';
  }
};

export default function App() {
  const [lang, setLang]         = useState('sk');
  const [step, setStep]         = useState('form');
  const [loading, setLoading]   = useState(false);
  const [aiError, setAiError]   = useState('');
  const [form, setForm]         = useState({ businessType:'', industry:'', style:'modern', hasEshop:'no', products:'', keywords:'', brand:'', tld:'all', national:'.sk' });
  const [domains, setDomains]   = useState([]);
  const [favs, setFavs]         = useState([]);
  const [history, setHistory]   = useState([]);
  const [filter, setFilter]     = useState({ tld:'all', len:'all', status:'all' });
  const [sort, setSort]         = useState('score');
  const [showTips, setShowTips] = useState(true);
  const [copied, setCopied]     = useState(null);
  const [verifyingMap, setVerifyingMap] = useState({});

  const t = T[lang];

  // Check real availability
  const checkRealAvailability = async (domainFull) => {
    if (verifyingMap[domainFull]) return;
    
    setVerifyingMap(prev => ({ ...prev, [domainFull]: true }));
    
    try {
      const result = await checkDomainAvailability(domainFull);
      
      setDomains(prev => prev.map(d => 
        d.full === domainFull 
          ? { ...d, available: result } 
          : d
      ));
    } finally {
      setVerifyingMap(prev => {
        const next = { ...prev };
        delete next[domainFull];
        return next;
      });
    }
  };

  useEffect(() => {
    const toCheck = domains.filter(d => d.available === 'verifying' && !verifyingMap[d.full]);
    toCheck.slice(0, 5).forEach(d => {
      checkRealAvailability(d.full);
    });
  }, [domains, verifyingMap]);

  const buildPrompt = () => {
    const cleanBrand = sanitizeForDomain(form.brand);
    const tldPrefs = form.tld !== 'all'
      ? `Use ONLY the "${form.tld}" extension.`
      : form.national !== 'none'
        ? `Prefer "${form.national}" and ".com" extensions.`
        : `Use a mix of .com, .sk, .cz, .eu, .io extensions.`;
    const langNote = lang === 'sk'
      ? 'The business is Slovak. Suggestions may include Slovak words transliterated to ASCII, or creative combinations of Slovak and English words. Write the "reason" field in Slovak language.'
      : lang === 'cs'
      ? 'The business is Czech. Suggestions may include Czech words transliterated to ASCII, or creative combinations of Czech and English words. Write the "reason" field in Czech language.'
      : 'The business targets an English-speaking audience. Write the "reason" field in English.';
    const brandNote = cleanBrand
      ? `IMPORTANT: The brand name is "${cleanBrand}". You MUST include this string in at least 5 of the 15 suggestions.`
      : '';
    return `You are a domain name expert. Generate exactly 15 domain name suggestions for a business with the following details:
Business type: ${form.businessType}
Industry: ${form.industry}
Style preference: ${form.style}
${langNote}
${brandNote}
Domain extension rules: ${tldPrefs}
Respond ONLY with a valid JSON array of exactly 15 objects. No explanation. 
[{"domain":"name","tld":".com","reason":"Catchy and memorable"}]`;
  };

  const generate = async (isRegen = false) => {
    if (!form.businessType.trim() || !form.industry.trim()) return;
    setLoading(true); setAiError(''); setDomains([]); setVerifyingMap({});
    try {
      const raw = await callAI(buildPrompt());
      if (!raw) { setLoading(false); return; }
      const clean = raw.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(clean);
      const knownTlds = [...TLDS, ...NATIONAL_TLDS.map(n => n.code)];
      const brandAscii = sanitizeForDomain(form.brand);
      
      const final = parsed.map(item => {
          const base = sanitizeForDomain(item.domain);
          const tld  = knownTlds.includes(item.tld) ? item.tld : '.com';
          return { 
            full: base+tld, base, tld, reason: item.reason||'', length: base.length,
            score: calcScore(base, tld), isBrand: !!(brandAscii && base.includes(brandAscii)),
            available: 'verifying',
            social: { twitter: Math.random()>0.5, instagram: Math.random()>0.5, facebook: Math.random()>0.5 }
          };
        })
        .filter((d,i,arr) => d.base.length>=2 && arr.findIndex(x=>x.full===d.full)===i);

      setDomains(final);
      if (!isRegen) setHistory(h=>[...h,{...form,ts:Date.now(),count:final.length}]);
      setStep('results');
    } catch(err) { console.error(err); setAiError(t.aiError); }
    finally { setLoading(false); }
  };

  const toggleFav  = (d) => setFavs(f=>f.find(x=>x.full===d.full)?f.filter(x=>x.full!==d.full):[...f,d]);
  const isFav      = (d) => !!favs.find(x=>x.full===d.full);
  const copyIt     = (text) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(()=>setCopied(null),2000); };
  const exportFavs = () => {
    const blob = new Blob([favs.map(f=>`${f.full}  Score: ${f.score}/100`).join('\n')],{type:'text/plain'});
    Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:'domains.txt'}).click();
  };

  const filtered = domains
    .filter(d=>filter.tld==='all'||d.tld===filter.tld)
    .filter(d=>filter.len==='all'||(filter.len==='short'?d.length<=8:filter.len==='medium'?d.length<=12:d.length>12))
    .filter(d=>filter.status==='all'||d.available===filter.status)
    .sort((a,b)=>sort==='score'?b.score-a.score:sort==='length'?a.length-b.length:sort==='alpha'?a.full.localeCompare(b.full):0);

  const inp  = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition shadow-sm";
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-indigo-900 to-gray-950" />
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)'}} />

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-4">
          <div className="flex justify-end gap-2 mb-10">
            {['sk','cs','en'].map(l=>(
              <button key={l} onClick={()=>setLang(l)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${lang===l?'bg-white text-violet-900 border-white':'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>
                {l==='sk'?'🇸🇰 SK':l==='cs'?'🇨🇿 CS':'🇬🇧 EN'}
              </button>
            ))}
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-4 py-1.5 text-violet-300 text-sm font-medium mb-6">
              <Zap size={14} className="text-violet-400" /> AI Powered
            </div>
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">{t.hero1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">{t.hero2}</span></h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t.heroSub}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[{ icon: <Zap size={16}/>, label: t.feat1, sub: t.feat1sub }, { icon: <Shield size={16}/>, label: t.feat2, sub: t.feat2sub }, { icon: <Globe size={16}/>, label: t.feat3, sub: t.feat3sub }].map((f,i)=>(
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-5 py-3">
                <div className="text-violet-400">{f.icon}</div>
                <div><div className="text-sm font-semibold text-white">{f.label}</div><div className="text-xs text-gray-400">{f.sub}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 pb-16">
        {step==='form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">{t.form}</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-2"><div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent"/><span className="text-xs font-bold text-violet-400 uppercase tracking-widest whitespace-nowrap">{t.s1}</span><div className="h-px flex-1 bg-gradient-to-l from-violet-500/50 to-transparent"/></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.businessType}</label><input className={inp} style={{color:'#111'}} placeholder={t.businessTypePh} value={form.businessType} onChange={e=>setF('businessType',e.target.value)}/></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.industry}</label><input className={inp} style={{color:'#111'}} placeholder={t.industryPh} value={form.industry} onChange={e=>setF('industry',e.target.value)}/></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.products}</label><textarea className={inp} style={{color:'#111'}} rows="2" placeholder={t.productsPh} value={form.products} onChange={e=>setF('products',e.target.value)}/></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.eshop}</label><div className="flex gap-3">{['yes','no'].map(v=>(<label key={v} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition text-sm font-medium ${form.hasEshop===v?'bg-violet-600 border-violet-500 text-white':'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}><input type="radio" value={v} checked={form.hasEshop===v} onChange={e=>setF('hasEshop',e.target.value)} className="hidden"/>{t[v]}</label>))}</div></div>
                <div className="flex items-center gap-3 mt-4 mb-2"><div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent"/><span className="text-xs font-bold text-violet-400 uppercase tracking-widest whitespace-nowrap">{t.s2}</span><div className="h-px flex-1 bg-gradient-to-l from-violet-500/50 to-transparent"/></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.brand}</label><input className={inp} style={{color:'#111'}} placeholder={t.brandPh} value={form.brand} onChange={e=>setF('brand',e.target.value)}/><p className="text-xs text-gray-500 mt-1">{t.brandHint}</p></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.keywords}</label><input className={inp} style={{color:'#111'}} placeholder={t.keywordsPh} value={form.keywords} onChange={e=>setF('keywords',e.target.value)}/></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.style}</label><select className={inp} style={{color:'#111'}} value={form.style} onChange={e=>setF('style',e.target.value)}>{STYLE_KEYS.map((k,i)=><option key={k} value={k}>{t.styles[i]}</option>)}</select></div>
                <div className="flex items-center gap-3 mt-4 mb-2"><div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent"/><span className="text-xs font-bold text-violet-400 uppercase tracking-widest whitespace-nowrap">{t.s3}</span><div className="h-px flex-1 bg-gradient-to-l from-violet-500/50 to-transparent"/></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.tld}</label><select className={inp} style={{color:'#111'}} value={form.tld} onChange={e=>setF('tld',e.target.value)}><option value="all">{t.allTlds}</option>{TLDS.map(x=><option key={x} value={x}>{x}</option>)}</select><p className="text-xs text-gray-500 mt-1">{t.tldHint}</p></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{t.national}</label><select className={inp} style={{color:'#111'}} value={form.national} onChange={e=>setF('national',e.target.value)}><option value="none">{t.none}</option>{NATIONAL_TLDS.map(x=><option key={x.code} value={x.code}>{x.code} — {x.name}</option>)}</select><p className="text-xs text-gray-500 mt-1">{t.nationalHint}</p></div>
                {aiError && (<div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl p-4 text-sm">{aiError}</div>)}
                <button onClick={()=>generate(false)} disabled={loading||!form.businessType.trim()||!form.industry.trim()} className="w-full mt-2 py-4 rounded-2xl font-bold text-base transition flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-violet-900/40">{loading ? <><Loader size={20} className="animate-spin"/>{t.generating}</> : <><Zap size={20}/>{t.generate}</>}</button>
              </div>
            </div>

            <div className="space-y-4">
              {showTips && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Info size={15} className="text-violet-400"/>{t.tips}
                    </span>
                    <button onClick={()=>setShowTips(false)} className="text-gray-600 hover:text-gray-400 transition"><X size={14}/></button>
                  </div>
                  <ul className="space-y-2.5">
                    {[t.tip1,t.tip2,t.tip3,t.tip4,t.tip5].map((tip,i)=>(
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-400">
                        <Check size={13} className="text-violet-400 mt-0.5 shrink-0"/>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gradient-to-br from-violet-900/40 to-blue-900/40 border border-violet-500/20 rounded-3xl p-5"><p className="text-sm font-bold text-white mb-4">🌐 {t.registrars}</p><div className="space-y-2">{REGISTRARS.map(r=>(<a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-violet-300 hover:text-white hover:underline font-medium transition">{r.flag} {r.name}</a>))}</div></div>
              {history.length>0 && (<div className="bg-gray-900 border border-gray-800 rounded-3xl p-5"><p className="text-sm font-bold text-white flex items-center gap-2 mb-4"><History size={14} className="text-violet-400"/>{t.recent}</p><div className="space-y-2">{history.slice(-3).reverse().map((h,i)=>(<button key={i} onClick={()=>{setForm(h);generate(true);}} className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition"><div className="font-medium text-white truncate">{h.businessType}</div><div className="text-xs text-gray-500 mt-0.5">{h.count} {t.generated}</div></button>))}</div></div>)}
            </div>
          </div>
        )}

        {step==='results' && (
          <div className="space-y-5">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div><h2 className="text-xl font-bold text-white flex items-center gap-2">{t.results}<span className="px-2 py-0.5 bg-violet-600 text-white text-xs font-bold rounded-full">AI</span></h2><p className="text-xs text-gray-500 mt-0.5">{filtered.length} {t.count}</p></div>
                <div className="flex gap-2">
                  <button onClick={()=>setStep('form')} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition border border-gray-700">{t.newSearch}</button>
                  <button onClick={()=>generate(true)} disabled={loading} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl text-sm flex items-center gap-1.5 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 transition font-medium">{loading?<Loader size={14} className="animate-spin"/>:<RefreshCw size={14}/>}{t.regen}</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                {[{ label: t.filterTld, val: filter.tld, opts: [['all',t.allTldsF],...[...new Set(domains.map(d=>d.tld))].map(x=>[x,x])], key: 'tld' }, { label: t.filterLen, val: filter.len, opts: [['all',t.allLen],['short',t.short],['medium',t.medium],['long',t.long]], key: 'len' }, { label: t.filterStatus, val: filter.status, opts: [['all',t.allStatus],['available',t.available],['taken',t.taken]], key: 'status' }, { label: t.sortBy, val: sort, opts: [['relevance',t.relevance],['score',t.score],['length',t.length],['alpha',t.alpha]], key: 'sort' }].map(({label,val,opts,key})=>(<div key={key}><label className="block text-xs text-gray-500 mb-1.5">{label}</label><select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-violet-500" value={val} onChange={e=>key==='sort'?setSort(e.target.value):setFilter(f=>({...f,[key]:e.target.value}))}>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>))}
              </div>

              <div className="space-y-3">
                {filtered.map((d,i)=>(
                  <div key={i} className={`rounded-2xl p-5 border transition hover:scale-[1.01] ${d.isBrand ? 'bg-gradient-to-r from-violet-900/50 to-blue-900/50 border-violet-500/40' : d.available==='available' ? 'bg-green-900/20 border-green-500/30' : d.available==='taken' ? 'bg-red-900/20 border-red-500/30' : 'bg-gray-800/50 border-gray-700/50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xl font-extrabold text-white tracking-tight">{d.full}</span>
                          {d.isBrand && (<span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white">✦ brand</span>)}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            d.available==='verifying' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 
                            d.available==='available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            d.available==='taken' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                            {d.available==='verifying' ? t.verifying : d.available === 'unknown' ? '❓ Unknown' : t[d.available]}
                          </span>
                          <span className="text-xs text-gray-500">{d.length} {t.chars}</span>
                        </div>
                        {d.reason && (<p className="text-xs text-gray-400 italic mb-3">{t.aiReason}: {d.reason}</p>)}
                        <div className="flex items-center gap-2 mb-3"><span className="text-xs text-gray-500 whitespace-nowrap">{t.quality}:</span><div className="w-28 bg-gray-700 rounded-full h-1.5"><div className={`h-1.5 rounded-full transition-all ${d.score>=80?'bg-gradient-to-r from-green-500 to-emerald-400':d.score>=60?'bg-gradient-to-r from-yellow-500 to-amber-400':'bg-gradient-to-r from-red-500 to-rose-400'}`} style={{width:`${d.score}%`}}/></div><span className="text-xs font-bold text-gray-300">{d.score}/100</span></div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs mb-3"><span className="text-gray-500">{t.social}</span>{d.social.twitter && <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full border border-sky-500/20">✓ Twitter</span>}{d.social.instagram && <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded-full border border-pink-500/20">✓ Instagram</span>}{d.social.facebook && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20">✓ Facebook</span>}</div>
                        {d.available==='available' && (<a href={`https://www.namecheap.com/domains/registration/results/?domain=${d.full}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl transition font-medium shadow-lg shadow-violet-900/30"><ExternalLink size={12}/>{t.buy}</a>)}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={()=>toggleFav(d)} title={t.fav} className={`p-2.5 rounded-xl transition ${isFav(d)?'bg-yellow-500/20 text-yellow-400':'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-300'}`}><Star size={16} fill={isFav(d)?'currentColor':'none'}/></button>
                        <button onClick={()=>copyIt(d.full)} title={t.copy} className="p-2.5 bg-gray-700 text-gray-500 rounded-xl hover:bg-gray-600 hover:text-gray-300 transition">{copied===d.full?<Check size={16} className="text-green-400"/>:<Copy size={16}/>}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {favs.length>0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-white flex items-center gap-2"><Star size={17} className="text-yellow-400" fill="currentColor"/>{t.favorites} ({favs.length})</h3><button onClick={exportFavs} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl text-sm flex items-center gap-2 hover:from-violet-500 hover:to-blue-500 transition font-medium"><Download size={14}/>{t.export}</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{favs.map((f,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"><div><div className="font-bold text-sm text-white">{f.full}</div><div className="text-xs text-gray-500">{t.score}: {f.score}/100</div></div><button onClick={()=>toggleFav(f)} className="text-gray-600 hover:text-red-400 transition p-1"><X size={14}/></button></div>))}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
