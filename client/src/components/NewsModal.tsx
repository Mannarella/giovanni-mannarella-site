import { useEffect, useState } from "react";
import { X, Download, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NewsItem {
  title: string;
  description: string;
  content?: string;
  date?: string;
  entity: string;
  link?: string;
}

interface Props {
  news: NewsItem | null;
  onClose: () => void;
}

const MESI_IT = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  return `${day} ${MESI_IT[month - 1]} ${year}`;
}

export default function NewsModal({ news, onClose }: Props) {
  const [formData, setFormData] = useState({ nome: "", email: "", telefono: "" });
  const [submitted, setSubmitted] = useState(false);

  // Chiudi con ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Blocca scroll body
  useEffect(() => {
    if (news) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [news]);

  // Reset form when modal opens
  useEffect(() => {
    if (news) {
      setFormData({ nome: "", email: "", telefono: "" });
      setSubmitted(false);
    }
  }, [news]);

  if (!news) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Richiesta informazioni – ${news.title}`;
    const body = `Nome: ${formData.nome}\nEmail: ${formData.email}${formData.telefono ? `\nTelefono: ${formData.telefono}` : ""}\nRichiesta informazioni su: ${news.title}`;
    window.location.href = `mailto:info@mannarella.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const dateStr = news.date ? formatDate(news.date) : "";
    const bodyText = news.content || news.description;
    const contentHtml = bodyText
      .split("\n")
      .map((p) => p.trim() ? `<p>${p}</p>` : "<br/>")
      .join("");

    printWindow.document.write(`<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>${news.title}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.8; }
    h1 { font-size: 22px; margin-bottom: 6px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 32px; border-bottom: 1px solid #ddd; padding-bottom: 16px; }
    p { margin: 0 0 14px; }
    @media print { body { margin: 20mm 20mm; } }
  </style>
</head>
<body>
  <h1>${news.title}</h1>
  <p class="meta">${news.entity}${dateStr ? " &mdash; " + dateStr : ""}</p>
  ${contentHtml}
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`);
    printWindow.document.close();
  };

  const paragraphs = (news.content || news.description).split("\n").filter((p) => p.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-background rounded-xl shadow-2xl flex flex-col border border-border overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{news.entity}</p>
            <h2 className="text-lg font-bold text-foreground leading-snug">{news.title}</h2>
            {news.date && (
              <p className="text-xs text-foreground/50 mt-1">{formatDate(news.date)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/60 hover:text-foreground shrink-0"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Contenuto notizia */}
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Link esterno opzionale */}
          {news.link && (
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Vai alla fonte originale
            </a>
          )}

          {/* Divider */}
          <div className="border-t border-border pt-6">
            <h3 className="text-base font-bold text-foreground mb-1">Richiedi informazioni</h3>
            <p className="text-sm text-foreground/60 mb-5">Hai domande su questa notizia? Compilа il form e ti risponderò al più presto.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Richiesta informazioni su</label>
                <input
                  type="text"
                  value={news.title}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground/60 text-sm cursor-not-allowed"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Il tuo nome"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tua@email.com"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Telefono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+39 XXX XXX XXXX"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Invia <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                {submitted && <p className="text-sm text-primary font-semibold">Grazie! Ti risponderò presto.</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-3 border-t border-border bg-card flex items-center justify-end">
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Scarica PDF
          </button>
        </div>
      </div>
    </div>
  );
}
