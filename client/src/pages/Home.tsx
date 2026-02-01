import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, ArrowRight, BookOpen, Briefcase, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import ShareButton from "@/components/ShareButton";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
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
      title: "Qualifiche Regolamentate",
      description: "Gestione percorsi formativi per qualifiche nazionali e regionali con caricamento su piattaforme dedicate.",
      color: "bg-[oklch(0.72_0.08_15)]",
    },
    {
      icon: Zap,
      title: "Finanza Agevolata",
      description: "Supporto nella progettazione di iniziative di finanza agevolata con analisi tecnico-economiche complete.",
      color: "bg-[oklch(0.65_0.15_35)]",
    },
  ];

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
        const activeBandi = data.filter((b: any) => b.stato === "Aperto").slice(0, 5);
        setBandi(activeBandi);
        setBandiLoading(false);
      })
      .catch(() => {
        setBandi([]);
        setBandiLoading(false);
      });
  }, []);

  const displayNews = newsData && newsData.length > 0 ? newsData : staticNews;

  const getStatoBadgeColor = (stato: string) => {
    return stato === "Aperto" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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

      {/* Hero Section - Ridotto drasticamente il padding verticale (py-12 invece di py-24) */}
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

      {/* Chi Sono Section - Ridotto il padding superiore per avvicinarlo alla Hero */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-foreground">Chi Sono</h2>
            <div className="space-y-6 text-lg text-foreground/80">
              <p>Sono Giovanni Mannarella, esperto in progettazione formativa, europrogettazione e consulenza aziendale. La mia formazione multidisciplinare combina competenze in economia, diritto, risorse umane e interculturalità.</p>
              <p>Ho conseguito due lauree quinquennali e un master in Sviluppo e Gestione Etica delle Risorse Umane. Dal 2016 sono iscritto negli elenchi della Regione Emilia-Romagna come Esperto dei Processi Valutativi (EPV) e dal 2021 come Responsabile Formalizzazione Competenze (RFC).</p>
              <p>La mia missione è supportare organizzazioni e professionisti nel navigare il complesso panorama della formazione finanziata, dell'europrogettazione e dello sviluppo strategico, trasformando opportunità in risultati concreti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servizi Section - Box più bassi (p-6 invece di p-8) e margini ridotti */}
      <section id="servizi" className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-foreground">I Miei Servizi</h2>
          <p className="text-lg text-foreground/70 mb-10 max-w-2xl">Offro una gamma completa di servizi specializzati per supportare la crescita e lo sviluppo della tua organizzazione.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const serviceLinks = ["/servizi/fondi-interprofessionali", "/servizi/europrogettazione", "/servizi/qualifiche-regolamentate", "/servizi/finanza-agevolata"];
              return (
                <a href={serviceLinks[idx]} key={idx}>
                  <Card className="p-6 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 bg-card border-border cursor-pointer h-full">
                    <div className={`${service.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}><Icon className="w-5 h-5 text-white" /></div>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{service.title}</h3>
                    <p className="text-foreground/70 leading-relaxed text-sm">{service.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm"><span>Scopri di più</span><ArrowRight className="w-4 h-4" /></div>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Opportunità Section - Mantenuta originale py-20 md:py-28 */}
      <section id="opportunita" className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Ultime Opportunità</h2>
          <p className="text-lg text-foreground/70 mb-16 max-w-2xl">Scopri gli ultimi bandi aperti per la formazione finanziata e le iniziative di sviluppo aziendale.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-4 px-4 font-bold text-foreground">Fondo</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Avviso / Titolo</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Scadenza</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Stato</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Azione</th>
                </tr>
              </thead>
              <tbody>
                {bandiLoading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-foreground/70">Caricamento opportunità...</td></tr>
                ) : bandi && bandi.length > 0 ? (
                  bandi.map((bando: any, idx: number) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 text-foreground font-semibold">{bando.fondo}</td>
                      <td className="py-4 px-4 text-foreground">{bando.titolo}</td>
                      <td className="py-4 px-4 text-foreground">{bando.scadenza}</td>
                      <td className="py-4 px-4"><span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatoBadgeColor(bando.stato)}`}>{bando.stato}</span></td>
                      <td className="py-4 px-4">
                        <a href={bando.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold">
                          <span>Vedi</span><ArrowRight className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="text-center py-8 text-foreground/70">Nessuna opportunità disponibile al momento.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* News Section - Mantenuta originale py-20 md:py-28 */}
      <section id="news" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Ultime News</h2>
          <p className="text-lg text-foreground/70 mb-16 max-w-2xl">Rimani aggiornato sugli ultimi sviluppi nel panorama della formazione e dello sviluppo aziendale.</p>
          <div className="space-y-6">
            {newsLoading && !staticNews ? (
              <p className="text-foreground/70">Caricamento news...</p>
            ) : displayNews && displayNews.length > 0 ? (
              displayNews.map((news: any, idx: number) => (
                <div key={idx} className="relative">
                  <a href={news.link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="border-l-4 border-primary pl-6 py-4 hover:bg-muted/50 transition-colors rounded-r-lg cursor-pointer">
                      <p className="text-sm font-semibold text-primary mb-2">{news.entity}</p>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{news.title}</h3>
                      <p className="text-foreground/70">{news.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-primary text-sm font-semibold"><span>Leggi su {news.entity}</span><ArrowRight className="w-4 h-4" /></div>
                    </div>
                  </a>
                  <div className="absolute top-4 right-4"><ShareButton news={news} /></div>
                </div>
              ))
            ) : (
              <p className="text-foreground/70">Nessuna news disponibile al momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contatti Section */}
      <section id="contatti" className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-foreground">Contattami</h2>
            <p className="text-lg text-foreground/70 mb-12">Hai una domanda o desideri discutere di un progetto? Sono disponibile per una consulenza personalizzata.</p>
            <form onSubmit={handleContactSubmit} className="space-y-6 mb-12">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">La tua Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tua.email@example.com" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" required />
              </div>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Invia Messaggio</Button>
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
        </div>
      </footer>
    </div>
   );
}
