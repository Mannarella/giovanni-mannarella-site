import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, ArrowRight, BookOpen, Briefcase, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Modern Minimalist Design with Warm Accents
 * Color Palette: Warm Cream, Terracotta Accents, Sage Green, Deep Charcoal
 * Typography: Playfair Display (headings), Inter (body)
 */

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const handleOpportunityClick = (url: string) => {
    window.open(url, '_blank');
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
      description: "Gestione percorsi formativi per qualifiche nazionali e regionali con caricamento su piattaforma SIFER.",
      color: "bg-[oklch(0.72_0.08_15)]",
    },
    {
      icon: Zap,
      title: "Finanza Agevolata",
      description: "Supporto nella progettazione di iniziative di finanza agevolata con analisi tecnico-economiche complete.",
      color: "bg-[oklch(0.65_0.15_35)]",
    },
  ];

  const expertise = [
    "Analisi dei fabbisogni formativi",
    "Coordinamento progetti complessi",
    "Rendicontazione e compliance",
    "Business Development",
    "Consulenza organizzativa",
    "Docenza specializzata",
  ];

  const { data: newsData, isLoading: newsLoading } = trpc.news.latest.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="h-12 flex items-center">
            <img src="/images/logo.png" alt="Giovanni Mannarella Logo" className="h-full object-contain" />
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#servizi" className="text-foreground hover:text-primary transition-colors">
              Servizi
            </a>
            <a href="#competenze" className="text-foreground hover:text-primary transition-colors">
              Competenze
            </a>
            <a href="#opportunita" className="text-foreground hover:text-primary transition-colors">
              Opportunità
            </a>
            <a href="#contatti" className="text-foreground hover:text-primary transition-colors">
              Contatti
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/hero-background.png"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Progettazione e Consulenza Strategica
            </h1>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              Supporto specializzato nella progettazione di iniziative formative, europrogettazione e sviluppo aziendale. Con oltre 15 anni di esperienza, trasformo idee in progetti vincenti.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => document.getElementById("contatti")?.scrollIntoView({ behavior: "smooth" })}
              >
                Richiedi Consulenza
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Scopri di più
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chi Sono Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-foreground">Chi Sono</h2>
            <div className="space-y-6 text-lg text-foreground/80">
              <p>
                Sono Giovanni Mannarella, esperto in progettazione formativa, europrogettazione e consulenza aziendale. La mia formazione multidisciplinare combina competenze in economia, diritto, risorse umane e interculturalità.
              </p>
              <p>
                Ho conseguito due lauree quinquennali e un master in Sviluppo e Gestione Etica delle Risorse Umane. Dal 2016 sono iscritto negli elenchi della Regione Emilia-Romagna come Esperto dei Processi Valutativi (EPV) e dal 2021 come Responsabile Formalizzazione Competenze (RFC).
              </p>
              <p>
                La mia missione è supportare organizzazioni e professionisti nel navigare il complesso panorama della formazione finanziata, dell'europrogettazione e dello sviluppo strategico, trasformando opportunità in risultati concreti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servizi Section */}
      <section id="servizi" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-foreground">I Miei Servizi</h2>
          <p className="text-lg text-foreground/70 mb-16 max-w-2xl">
            Offro una gamma completa di servizi specializzati per supportare la crescita e lo sviluppo della tua organizzazione.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const serviceLinks = [
                { title: "Progettazione Fondi Interprofessionali", path: "/servizi/fondi-interprofessionali" },
                { title: "Europrogettazione", path: "/servizi/europrogettazione" },
                { title: "Qualifiche Regolamentate", path: "/servizi/qualifiche-regolamentate" },
                { title: "Finanza Agevolata", path: "/servizi/finanza-agevolata" },
              ];
              const link = serviceLinks[idx]?.path || "#";
              return (
                <a href={link} key={idx}>
                  <Card
                    className="p-8 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 bg-card border-border cursor-pointer h-full"
                  >
                    <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{service.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">{service.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-primary font-semibold">
                      <span>Scopri di più</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>

          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 md:p-12 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Servizi Aggiuntivi</h3>
            <div className="grid md:grid-cols-2 gap-6 text-foreground/80">
              <div>
                <p className="font-semibold text-foreground mb-2">Attività di Docenza</p>
                <p>Insegnamento specializzato in organizzazione aziendale, diritto del lavoro e metodologie didattiche.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Certificazione Competenze</p>
                <p>Formalizzazione e certificazione delle competenze attraverso valutazione personalizzata.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competenze Section */}
      <section id="competenze" className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-foreground">Competenze Chiave</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {expertise.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-lg text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunità Section */}
      <section id="opportunita" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Ultime Opportunità</h2>
          <p className="text-lg text-foreground/70 mb-16 max-w-2xl">
            Rimani aggiornato sugli ultimi bandi, avvisi e opportunità di finanziamento nel panorama della formazione e dello sviluppo aziendale.
          </p>

          <div className="space-y-6">
            {newsLoading ? (
              <p className="text-foreground/70">Caricamento opportunità...</p>
            ) : newsData && newsData.length > 0 ? (
              newsData.map((news: any, idx: number) => (
                <a
                  key={idx}
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="border-l-4 border-primary pl-6 py-4 hover:bg-muted/50 transition-colors rounded-r-lg cursor-pointer">
                    <p className="text-sm font-semibold text-primary mb-2">{news.entity}</p>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{news.title}</h3>
                    <p className="text-foreground/70">{news.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-primary text-sm font-semibold">
                      <span>Leggi su {news.entity}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-foreground/70">Nessuna opportunità disponibile al momento.</p>
            )}
          </div>

          <div className="mt-12 p-8 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-foreground/80 mb-4">
              Vuoi ricevere aggiornamenti sulle nuove opportunità? Iscriviti alla newsletter per rimanere sempre informato sui bandi e le iniziative più rilevanti.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Iscriviti agli Aggiornamenti
            </Button>
          </div>
        </div>
      </section>

      {/* Contatti Section */}
      <section id="contatti" className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-foreground">Contattami</h2>
            <p className="text-lg text-foreground/70 mb-12">
              Hai una domanda o desideri discutere di un progetto? Sono disponibile per una consulenza personalizzata. Contattami via email o tramite i miei profili professionali.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-6 mb-12">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  La tua Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tua.email@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Invia Messaggio
              </Button>
              {submitted && (
                <p className="text-center text-primary font-semibold">
                  Grazie! Ti contatterò al più presto.
                </p>
              )}
            </form>

            <div className="flex gap-6 justify-center">
              <a
                href="mailto:info@mannarella.com"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
              <a
                href="https://www.linkedin.com/in/mannarella"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="h-10 mb-4">
                  <img src="/images/logo.png" alt="Giovanni Mannarella Logo" className="h-full object-contain" />
                </div>
                <p className="text-foreground/70">Esperto in progettazione e consulenza strategica</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Servizi</h4>
                <ul className="space-y-2 text-foreground/70">
                  <li><a href="#servizi" className="hover:text-primary transition-colors">Fondi Interprofessionali</a></li>
                  <li><a href="#servizi" className="hover:text-primary transition-colors">Europrogettazione</a></li>
                  <li><a href="#servizi" className="hover:text-primary transition-colors">Finanza Agevolata</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contatti</h4>
                <ul className="space-y-2 text-foreground/70">
                  <li><a href="mailto:info@mannarella.com" className="hover:text-primary transition-colors">Email</a></li>
                  <li><a href="https://www.linkedin.com/in/mannarella" className="hover:text-primary transition-colors">LinkedIn</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-foreground/60 text-sm">
              <p>&copy; 2026 Giovanni Mannarella. Tutti i diritti riservati.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
