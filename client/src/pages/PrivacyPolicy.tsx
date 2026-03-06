import { ArrowLeft } from "lucide-react";

/**
 * Pagina Privacy Policy
 * Conforme GDPR (Reg. UE 2016/679) e linee guida Garante Privacy italiano.
 * Ultima revisione: marzo 2026
 *
 * NOTA: Personalizza i campi indicati con [INSERIRE] prima della pubblicazione.
 */

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Torna alla Home</span>
          </a>
        </div>
      </nav>

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">

          <h1 className="text-4xl font-bold mb-3 text-foreground">Privacy Policy</h1>
          <p className="text-sm text-foreground/50 mb-12">
            Informativa ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR) —
            Ultima revisione: marzo 2026
          </p>

          <div className="space-y-10 text-foreground/80 leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Titolare del trattamento</h2>
              <p>
                Il Titolare del trattamento dei dati personali è <strong>Giovanni Mannarella</strong>,
                con sede operativa in Romagna, Italia.
              </p>
              <p className="mt-3">
                Contatto e-mail del Titolare:{" "}
                <a href="mailto:info@mannarella.com" className="text-primary hover:underline">
                  info@mannarella.com
                </a>
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Dati raccolti e modalità di raccolta</h2>
              <p>
                Il presente sito web raccoglie i seguenti dati personali esclusivamente attraverso
                i moduli di contatto e di richiesta consulenza presenti nelle pagine del sito:
              </p>
              <ul className="mt-3 space-y-1 list-disc list-inside text-foreground/70">
                <li>Nome e cognome</li>
                <li>Indirizzo e-mail</li>
                <li>Numero di telefono</li>
                <li>Eventuali informazioni aggiuntive inserite liberamente nel campo messaggio</li>
              </ul>
              <p className="mt-3">
                I dati vengono trasmessi direttamente via e-mail al Titolare al momento dell'invio
                del modulo. Il sito non utilizza database propri per l'archiviazione dei dati
                degli utenti.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Finalità e base giuridica del trattamento</h2>
              <p>I dati personali sono trattati per le seguenti finalità:</p>
              <div className="mt-4 space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">Gestione delle richieste di contatto e consulenza</p>
                  <p className="text-sm mt-1">
                    Base giuridica: consenso dell'interessato (art. 6, par. 1, lett. a GDPR),
                    espresso mediante la compilazione e l'invio del modulo con selezione
                    dell'apposita casella di consenso.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">Esecuzione di misure precontrattuali</p>
                  <p className="text-sm mt-1">
                    Base giuridica: esecuzione di misure precontrattuali adottate su richiesta
                    dell'interessato (art. 6, par. 1, lett. b GDPR).
                  </p>
                </div>
              </div>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Conservazione dei dati</h2>
              <p>
                I dati personali forniti attraverso i moduli di contatto sono conservati per il
                tempo strettamente necessario a gestire la richiesta e, in caso di instaurazione
                di un rapporto professionale, per tutta la durata del rapporto e per i successivi
                10 anni ai fini di eventuali obblighi legali e fiscali.
              </p>
              <p className="mt-3">
                In assenza di un rapporto professionale, i dati vengono cancellati entro
                <strong> 24 mesi</strong> dalla ricezione della richiesta, salvo obblighi
                di legge contrari.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Comunicazione e diffusione dei dati</h2>
              <p>
                I dati personali non sono ceduti, venduti né comunicati a terzi per finalità
                proprie di questi ultimi. I dati possono essere comunicati esclusivamente a:
              </p>
              <ul className="mt-3 space-y-1 list-disc list-inside text-foreground/70">
                <li>
                  <strong>Vercel Inc.</strong> — fornitore del servizio di hosting del sito web,
                  con sede negli Stati Uniti, che tratta i dati in qualità di responsabile del
                  trattamento nel rispetto delle garanzie previste dal GDPR (Standard Contractual
                  Clauses)
                </li>
                <li>
                  Soggetti pubblici o autorità competenti nei casi previsti dalla legge
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookie e dati di navigazione</h2>
              <p>
                Il presente sito utilizza esclusivamente <strong>cookie tecnici</strong> necessari
                al funzionamento del sito stesso (es. preferenze di visualizzazione). Non vengono
                utilizzati cookie di profilazione, cookie analitici di terze parti né strumenti
                di tracciamento comportamentale.
              </p>
              <p className="mt-3">
                I server di hosting (Vercel) possono registrare automaticamente dati tecnici di
                navigazione (indirizzo IP, browser, pagine visitate, orario di accesso) ai soli
                fini di sicurezza e funzionamento dell'infrastruttura. Questi dati non sono
                utilizzati per identificare gli utenti.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Diritti dell'interessato</h2>
              <p>
                Ai sensi degli artt. 15–22 del GDPR, l'interessato ha il diritto di:
              </p>
              <ul className="mt-3 space-y-1 list-disc list-inside text-foreground/70">
                <li><strong>Accesso</strong> — ottenere conferma del trattamento e copia dei dati</li>
                <li><strong>Rettifica</strong> — correggere dati inesatti o incompleti</li>
                <li><strong>Cancellazione</strong> — ottenere la cancellazione dei propri dati ("diritto all'oblio")</li>
                <li><strong>Limitazione</strong> — limitare il trattamento in determinati casi</li>
                <li><strong>Portabilità</strong> — ricevere i dati in formato strutturato e leggibile</li>
                <li><strong>Opposizione</strong> — opporsi al trattamento in qualsiasi momento</li>
                <li>
                  <strong>Revoca del consenso</strong> — revocare il consenso prestato in qualsiasi
                  momento, senza che ciò pregiudichi la liceità del trattamento effettuato
                  prima della revoca
                </li>
              </ul>
              <p className="mt-4">
                Per esercitare i propri diritti è sufficiente inviare una richiesta all'indirizzo:{" "}
                <a href="mailto:info@mannarella.com" className="text-primary hover:underline">
                  info@mannarella.com
                </a>
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Reclamo all'autorità di controllo</h2>
              <p>
                L'interessato ha il diritto di proporre reclamo al <strong>Garante per la
                protezione dei dati personali</strong> (www.garanteprivacy.it) qualora ritenga
                che il trattamento dei propri dati personali violi il GDPR.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Modifiche alla presente informativa</h2>
              <p>
                Il Titolare si riserva il diritto di modificare la presente informativa in
                qualsiasi momento, anche in conseguenza di eventuali modifiche normative.
                Le modifiche saranno pubblicate su questa pagina con aggiornamento della data
                di revisione in calce.
              </p>
            </section>

          </div>

          {/* Data revisione */}
          <div className="mt-16 pt-8 border-t border-border text-sm text-foreground/40">
            <p>Informativa redatta in conformità al Regolamento UE 2016/679 (GDPR) e alle
            linee guida del Garante per la protezione dei dati personali.</p>
            <p className="mt-1">Versione 1.0 — marzo 2026</p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-10 mt-10">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>&copy; 2026 Giovanni Mannarella. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
