import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const clean = apertura.toLowerCase().replace(/^da[l]?\s+/, "").trim();
  const parts = clean.split(/\s+/);
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = MESI_IT[parts[1]];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(year, month, day);
}

/**
 * Estrae la regione dal fondo o dal titolo
 */
function extractRegione(bando: any): string {
  const regioni = [
    "Emilia-Romagna",
    "Veneto",
    "Toscana",
    "Calabria",
    "Sicilia",
    "Lombardia",
    "Piemonte",
    "Campania",
    "Lazio",
    "Puglia",
  ];

  for (const regione of regioni) {
    if (
      bando.fondo.toLowerCase().includes(regione.toLowerCase()) ||
      bando.titolo.toLowerCase().includes(regione.toLowerCase())
    ) {
      return regione;
    }
  }

  return "Nazionale";
}

/**
 * Estrae la tipologia di finanziamento dal fondo e dal titolo
 */
function extractTipologia(bando: any): string {
  const fondo = bando.fondo.toLowerCase();
  const titolo = bando.titolo.toLowerCase();
  const combined = fondo + " " + titolo;

  if (combined.includes("formazione") || combined.includes("fse")) {
    return "Formazione";
  }
  if (combined.includes("fesr") || combined.includes("investimento")) {
    return "Investimento / FESR";
  }
  if (combined.includes("fondo perduto") || combined.includes("voucher")) {
    return "Fondo Perduto";
  }
  if (combined.includes("credito")) {
    return "Credito d'Imposta";
  }
  if (combined.includes("interprofessionale") || combined.includes("fon")) {
    return "Fondo Interprofessionale";
  }

  return "Altro";
}

/**
 * Determina la categoria di scadenza
 */
function extractScadenzaCategory(scadenza: string): string {
  const lower = scadenza.toLowerCase();

  if (
    lower.includes("esaurimento") ||
    lower.includes("in corso") ||
    lower === "aperto"
  ) {
    return "Senza scadenza";
  }

  // Prova a parsare la data di scadenza
  let scadenzaDate: Date | null = null;

  // Formato: "23 mag 2026"
  const parts = lower.split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = MESI_IT[parts[1]];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      scadenzaDate = new Date(year, month, day);
    }
  }

  // Formato: "29/05/2026"
  if (!scadenzaDate && lower.includes("/")) {
    const dateParts = lower.split("/");
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        scadenzaDate = new Date(year, month, day);
      }
    }
  }

  if (!scadenzaDate) {
    return "Senza scadenza";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = scadenzaDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) {
    return "Scade entro 30 giorni";
  } else if (diffDays <= 90) {
    return "Scade entro 90 giorni";
  } else {
    return "Scade dopo 90 giorni";
  }
}

// ---------------------------------------------------------------------------

