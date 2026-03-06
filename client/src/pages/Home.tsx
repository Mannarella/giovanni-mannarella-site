import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, ArrowRight, BookOpen, Briefcase, Users, Zap, MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import ShareButton from "@/components/ShareButton";
import NewsModal, { NewsItem } from "@/components/NewsModal";

// ---------------------------------------------------------------------------
// Helpers per il parsing delle date di apertura bandi (formato italiano)
// Es: "da 23 feb 2026", "dal 25 feb 2026", "Aperto"
// ---------------------------------------------------------------------------

const MESI_IT: Record<string, number> = {
  gen: 0, feb: 1, mar: 2, apr: 3, mag: 4, giu: 5,
  lug: 6, ago: 7, set: 8, sett: 8, ott: 9, nov: 10, dic: 11,
};

/**
 * Restituisce un oggetto Date dalla stringa apertura del bando,
 * oppure null se non parsabile (es. "Aperto").
 */
function parseAperturaDate(apertura: string): Date | null {
  // Rimuove prefissi "da ", "dal ", "dall'" e spazi extra
  const clean = apertura.toLowerCase().replace(/^da[l]?\s+/, "").trim();
  // Formato atteso dopo la pulizia: "23 feb 2026"
  const parts = clean.split(/\s+/);
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = MESI_IT[parts[1]];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(year, month, day);
}

/**
 * Filtra i bandi da mostrare nella tabella:
 * - Stato "Aperto"   → sempre incluso
 * - Stato "In apertura" con data apertura entro i prossimi 3 mesi → incluso
 * Restituisce max `limit` elementi.
 */
function filterBandi(data: any[], limit: number): any[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tre_mesi = new Date(today);
  tre_mesi.setMonth(tre_mesi.getMonth() + 3);

  const filtered = data.filter((b: any) => {
    if (b.stato === "Aperto") return true;
    if (b.stato === "In apertura") {
      const d = parseAperturaDate(b.apertura);
      // Se non parsabile, escludi; se la data è ≤ oggi+3mesi, includi
      return d !== null && d <= tre_mesi;
    }
    return false;
  });

  return filtered.slice(0, limit);
}

