import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ChevronDown, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Pagina non indicizzata e fuori dal menu: /collaborazioni
 * Destinatari: enti e società di formazione e consulenza.
 * Raggiungibile dal pulsante "Come lavoro" nella sezione Chi Sono della Home
 * e dal link inserito nelle email di autocandidatura.
 *
 * Gli estratti sono riportati parola per parola dai formulari originali:
 * le omissioni sono segnalate con […], le sostituzioni anonimizzanti tra [ ].
 */

type Paragraph = { lead?: string; text: string };
type Table = { caption?: string; head: string[]; rows: string[][] };
type Estratto = {
  parte: string;
  titolo: string;
  occhiello: string;
  fonte: string;
  paragrafi: Paragraph[];
  tabella?: Table;
  paragrafiDopo?: Paragraph[];
};

const numeri = [
  { valore: "61", testo: "progetti finanziati o autorizzati dal 2021" },
  { valore: "2,9 mln €", testo: "valore complessivo dei progetti" },
  { valore: "10", testo: "canali di finanziamento" },
];

const metodo = [
  {
    n: "1",
    titolo: "Analisi del fabbisogno e del contesto",
    testo:
      "Parto dal processo di lavoro e dalle competenze già presenti in azienda per individuare il divario reale, e lo collego agli obiettivi dell'impresa.",
  },
  {
    n: "2",
    titolo: "Azioni formative",
    testo:
      "Costruisco una sequenza di azioni che segue la logica del processo operativo, con gruppi, metodologie e materiali scelti in funzione del fabbisogno.",
  },
  {
    n: "3",
    titolo: "Riferimento alle AdA e messa in trasparenza",
    testo:
      "Riconduco ogni obiettivo di apprendimento all'Atlante del lavoro e delle qualificazioni o ai repertori regionali, fino al documento di attestazione.",
  },
  {
    n: "4",
    titolo: "Monitoraggio e valutazione",
    testo:
      "Definisco strumenti e fasi di verifica dall'ingresso all'uscita e indicatori d'impatto dichiarati in anticipo, a sei e a dodici mesi.",
  },
];

const strumenti = [
  "Fondimpresa",
  "Fondirigenti",
  "FonARCom",
  "Fon.Ter",
  "For.Te.",
  "Fondo Nuove Competenze",
  "Avvisi regionali FSE+",
  "Qualifiche regolamentate e professionali",
];

const canali: { nome: string; progetti: number; valore: number | null }[] = [
  { nome: "Fondo Nuove Competenze", progetti: 11, valore: 774869.39 },
  { nome: "Credito d'imposta Formazione 4.0", progetti: 2, valore: 700000 },
  { nome: "Fondimpresa", progetti: 9, valore: 587281.85 },
  { nome: "FonARCom", progetti: 7, valore: 267860 },
  { nome: "Regione Emilia-Romagna", progetti: 11, valore: 256000 },
  { nome: "Fon.Ter", progetti: 4, valore: 131850.48 },
  { nome: "Fondirigenti", progetti: 10, valore: 90000 },
  { nome: "For.Te.", progetti: 3, valore: 87324.96 },
  { nome: "Invitalia", progetti: 1, valore: 40000 },
  { nome: "Regione Siciliana", progetti: 3, valore: null },
];
const maxValore = 774869.39;

const settori = [
  "Industria farmaceutica e life science",
  "Industria alimentare",
  "Ristorazione e food",
  "Turismo termale e benessere",
  "Calzaturiero",
  "Servizi ambientali e bonifiche",
  "Autotrasporto e logistica",
  "Autoriparazione",
  "Edilizia",
  "Commercio al dettaglio",
  "Grafica e stampa",
  "Associazioni di categoria",
  "Socioassistenziale e terzo settore",
];

