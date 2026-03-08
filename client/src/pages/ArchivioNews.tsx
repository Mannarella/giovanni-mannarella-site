import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NewsModal, { NewsItem } from "@/components/NewsModal";

function sortByDate(news: NewsItem[]): NewsItem[] {
  return [...news].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

const MESI_IT = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  return `${day} ${MESI_IT[month - 1]} ${year}`;
}

export default function ArchivioNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetch("/news.json")
      .then(res => res.json())
      .then(data => {
        setNews(sortByDate(data));
        setLoading(false);
      })
      .catch(() => {
        setNews([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Torna alla Home</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Archivio News
          </h1>
          <p className="text-lg text-foreground/70 mb-10 max-w-2xl">
            Tutte le notizie e gli aggiornamenti su formazione finanziata,
            europrogettazione e sviluppo aziendale.
          </p>

          {loading ? (
            <p className="text-foreground/70">Caricamento news...</p>
          ) : news.length === 0 ? (
            <p className="text-foreground/70">
              Nessuna news disponibile al momento.
            </p>
          ) : (
            <div className="space-y-4">
              {news.map((item, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-primary pl-6 py-4 hover:bg-muted/50 transition-colors rounded-r-lg cursor-pointer"
                  onClick={() => setSelectedNews(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedNews(item);
                  }}
                >
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-primary">
                      {item.entity}
                    </p>
                    {item.date && (
                      <span className="text-xs text-foreground/40">
                        {formatDate(item.date)}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {item.title}
                  </h2>
                  <p className="text-foreground/70 text-sm">
                    {item.description}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 text-primary text-sm font-semibold">
                    <span>Leggi</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12 mt-auto">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>&copy; 2026 Giovanni Mannarella. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