export default function ArchivioOpportunita() {
  const [bandi, setBandi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModal, setContactModal] = useState<any | null>(null);
  const [popupNome, setPopupNome] = useState("");
  const [popupCognome, setPopupCognome] = useState("");
  const [popupAzienda, setPopupAzienda] = useState("");
  const [popupEmail, setPopupEmail] = useState("");
  const [popupTelefono, setPopupTelefono] = useState("");
  const [popupConsenso, setPopupConsenso] = useState(false);
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [popupError, setPopupError] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);

  // Filtri
  const [selectedRegione, setSelectedRegione] = useState<string>("Tutti");
  const [selectedTipologia, setSelectedTipologia] = useState<string>("Tutti");
  const [selectedScadenza, setSelectedScadenza] = useState<string>("Tutti");

  useEffect(() => {
    fetch("/bandi.json")
      .then((res) => res.json())
      .then((data) => {
        setBandi(data);
        setLoading(false);
      })
      .catch(() => {
        setBandi([]);
        setLoading(false);
      });
  }, []);

  // Estrai opzioni uniche per i filtri
  const regioni = Array.from(
    new Set(bandi.map((b) => extractRegione(b)))
  ).sort();
  const tipologie = Array.from(
    new Set(bandi.map((b) => extractTipologia(b)))
  ).sort();
  const scadenze = Array.from(
    new Set(bandi.map((b) => extractScadenzaCategory(b.scadenza)))
  ).sort();

  // Filtra i bandi in base ai criteri selezionati
  const filteredBandi = bandi.filter((bando) => {
    const regione = extractRegione(bando);
    const tipologia = extractTipologia(bando);
    const scadenza = extractScadenzaCategory(bando.scadenza);

    if (selectedRegione !== "Tutti" && regione !== selectedRegione)
      return false;
    if (selectedTipologia !== "Tutti" && tipologia !== selectedTipologia)
      return false;
    if (selectedScadenza !== "Tutti" && scadenza !== selectedScadenza)
      return false;

    return true;
  });

  const getStatoBadgeColor = (stato: string) => {
    if (stato === "Aperto") return "bg-green-100 text-green-800";
    if (stato === "In apertura") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const openInSizedWindow = (url: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const width = 980;
    const height = 720;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
    window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height},left=${Math.floor(left)},top=${Math.floor(top)}`);
  };

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupEmail || !popupConsenso || !popupNome || !popupCognome) return;
    setPopupError(false);
    setPopupLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bando",
          nome: popupNome,
          cognome: popupCognome,
          azienda: popupAzienda,
          email: popupEmail,
          telefono: popupTelefono,
          fondo: contactModal?.fondo,
          titoloBando: contactModal?.titolo,
        }),
      });
      if (!res.ok) throw new Error();
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
    } catch {
      setPopupError(true);
    } finally {
      setPopupLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedRegione("Tutti");
    setSelectedTipologia("Tutti");
    setSelectedScadenza("Tutti");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Popup ricontatto bando */}
      {contactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setContactModal(null);
          }}
        >
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
              <div>
                <p className="text-xs text-foreground/50 uppercase tracking-wide font-semibold mb-1">
                  Richiesta di contatto
                </p>
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  Vorrei essere ricontattato per approfondire il{" "}
                  <span className="text-primary">
                    {contactModal.fondo} — {contactModal.titolo}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setContactModal(null)}
                className="shrink-0 mt-1 p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground/60 hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handlePopupSubmit} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={popupNome}
                  onChange={(e) => setPopupNome(e.target.value)}
                  placeholder="Il tuo nome"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Cognome *
                </label>
                <input
                  type="text"
                  value={popupCognome}
                  onChange={(e) => setPopupCognome(e.target.value)}
                  placeholder="Il tuo cognome"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Azienda / Ente
                </label>
                <input
                  type="text"
                  value={popupAzienda}
                  onChange={(e) => setPopupAzienda(e.target.value)}
                  placeholder="Nome azienda o ente (opzionale)"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={popupEmail}
                  onChange={(e) => setPopupEmail(e.target.value)}
                  placeholder="tua.email@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={popupTelefono}
                  onChange={(e) => setPopupTelefono(e.target.value)}
                  placeholder="+39 XXX XXX XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consenso-popup"
                  checked={popupConsenso}
                  onChange={(e) => setPopupConsenso(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-primary cursor-pointer shrink-0"
                  required
                />
                <label
                  htmlFor="consenso-popup"
                  className="text-sm text-foreground/60 leading-relaxed cursor-pointer"
                >
                  Ho letto e accetto la{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </a>{" "}
                  e acconsento al trattamento dei miei dati personali per rispondere alla mia
                  richiesta. *
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!popupConsenso || popupLoading}
              >
                {popupLoading ? "Invio in corso..." : "Invia Richiesta"}
              </Button>
              {popupSubmitted && (
                <p className="text-center text-primary font-semibold">
                  Grazie! Ti contatterò al più presto.
                </p>
              )}
              {popupError && (
                <p className="text-center text-red-600 text-sm">
                  Si è verificato un errore. Riprova o scrivici a{" "}
                  <a href="mailto:info@mannarella.com" className="underline">
                    info@mannarella.com
                  </a>
                  .
                </p>
              )}
            </form>
          </div>
        </div>
      )}

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
            Tutte le Opportunità di Finanziamento
          </h1>
          <p className="text-lg text-foreground/70 mb-10 max-w-2xl">
            Scopri l'elenco completo dei bandi aperti e in apertura. Utilizza i filtri per
            trovare le opportunità più adatte alla tua impresa.
          </p>

          {/* Filtri */}
          <div className="mb-10 p-6 bg-card border border-border rounded-lg">
            <h2 className="text-lg font-bold text-foreground mb-4">Filtra per:</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Regione
                </label>
                <Select value={selectedRegione} onValueChange={setSelectedRegione}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona regione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tutti">Tutte le regioni</SelectItem>
                    {regioni.map((regione) => (
                      <SelectItem key={regione} value={regione}>
                        {regione}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Tipologia di Finanziamento
                </label>
                <Select value={selectedTipologia} onValueChange={setSelectedTipologia}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona tipologia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tutti">Tutte le tipologie</SelectItem>
                    {tipologie.map((tipologia) => (
                      <SelectItem key={tipologia} value={tipologia}>
                        {tipologia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Scadenza
                </label>
                <Select value={selectedScadenza} onValueChange={setSelectedScadenza}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona scadenza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tutti">Tutte le scadenze</SelectItem>
                    {scadenze.map((scadenza) => (
                      <SelectItem key={scadenza} value={scadenza}>
                        {scadenza}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={resetFilters}
              variant="outline"
              className="text-foreground border-border hover:bg-muted"
            >
              Azzera filtri
            </Button>
          </div>

          {/* Tabella Bandi */}
          {loading ? (
            <p className="text-foreground/70">Caricamento opportunità...</p>
          ) : filteredBandi.length === 0 ? (
            <p className="text-foreground/70">
              Nessuna opportunità corrisponde ai filtri selezionati.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-4 px-4 font-bold text-foreground">Fondo</th>
                    <th className="text-left py-4 px-4 font-bold text-foreground">
                      Avviso / Titolo
                    </th>
                    <th className="text-left py-4 px-4 font-bold text-foreground">Apertura</th>
                    <th className="text-left py-4 px-4 font-bold text-foreground">Scadenza</th>
                    <th className="text-left py-4 px-4 font-bold text-foreground">Stato</th>
                    <th className="text-left py-4 px-4 font-bold text-foreground">Azione</th>
                    <th className="text-center py-4 px-4 font-bold text-foreground">Contatto</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBandi.map((bando: any, idx: number) => (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-foreground font-semibold">{bando.fondo}</td>
                      <td className="py-4 px-4 text-foreground">{bando.titolo}</td>
                      <td className="py-4 px-4 text-foreground/80 text-sm whitespace-nowrap">
                        {bando.stato === "Aperto" ? (
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            Già aperto
                          </span>
                        ) : (
                          bando.apertura
                        )}
                      </td>
                      <td className="py-4 px-4 text-foreground">{bando.scadenza}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatoBadgeColor(
                            bando.stato
                          )}`}
                        >
                          {bando.stato}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={bando.link}
                          onClick={openInSizedWindow(bando.link)}
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold cursor-pointer"
                        >
                          <span>Vedi</span>
                          <ArrowRight className="w-4 h-4" />
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
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Statistiche */}
          {!loading && (
            <div className="mt-10 p-4 bg-muted/50 rounded-lg text-foreground/70 text-sm">
              <p>
                Mostrando <strong>{filteredBandi.length}</strong> di{" "}
                <strong>{bandi.length}</strong> opportunità disponibili.
              </p>
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