const estratti: Estratto[] = [
  {
    parte: "1 · Analisi del fabbisogno e del contesto",
    titolo: "Quando la certificazione non basta",
    occhiello:
      "Un’impresa di servizi ambientali ha ottenuto le certificazioni per entrare nella filiera europea dei biocarburanti avanzati. L’analisi dei fabbisogni spiega perché, senza competenze interne, quelle certificazioni resterebbero sulla carta.",
    fonte: "Fondimpresa · Avviso per la transizione green · Piano aziendale",
    paragrafi: [
      {
        text: "Prima dell'avvio del progetto di trasformazione green, il personale di [l’impresa] possedeva competenze consolidate nell'ambito della tradizionale gestione dei rifiuti speciali pericolosi e non pericolosi — raccolta, trasporto, trattamento, recupero, smaltimento, bonifica di siti contaminati e rimozione di amianto — acquisite nel corso di oltre 35 anni di attività operativa nel quadro normativo domestico (D.Lgs. 152/2006). Tali competenze, pur qualificanti nel contesto della gestione ordinaria, risultano strutturalmente insufficienti a garantire la piena e autonoma operatività del sistema certificato ISCC EU e NIS, che introduce obblighi, procedure e livelli di know-how tecnico-normativo radicalmente diversi rispetto all'operatività precedente.",
      },
      {
        text: "[…] Il personale del reparto operativo, formato sulla gestione dei rifiuti secondo il quadro normativo domestico, non dispone delle conoscenze relative al quadro normativo europeo delle energie rinnovabili (RED III, DM 7/8/2024) né delle procedure operative specifiche per il ruolo di collecting point certificato. Il gap riguarda: la conoscenza dei criteri di idoneità dei materiali ai fini ISCC EU e NIS (distinzione operativa tra rifiuto, sottoprodotto e materiale conforme); le procedure di accettazione, verifica documentale e registrazione in ingresso alla piattaforma secondo il principio del bilancio di massa […]",
      },
      {
        text: "Il personale tecnico-ambientale dispone di competenze avanzate nella classificazione dei rifiuti secondo il D.Lgs. 152/2006, nella documentazione tecnica per la gestione ordinaria e — grazie alla certificazione aziendale UNI-EN ISO 14064-1:2019 già conseguita — nella contabilizzazione delle emissioni GHG a livello organizzativo. Il gap formativo non riguarda quindi il calcolo GHG in senso generale, bensì la sua declinazione specialistica secondo le metodologie previste dalla RED III per i biocarburanti avanzati (valori default e valori reali, Allegato V/VI RED III) […]",
      },
      {
        text: "Il personale amministrativo-commerciale non dispone delle competenze necessarie per gestire i rapporti contrattuali e documentali nella filiera certificata. Il gap riguarda: la struttura e il funzionamento degli schemi certificativi ISCC EU e NIS, con le implicazioni contrattuali per il ruolo di trader; la predisposizione e gestione dei proof of sustainability e delle sustainability declarations nella comunicazione con produttori e acquirenti certificati […]",
      },
      {
        text: "Un elemento di rilievo emerso dall’analisi è la competenza GHG ISO 14064-1:2019 già posseduta dal Gruppo B (Reparto Tecnico-Ambientale): questa competenza consolida la base tecnica del personale e consente di progettare l’AF3 non come un percorso di apprendimento GHG di base, ma come una specializzazione mirata verso le metodologie specifiche della RED III (valori default e valori reali, Allegato V/VI), che differiscono metodologicamente dalla contabilizzazione GHG organizzativa ISO 14064. Il Piano valorizza esplicitamente questa competenza preesistente come punto di forza del progetto formativo.",
      },
      {
        text: "L’obiettivo operativo del progetto di Trasformazione Green è il raggiungimento del break even economico dell’attività certificata entro 18-24 mesi dalla conclusione del percorso formativo. Questo obiettivo è condizionato alla piena operatività del personale nella gestione autonoma e conforme del sistema ISCC EU/NIS: senza competenze interne adeguate, le certificazioni rimangono documenti formali privi di ricaduta commerciale effettiva.",
      },
    ],
  },
  {
    parte: "2 · Azioni formative",
    titolo: "Una sequenza che segue il processo di lavoro",
    occhiello:
      "Le scelte che hanno orientato il piano dell’impresa di servizi ambientali: quattro azioni, gruppi per reparto, materiali reali.",
    fonte: "Fondimpresa · Avviso per la transizione green · Piano aziendale",
    paragrafi: [
      {
        lead: "Scelta 1 — Quattro AF in sequenza logica progressiva.",
        text: "Il Piano articola le competenze in una sequenza coerente: dalla conoscenza normativa condivisa (AF1) alle applicazioni operative specializzate per reparto (AF2, AF3), fino alla gestione documentale certificata della catena di custodia (AF4). Questa sequenza non è arbitraria: riflette la catena logica del processo operativo nella filiera ISCC EU/NIS (conoscere il quadro → classificare i materiali → rendicontare → gestire la documentazione certificata), garantendo che ciascuna AF costruisca sulle competenze acquisite nella precedente.",
      },
      {
        lead: "Scelta 2 — Gruppi omogenei per reparto, non per singolo individuo.",
        text: "La scelta di organizzare la formazione per gruppi omogenei (3 reparti × 7 addetti ciascuno) risponde alla natura organizzativa del fabbisogno: le competenze da sviluppare sono strutturate per funzione aziendale, non per individuo. […]",
      },
      {
        lead: "Scelta 4 — Metodologia blended applicato-documentale.",
        text: "La scelta del modello blended (formazione d’aula + esercitazioni pratiche su documentazione reale) risponde alla natura delle competenze target: competenze tecnico-documentali che richiedono apprendimento per esercizio pratico su casi reali, non per trasmissione teorica. I materiali didattici sono costruiti su documentazione reale di [l’impresa] (certificati ISCC EU e NIS, manuali procedure [del consulente esterno], modelli di sustainability declarations, registri di bilancio di massa), massimizzando il trasferimento degli apprendimenti al contesto lavorativo.",
      },
    ],
  },
  {
    parte: "3 · Riferimento alle AdA per la messa in trasparenza",
    titolo: "Dall'obiettivo al risultato atteso",
    occhiello:
      "Ogni obiettivo di apprendimento è ricondotto a un’Area di Attività dell’Atlante del lavoro e delle qualificazioni; le evidenze prodotte in aula diventano il Documento di Trasparenza.",
    fonte: "For.Te. · Avviso di sistema · Piano aziendale, comparto logistica · Modulo “Green Logistics”",
    paragrafi: [
      {
        text: "Gli obiettivi di apprendimento sono riferiti ai risultati attesi dell’ADA.11.01.03, Organizzazione della spedizione merci e dei trasporti intermodali, relativi alla definizione delle procedure per l’ottimizzazione del trasporto e all’analisi dei costi a seconda delle opzioni e dei tragitti. I piani di trasporto elaborati nelle esercitazioni costituiscono le evidenze su cui si fondano i servizi di individuazione e la descrizione delle competenze nel Documento di Trasparenza. I criteri di pianificazione introdotti, ossia fattore di carico, chilometri a vuoto, consumi e tipo di alimentazione, coincidono con quelli che il modulo sul Carbon Footprint traduce in un dato di emissione.",
      },
    ],
    tabella: {
      caption: "Obiettivi, standard di qualificazione e descrittori dell'apprendimento",
      head: ["Obiettivi", "Standard di qualificazione (Atlante)", "Descrittore dell'apprendimento"],
      rows: [
        [
          "Pianificare percorsi e carichi applicando criteri di ottimizzazione del fattore di carico e di riduzione dei consumi",
          "ADA.11.01.03 – RA1, relativo alla definizione delle procedure per l’ottimizzazione del trasporto",
          "La persona è in grado di pianificare il percorso e il carico di una commessa tipica dell’impresa motivando le scelte in termini di fattore di carico, chilometri a vuoto e consumi attesi.",
        ],
        [
          "Analizzare e confrontare i costi di trasporto nelle diverse opzioni di instradamento, includendo la componente energetica",
          "ADA.11.01.03 – RA2, relativo all’analisi dei costi di trasporto a seconda delle opzioni e dei tragitti",
          "La persona è in grado di confrontare almeno due opzioni di instradamento per la stessa commessa stimandone costi, tempi di resa e consumi e individuare l’opzione preferibile.",
        ],
        [
          "Programmare viaggi e turni di un parco mezzi a doppia alimentazione, tenendo conto di autonomia e tempi di ricarica dei veicoli elettrici",
          "ADA.11.01.03 – RA1, relativo alla definizione delle procedure per l’ottimizzazione del trasporto",
          "La persona è in grado di programmare un insieme di viaggi assegnando mezzi a combustione ed elettrici in funzione di distanze, autonomia, tempi di ricarica e vincoli di consegna.",
        ],
      ],
    },
    paragrafiDopo: [
      {
        text: "[…] La griglia è costruita sui descrittori dell’apprendimento di ciascun obiettivo e articolata in quattro livelli di padronanza, iniziale, base, intermedio e avanzato, descritti in termini di comportamenti osservabili nell’elaborato. Il livello base corrisponde alla sufficienza, e la prova è superata quando il partecipante lo consegue su tutti e tre gli obiettivi.",
      },
      {
        text: "Alla valutazione si affiancano i servizi di individuazione finalizzati alla messa in trasparenza delle competenze, svolti da un esperto dell’Ente titolato [nome omesso], distinto dal docente. L’esperto incontra ciascun partecipante, ricostruisce con lui le evidenze prodotte nel modulo e gli esiti della rilevazione iniziale e della prova finale e li riconduce agli obiettivi di apprendimento e ai risultati attesi dell’Atlante del lavoro e delle qualificazioni cui il modulo è riferito.",
      },
      {
        text: "L’esito del servizio confluisce nel Documento di Trasparenza, che riporta le unità di apprendimento frequentate, le ore frequentate sul totale, gli standard di qualificazione di riferimento e le evidenze a supporto. […] Chi valuta l’apprendimento è distinto da chi ne cura la messa in trasparenza, e questa separazione garantisce la terzietà del processo di attestazione.",
      },
    ],
  },
  {
    parte: "4 · Azioni e struttura di monitoraggio e valutazione",
    titolo: "Non si verifica ciò che non si è definito",
    occhiello: "La verifica come processo: dalla rilevazione in ingresso alla messa in trasparenza.",
    fonte: "Fondimpresa · Avviso per le politiche attive · Piano per l'inserimento di nuovi lavoratori",
    paragrafi: [
      {
        text: "La verifica dell'apprendimento adottata nel Piano non si configura come un momento puntuale e isolato al termine delle attività formative, ma come un processo strutturato e continuativo che prende avvio dalla rilevazione delle competenze in ingresso e si conclude con la messa in trasparenza finale delle competenze acquisite. Questo approccio si fonda su un principio fondamentale: non si può verificare qualcosa se non si è prima definito con precisione che cosa si intende raggiungere. Il processo di verifica delle competenze è dunque il naturale esito di un sistema di analisi iniziato a partire dallo studio del processo di lavoro aziendale (officina di autoriparazione), passando attraverso la definizione del profilo professionale target (Operatore dell'autoriparazione), la rilevazione dei gap formativi dei destinatari e la conseguente determinazione degli obiettivi di apprendimento specifici di AF1 e AF2.",
      },
      {
        text: "La verifica dell'apprendimento viene intesa come confronto comparativo tra il programma formativo (risultante dal processo progettuale) e i risultati raggiunti al termine di ciascuna Azione Formativa. Tale confronto non riguarda soltanto il divario tra obiettivi e risultati, ma verifica in primo luogo se il progetto didattico sia stato realizzato coerentemente con quanto programmato […] Oltre ai risultati dell'apprendimento, il sistema valuta anche i processi cognitivi attivati dai destinatari nel corso della formazione, processi fortemente influenzati dalle metodologie adottate (lezione frontale partecipata e Training on the Job).",
      },
    ],
    tabella: {
      caption: "Strumenti e fasi della verifica degli apprendimenti (colonna «Contenuto e modalità» omessa)",
      head: ["Fase", "Strumento", "Finalità"],
      rows: [
        [
          "IN ENTRATA (pre-AF)",
          "Scheda di rilevazione delle competenze in ingresso (Bilancio in ingresso)",
          "Definizione del parametro di confronto iniziale per ciascun destinatario; personalizzazione del percorso didattico da parte del docente; baseline per il calcolo del valore aggiunto formativo.",
        ],
        [
          "IN ITINERE (durante le AF)",
          "Esercitazioni pratiche, simulazioni guidate, prove intermedie, griglie di osservazione del docente",
          "Rilevare il livello di apprendimento progressivo; favorire l'autovalutazione dei destinatari; consentire aggiustamenti metodologici in corso d'opera; alimentare il sistema di monitoraggio in itinere.",
        ],
        [
          "IN USCITA (fine AF)",
          "Prova pratica prestazionale finale + Colloquio tecnico",
          "Accertare il livello di competenze (abilità e conoscenze) raggiunto al termine del percorso; produrre evidenze documentali per la certificazione formale; confronto con la baseline d'ingresso per la misurazione del valore aggiunto formativo.",
        ],
      ],
    },
  },
];