// ---------------------------------------------------------------------------

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [azienda, setAzienda] = useState("");
  const [telefono, setTelefono] = useState("");
  const [consenso, setConsenso] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Stato popup ricontatto bando
  const [contactModal, setContactModal] = useState<any | null>(null);
  const [popupNome, setPopupNome] = useState("");
  const [popupCognome, setPopupCognome] = useState("");
  const [popupAzienda, setPopupAzienda] = useState("");
  const [popupEmail, setPopupEmail] = useState("");
  const [popupTelefono, setPopupTelefono] = useState("");
  const [popupConsenso, setPopupConsenso] = useState(false);
  const [popupSubmitted, setPopupSubmitted] = useState(false);

  // Apre link esterni in una finestra browser ridimensionata (stessa tecnica di FondiInterprofessionali)
  const openInSizedWindow = (url: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const width = 980;
    const height = 720;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
    window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height},left=${Math.floor(left)},top=${Math.floor(top)}`);
  };

  // Stato modale news
  const [newsModal, setNewsModal] = useState<NewsItem | null>(null);

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (popupEmail && popupConsenso) {
      setPopupSubmitted(true);
      setPopupNome("");
      setPopupCognome("");
      setPopupAzienda("");
      setPopupEmail("");
      setPopupTelefono("");
      setPopupConsenso(false);
      setTimeout(() => {
        setPopupSubmitted(false);
        setContactModal(null);
      }, 3000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && consenso) {
      setSubmitted(true);
      setNome("");
      setAzienda("");
      setEmail("");
      setTelefono("");
      setConsenso(false);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const services = [
    {
      icon: Briefcase,
      title: "Progettazione Fondi Interprofessionali",
      description: "Sviluppo progetti su FonARCom, Fondimpresa, Fon.Ter. e altri fondi con analisi dei bisogni personalizzata.",
      color: "bg-[oklch(0.65_0.15_35)]",
    },
    {
      icon: BookOpen,
      title: "Europrogettazione",
      description: "Progettazione di iniziative FESR, FSE e altri programmi europei secondo le specifiche dei bandi.",
      color: "bg-[oklch(0.75_0.08_145)]",
    },
    {
      icon: Users,
      title: "Finanziamenti Regionali per la Formazione",
      description: "Gestione percorsi formativi per qualifiche nazionali e regionali a valere su FSE+ e FESR.",
      color: "bg-[oklch(0.72_0.08_15)]",
    },
    {
      icon: Zap,
      title: "Finanza Agevolata",
      description: "Supporto nella progettazione di iniziative di finanza agevolata con analisi tecnico-economiche complete.",
      color: "bg-[oklch(0.65_0.15_35)]",
    },
  ];

  // Gestione LinkedIn posts
  const [linkedinPosts, setLinkedinPosts] = useState<{ testo: string; data: string; url: string }[]>([]);
  useEffect(() => {
    fetch("/linkedin-posts.json")
      .then((res) => res.json())
      .then((data) =>
        setLinkedinPosts(
          [...data].sort((a: any, b: any) => b.data.localeCompare(a.data)).slice(0, 3)
        )
      )
      .catch(() => setLinkedinPosts([]));
  }, []);

  // Gestione News
  const { data: newsData, isLoading: newsLoading, isError: newsError } = trpc.news.latest.useQuery(undefined, {
    retry: false,
  });
  const [staticNews, setStaticNews] = useState<any[] | null>(null);
  const [bandi, setBandi] = useState<any[] | null>(null);
  const [bandiLoading, setBandiLoading] = useState(true);

  useEffect(() => {
    if (!newsLoading && (newsError || !newsData || newsData.length === 0)) {
      fetch("/news.json")
        .then((res) => res.json())
        .then((data) => setStaticNews(data))
        .catch(() => setStaticNews([]));
    }
  }, [newsData, newsLoading, newsError]);

  useEffect(() => {
    fetch("/bandi.json")
      .then((res) => res.json())
      .then((data) => {
        // Filtra: "Aperto" sempre + "In apertura" nei prossimi 3 mesi, max 5 righe
        setBandi(filterBandi(data, 5));
        setBandiLoading(false);
      })
      .catch(() => {
        setBandi([]);
        setBandiLoading(false);
      });
  }, []);

  const rawNews = newsData && newsData.length > 0 ? newsData : staticNews;
  const displayNews = rawNews
    ? [...rawNews].sort((a: any, b: any) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      }).slice(0, 2)
    : null;

  const getStatoBadgeColor = (stato: string) => {
    if (stato === "Aperto") return "bg-green-100 text-green-800";
    if (stato === "In apertura") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Modale news */}
      <NewsModal news={newsModal} onClose={() => setNewsModal(null)} />

      {/* Popup ricontatto bando */}
      {contactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setContactModal(null); }}>
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
              <div>
                <p className="text-xs text-foreground/50 uppercase tracking-wide font-semibold mb-1">Richiesta di contatto</p>
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  Vorrei essere ricontattato per approfondire il{" "}
                  <span className="text-primary">{contactModal.fondo} — {contactModal.titolo}</span>
                </h3>
              </div>
              <button onClick={() => setContactModal(null)} className="shrink-0 mt-1 p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground/60 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6">
              {popupSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-foreground mb-2">Richiesta inviata!</p>
                  <p className="text-foreground/60">Ti contatteremo al più presto per approfondire il bando.</p>
                </div>
              ) : (
                <form onSubmit={handlePopupSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Nome *</label>
                      <input type="text" value={popupNome} onChange={(e) => setPopupNome(e.target.value)} placeholder="Il tuo nome" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Cognome *</label>
                      <input type="text" value={popupCognome} onChange={(e) => setPopupCognome(e.target.value)} placeholder="Il tuo cognome" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Azienda / Ente</label>
                    <input type="text" value={popupAzienda} onChange={(e) => setPopupAzienda(e.target.value)} placeholder="Nome azienda o ente (opzionale)" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Email *</label>
                    <input type="email" value={popupEmail} onChange={(e) => setPopupEmail(e.target.value)} placeholder="tua.email@example.com" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Telefono</label>
                    <input type="tel" value={popupTelefono} onChange={(e) => setPopupTelefono(e.target.value)} placeholder="+39 XXX XXX XXXX" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="popup-consenso"
                      checked={popupConsenso}
                      onChange={(e) => setPopupConsenso(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary cursor-pointer shrink-0"
                      required
                    />
                    <label htmlFor="popup-consenso" className="text-xs text-foreground/60 leading-relaxed cursor-pointer">
                      Ho letto e accetto la{" "}
                      <a href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</a>{" "}
                      e acconsento al trattamento dei miei dati personali. *
                    </label>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!popupConsenso || !popupEmail || !popupNome || !popupCognome}>
                    Invia richiesta di contatto
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="h-12 flex items-center">
            <img src="/images/logo.png" alt="Giovanni Mannarella Logo" className="h-full object-contain" />
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#servizi" className="text-foreground hover:text-primary transition-colors">Servizi</a>
            <a href="#opportunita" className="text-foreground hover:text-primary transition-colors">Opportunità</a>
            <a href="#news" className="text-foreground hover:text-primary transition-colors">News</a>
            <a href="#contatti" className="text-foreground hover:text-primary transition-colors">Contatti</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/images/hero-background.png" alt="Hero background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">Progettazione e Consulenza Strategica</h1>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">Supporto specializzato nella progettazione di iniziative formative, europrogettazione e sviluppo aziendale. Con oltre 15 anni di esperienza, trasformo idee in progetti vincenti.</p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => document.getElementById("contatti")?.scrollIntoView({ behavior: "smooth" })}>
                Richiedi Consulenza <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chi Sono Section */}
      <section id="chi-sono" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-3 text-foreground">Chi Sono</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-12 items-start">
            {/* Bio */}
            <div className="space-y-5 text-lg text-foreground/80">
              <p>Sono <b>Giovanni Mannarella</b>, esperto in progettazione formativa, europrogettazione e consulenza aziendale. La mia formazione multidisciplinare combina competenze in economia, diritto, risorse umane e interculturalità.</p>
              <p>Ho conseguito tre lauree quinquennali (in Lingue, Economia e Filologia moderna) ed un master in Sviluppo e Gestione Etica delle Risorse Umane. Dal 2016 sono iscritto negli elenchi della Regione Emilia-Romagna come Esperto dei Processi Valutativi (EPV) e dal 2021 come Responsabile Formalizzazione Competenze (RFC).</p>
              <p>Dal 2022 sono in possesso dell'attestazione di qualità e qualificazione professionale in qualità di <b>Progettista della Formazione</b> ai sensi della l. 04/2013.</p>
              <p>Mi occupo di formazione da 15 anni e collaboro con associazioni, enti formativi ed aziende a carattere nazionale e territoriale.</p>
              <p>La mia missione è supportare organizzazioni e professionisti nel navigare il complesso panorama della formazione finanziata, dell'europrogettazione e dello sviluppo strategico, trasformando opportunità in risultati concreti.</p>
            </div>

            {/* LinkedIn posts */}
            {linkedinPosts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  <span className="font-semibold text-foreground text-sm">Ultimi post su LinkedIn</span>
                </div>
                <div className="space-y-3">
                  {linkedinPosts.map((post, idx) => (
                    <a
                      key={idx}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg border border-border bg-background hover:border-[#0A66C2]/40 hover:shadow-sm transition-all"
                    >
                      <p className="text-xs text-foreground/40 mb-2">{post.data}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{post.testo}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-[#0A66C2] font-semibold">
                        Leggi su LinkedIn <ArrowRight className="w-3 h-3" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Servizi Section */}
      <section id="servizi" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-3 text-foreground">I Miei Servizi</h2>
          <p className="text-lg text-foreground/70 mb-10 max-w-2xl">Offro una gamma completa di servizi specializzati per supportare la crescita e lo sviluppo della tua organizzazione.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const serviceLinks = ["/servizi/fondi-interprofessionali", "/servizi/europrogettazione", "/servizi/qualifiche-regolamentate", "/servizi/finanza-agevolata"];
              return (
                <a href={serviceLinks[idx]} key={idx}>
                  <Card className="p-5 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 bg-card border-border cursor-pointer h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${service.color} w-10 h-10 shrink-0 rounded-lg flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
                      <h3 className="text-xl font-bold text-foreground leading-snug">{service.title}</h3>
                    </div>
                    <p className="text-foreground/70 leading-relaxed text-sm">{service.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-primary font-semibold text-sm"><span>Scopri di più</span><ArrowRight className="w-4 h-4" /></div>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Opportunità Section */}
      <section id="opportunita" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-3 text-foreground">Ultime Opportunità</h2>
          <p className="text-lg text-foreground/70 mb-10 max-w-2xl">Scopri gli ultimi bandi aperti e in apertura nei prossimi 3 mesi.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-4 px-4 font-bold text-foreground">Fondo</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Avviso / Titolo</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Apertura</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Scadenza</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Stato</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Azione</th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">Contatto</th>
                </tr>
              </thead>
              <tbody>
                {bandiLoading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-foreground/70">Caricamento opportunità...</td></tr>
                ) : bandi && bandi.length > 0 ? (
                  bandi.map((bando: any, idx: number) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 text-foreground font-semibold">{bando.fondo}</td>
                      <td className="py-4 px-4 text-foreground">{bando.titolo}</td>
                      <td className="py-4 px-4 text-foreground/80 text-sm whitespace-nowrap">
                        {bando.stato === "Aperto" ? (
                          <span className="text-green-700 dark:text-green-400 font-medium">Già aperto</span>
                        ) : (
                          bando.apertura
                        )}
                      </td>
                      <td className="py-4 px-4 text-foreground">{bando.scadenza}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatoBadgeColor(bando.stato)}`}>
                          {bando.stato}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={bando.link}
                          onClick={openInSizedWindow(bando.link)}
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold cursor-pointer"
                        >
                          <span>Vedi</span><ArrowRight className="w-4 h-4" />
                        </a>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setContactModal(bando)}
                          title="Richiedi informazioni su questo bando"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="text-center py-8 text-foreground/70">Nessuna opportunità disponibile al momento.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-3 text-foreground">Ultime News</h2>
          <p className="text-lg text-foreground/70 mb-10 max-w-2xl">Rimani aggiornato sugli ultimi sviluppi nel panorama della formazione e dello sviluppo aziendale.</p>
          <div className="space-y-4">
            {newsLoading && !staticNews ? (
              <p className="text-foreground/70">Caricamento news...</p>
            ) : displayNews && displayNews.length > 0 ? (
              displayNews.map((news: any, idx: number) => (
                <div key={idx} className="relative">
                  <div
                    className="block cursor-pointer"
                    onClick={() => setNewsModal(news)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setNewsModal(news); }}
                  >
                    <div className="border-l-4 border-primary pl-6 py-4 hover:bg-muted/50 transition-colors rounded-r-lg">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="text-sm font-semibold text-primary">{news.entity}</p>
                        {news.date && <span className="text-xs text-foreground/40">{news.date}</span>}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{news.title}</h3>
                      <p className="text-foreground/70 text-sm">{news.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-primary text-sm font-semibold">
                        <span>Leggi</span><ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4"><ShareButton news={news} /></div>
                </div>
              ))
            ) : (
              <p className="text-foreground/70">Nessuna news disponibile al momento.</p>
            )}
          </div>
          <div className="mt-10">
            <a
              href="/archivio-news"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Vai all'archivio news <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Contatti Section */}
      <section id="contatti" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-3 text-foreground">Contattami</h2>
            <p className="text-lg text-foreground/70 mb-10">Hai una domanda o desideri discutere di un progetto? Sono disponibile per una consulenza personalizzata.</p>
            <form onSubmit={handleContactSubmit} className="space-y-6 mb-10">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nome Completo *</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Il tuo nome" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Azienda / Ente</label>
                <input type="text" value={azienda} onChange={(e) => setAzienda(e.target.value)} placeholder="Nome azienda o ente (opzionale)" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tua.email@example.com" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Telefono</label>
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+39 XXX XXX XXXX" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!consenso}>Invia Messaggio</Button>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consenso-home"
                  checked={consenso}
                  onChange={(e) => setConsenso(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-primary cursor-pointer shrink-0"
                  required
                />
                <label htmlFor="consenso-home" className="text-sm text-foreground/60 leading-relaxed cursor-pointer">
                  Ho letto e accetto la{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </a>{" "}
                  e acconsento al trattamento dei miei dati personali per rispondere alla mia richiesta. *
                </label>
              </div>
              {submitted && <p className="text-center text-primary font-semibold">Grazie! Ti contatterò al più presto.</p>}
            </form>
            <div className="flex gap-6 justify-center">
              <a href="mailto:info@mannarella.com" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"><Mail className="w-5 h-5" /><span>Email</span></a>
              <a href="https://www.linkedin.com/in/mannarella" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"><Linkedin className="w-5 h-5" /><span>LinkedIn</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 mb-4 flex justify-center"><img src="/images/logo.png" alt="Logo" className="h-full object-contain" /></div>
          <p className="text-foreground/70 mb-4">Esperto in progettazione e consulenza strategica</p>
          <p className="text-foreground/60 text-sm">&copy; 2026 Giovanni Mannarella. Tutti i diritti riservati.</p>
          <p className="text-foreground/50 text-xs mt-2">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
