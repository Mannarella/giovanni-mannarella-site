import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Loader2, AlertTriangle } from "lucide-react";

/**
 * ExternalLinkModal
 * Apre i link esterni in un modale con iframe incorporato.
 * Se il sito blocca il caricamento (X-Frame-Options / CSP),
 * mostra automaticamente un messaggio di fallback con link diretto.
 *
 * Utilizzo:
 *   const [modal, setModal] = useState<{ url: string; title: string } | null>(null);
 *   <ExternalLinkModal modal={modal} onClose={() => setModal(null)} />
 *   <button onClick={() => setModal({ url: "https://...", title: "Nome sito" })}>Apri</button>
 */

interface ExternalLinkModalProps {
  modal: { url: string; title: string } | null;
  onClose: () => void;
}

export default function ExternalLinkModal({ modal, onClose }: ExternalLinkModalProps) {
  const [iframeState, setIframeState] = useState<"loading" | "loaded" | "blocked">("loading");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state ogni volta che il modal cambia URL
  useEffect(() => {
    if (!modal) return;
    setIframeState("loading");

    // Timeout di 7 secondi: se l'iframe non risponde, molto probabilmente è bloccato
    timeoutRef.current = setTimeout(() => {
      setIframeState("blocked");
    }, 7000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [modal?.url]);

  // Chiudi con ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Blocca lo scroll del body quando il modal è aperto
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Controlla se l'iframe ha contenuto reale o è vuoto/bloccato
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc || doc.body?.innerHTML === "") {
        setIframeState("blocked");
      } else {
        setIframeState("loaded");
      }
    } catch {
      // SecurityError = cross-origin con contenuto reale: l'iframe ha caricato
      setIframeState("loaded");
    }
  };

  const handleIframeError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIframeState("blocked");
  };

  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Sito esterno: ${modal.title}`}
    >
      {/* Overlay scuro */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenitore modale */}
      <div className="relative w-[92vw] h-[88vh] max-w-5xl bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden border border-border">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <ExternalLink className="w-4 h-4 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate">{modal.title}</span>
            <span className="text-foreground/40 text-xs truncate hidden sm:block">— {modal.url}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/60 hover:text-foreground shrink-0 ml-2"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-hidden">

          {/* Stato: caricamento */}
          {iframeState === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-foreground/60 text-sm">Caricamento di <strong>{modal.title}</strong>…</p>
            </div>
          )}

          {/* Stato: bloccato / fallback */}
          {iframeState === "blocked" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-background z-10 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="max-w-sm space-y-2">
                <h3 className="text-lg font-bold text-foreground">
                  Il sito non può essere incorporato
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  <strong>{modal.title}</strong> non consente la visualizzazione all'interno di altri siti
                  per motivi di sicurezza. Puoi aprirlo direttamente in una nuova scheda.
                </p>
              </div>
              <a
                href={modal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Apri {modal.title}
              </a>
            </div>
          )}

          {/* Iframe — sempre montato per rilevare il caricamento */}
          <iframe
            ref={iframeRef}
            src={modal.url}
            title={modal.title}
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              iframeState === "loaded" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Footer — visibile solo quando l'iframe è caricato */}
        {iframeState === "loaded" && (
          <div className="shrink-0 px-5 py-2 border-t border-border bg-card flex items-center justify-between text-xs text-foreground/50">
            <span>Stai visualizzando un sito esterno</span>
            <a
              href={modal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Apri in nuova scheda <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