/** Evidenzia le omissioni […] con il colore primario. */
function Testo({ text }: { text: string }) {
  const parti = text.split("[…]");
  return (
    <>
      {parti.map((p, i) => (
        <span key={i}>
          {p}
          {i < parti.length - 1 && <span className="text-primary font-medium">[…]</span>}
        </span>
      ))}
    </>
  );
}

function Paragrafi({ items }: { items: Paragraph[] }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className="text-foreground/80 leading-relaxed">
          {p.lead && <b className="text-foreground">{p.lead} </b>}
          <Testo text={p.text} />
        </p>
      ))}
    </>
  );
}

function Tabella({ t }: { t: Table }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full min-w-[560px] text-sm border-collapse">
        {t.caption && <caption className="text-left text-foreground/60 pb-2">{t.caption}</caption>}
        <thead>
          <tr className="border-y-2 border-foreground/80">
            {t.head.map((h) => (
              <th key={h} className="text-left font-semibold text-foreground py-2 pr-4 align-bottom">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((r, i) => (
            <tr key={i} className="border-b border-border">
              {r.map((c, j) => (
                <td key={j} className={`py-2 pr-4 align-top text-foreground/80 ${j === 0 ? "font-medium text-foreground" : ""}`}>
                  <Testo text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EstrattoCard({ e }: { e: Estratto }) {
  const [aperto, setAperto] = useState(false);
  return (
    <Card className="p-6 md:p-8 bg-card border-border">
      <div className="text-xs font-semibold tracking-widest uppercase text-primary">{e.parte}</div>
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2 leading-snug">{e.titolo}</h3>
      <p className="text-foreground/70 italic mt-3 leading-relaxed">{e.occhiello}</p>
      <p className="text-sm text-foreground/50 mt-3 pb-3 border-b border-border">{e.fonte}</p>
      {aperto && (
        <div className="space-y-4 mt-5">
          <Paragrafi items={e.paragrafi} />
          {e.tabella && <Tabella t={e.tabella} />}
          {e.paragrafiDopo && <Paragrafi items={e.paragrafiDopo} />}
        </div>
      )}
      <button
        type="button"
        onClick={() => setAperto(!aperto)}
        aria-expanded={aperto}
        className="mt-4 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
      >
        {aperto ? "Chiudi l'estratto" : "Leggi l'estratto"}
        <ChevronDown className={`w-4 h-4 transition-transform ${aperto ? "rotate-180" : ""}`} />
      </button>
    </Card>
  );
}

export default function Collaborazioni() {
  const [nome, setNome] = useState("");
  const [azienda, setAzienda] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [consenso, setConsenso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Pagina fuori dal menu e non indicizzata
  useEffect(() => {
    const titoloPrecedente = document.title;
    document.title = "Collaborazioni in progettazione · Giovanni Mannarella";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    window.scrollTo(0, 0);
    return () => {
      document.title = titoloPrecedente;
      meta.remove();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "collaborazione", nome, azienda, email, telefono }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setNome("");
      setAzienda("");
      setEmail("");
      setTelefono("");
      setConsenso(false);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation: nessun menu, solo ritorno alla Home */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/#chi-sono" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Torna alla Home</span>
          </a>
          <a href="/" className="h-10 flex items-center hover:opacity-80 transition-opacity">
            <img src="/images/logo.png" alt="Giovanni Mannarella Logo" className="h-full object-contain" />
          </a>
        </div>
      </nav>

      <main>
        {/* Intro */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">Per enti e società di formazione e consulenza</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">Come lavoro sulla progettazione formativa</h1>
              <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
                <p>Mi occupo di formazione dal 2008. Per oltre dodici anni ho lavorato in enti e agenzie formative dell'Emilia-Romagna, seguendo tutte le fasi del ciclo, dall'analisi dei fabbisogni alla rendicontazione. Dal 2021 sono progettista libero professionista.</p>
                <p>Collaboro con enti e società di formazione e consulenza di diverse regioni <b>esclusivamente nella fase di analisi e progettazione</b>, sui fondi interprofessionali, sul Fondo Nuove Competenze e sugli avvisi regionali. Lavoro a distanza, per obiettivi.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-10">
                {numeri.map((n) => (
                  <Card key={n.valore} className="p-6 bg-card border-border">
                    <div className="text-4xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>{n.valore}</div>
                    <div className="text-sm text-foreground/70 mt-2 leading-snug">{n.testo}</div>
                  </Card>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-8">
                {strumenti.map((s) => (
                  <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-muted text-foreground/80">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Metodo */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-3 text-foreground">Le quattro parti di un piano</h2>
              <p className="text-lg text-foreground/70 mb-10">Ogni progetto che scrivo poggia su quattro passaggi. Gli estratti più sotto ne mostrano uno per ciascuno.</p>
              <div className="grid md:grid-cols-2 gap-6">
                {metodo.map((m) => (
                  <div key={m.n} className="flex gap-4">
                    <div className="bg-primary w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-primary-foreground font-bold">{m.n}</div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground leading-snug">{m.titolo}</h3>
                      <p className="text-foreground/70 leading-relaxed text-sm mt-2">{m.testo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Estratti */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-3 text-foreground">Cronache di progettazione</h2>
              <p className="text-lg text-foreground/70 mb-2">Estratti da formulari originali approvati, 2025–2026.</p>
              <p className="text-sm text-foreground/50 mb-10">Testo riportato parola per parola. Omissioni segnalate con <span className="text-primary font-medium">[…]</span>, sostituzioni anonimizzanti tra [ ].</p>
              <div className="space-y-6">
                {estratti.map((e) => (
                  <EstrattoCard key={e.titolo} e={e} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Piani approvati */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-3 text-foreground">Piani approvati 2021–2026</h2>
              <p className="text-lg text-foreground/70 mb-8">61 progetti finanziati o autorizzati, per un valore complessivo di 2.935.187 €.</p>
              <div className="text-sm">
                <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[200px_48px_1fr_120px] gap-x-4 items-center border-b-2 border-foreground/80 py-2 font-semibold text-foreground">
                  <span>Canale di finanziamento</span>
                  <span className="hidden sm:block text-right">Progetti</span>
                  <span className="hidden sm:block" />
                  <span className="text-right">Euro</span>
                </div>
                {canali.map((c) => (
                  <div key={c.nome} className="grid grid-cols-[1fr_auto] sm:grid-cols-[200px_48px_1fr_120px] gap-x-4 items-center border-b border-border py-2 text-foreground/80">
                    <span>
                      {c.nome}
                      <span className="sm:hidden text-foreground/50"> · {c.progetti}</span>
                    </span>
                    <span className="hidden sm:block text-right font-semibold text-foreground">{c.progetti}</span>
                    <span className="hidden sm:block">
                      {c.valore !== null ? (
                        <span className="block h-2.5 bg-muted rounded-sm">
                          <span className="block h-2.5 bg-primary rounded-sm" style={{ width: `${(c.valore / maxValore) * 100}%` }} />
                        </span>
                      ) : (
                        <span className="text-foreground/50 text-xs">autorizzati, a rendiconto</span>
                      )}
                    </span>
                    <span className="text-right tabular-nums">
                      {c.valore !== null ? c.valore.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "–"}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[200px_48px_1fr_120px] gap-x-4 items-center border-b-2 border-foreground/80 py-2 font-semibold text-foreground">
                  <span>Totale</span>
                  <span className="hidden sm:block text-right">61</span>
                  <span className="hidden sm:block" />
                  <span className="text-right tabular-nums">2.935.186,68</span>
                </div>
              </div>
              <p className="text-sm text-foreground/50 mt-4">Per la Regione Siciliana si tratta di attività autorizzate, il cui valore è determinato in fase di rendicontazione.</p>

              <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">Settori per cui ho progettato</h3>
              <div className="flex flex-wrap gap-2">
                {settori.map((s) => (
                  <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-muted text-foreground/80">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Conosciamoci */}
        <section id="conosciamoci" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-3 text-foreground">Conosciamoci</h2>
              <p className="text-lg text-foreground/70 mb-10">Se cercate un progettista con cui costruire, anche a distanza, una collaborazione stabile sulla formazione finanziata, lasciatemi un recapito. Curriculum e book completo sono disponibili su richiesta.</p>
              <form onSubmit={handleSubmit} className="space-y-6 mb-10">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Nome e cognome *</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Ente / Società *</label>
                  <input type="text" value={azienda} onChange={(e) => setAzienda(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Telefono</label>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={inputClass} />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consenso-collaborazioni"
                    checked={consenso}
                    onChange={(e) => setConsenso(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary cursor-pointer shrink-0"
                    required
                  />
                  <label htmlFor="consenso-collaborazioni" className="text-sm text-foreground/60 leading-relaxed cursor-pointer">
                    Ho letto e accetto la{" "}
                    <a href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</a>{" "}
                    e acconsento al trattamento dei miei dati personali per rispondere alla mia richiesta. *
                  </label>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!consenso || loading}
                >
                  {loading ? "Invio in corso..." : "Fissiamo un incontro"} {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
                {submitted && <p className="text-center text-primary font-semibold">Grazie! Vi ricontatterò al più presto.</p>}
                {submitError && (
                  <p className="text-center text-red-600 text-sm">
                    Si è verificato un errore. Riprovate o scrivete a{" "}
                    <a href="mailto:progettazione@mannarella.com" className="underline">progettazione@mannarella.com</a>.
                  </p>
                )}
              </form>
              <div className="flex gap-6 justify-center">
                <a href="mailto:progettazione@mannarella.com" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"><Mail className="w-5 h-5" /><span>progettazione@mannarella.com</span></a>
                <a href="https://www.linkedin.com/in/mannarella" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"><Linkedin className="w-5 h-5" /><span>LinkedIn</span></a>
              </div>
              <div className="text-center mt-12">
                <a href="/#chi-sono" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Torna alla Home</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>&copy; 2026 Giovanni Mannarella. Tutti i diritti riservati.</p>
          <p className="text-foreground/50 text-xs mt-2">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
