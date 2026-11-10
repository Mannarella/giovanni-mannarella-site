import { Resend } from "resend";

const FROM_ADDRESS = "info@mannarella.com";
const TO_ADDRESS = "info@mannarella.com";

// Tempo minimo (ms) tra la comparsa del form e l'invio: sotto questa soglia
// l'invio è considerato automatico.
const MIN_FILL_TIME_MS = 3000;

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const LINK_RE = /(https?:\/\/|www\.|\[url|<a\s)/i;

/** Restituisce il motivo per cui l'invio sembra spam, oppure null. */
function detectSpam(body: Record<string, unknown>): string | null {
  // 1. Campo trappola compilato: le persone non lo vedono.
  if (typeof body.sito_web === "string" && body.sito_web.trim() !== "") {
    return "campo trappola compilato";
  }
  // 2. Tempo di compilazione assente (chiamata diretta all'API) o troppo breve.
  const t = Number(body.tempo_compilazione);
  if (!Number.isFinite(t)) return "tempo di compilazione assente";
  if (t < MIN_FILL_TIME_MS) return `compilato in ${t} ms`;
  // 3. Link nei campi anagrafici: nessuno scrive un URL nel proprio nome.
  for (const key of ["nome", "cognome", "azienda", "telefono"]) {
    const v = body[key];
    if (typeof v === "string" && LINK_RE.test(v)) return `link nel campo ${key}`;
  }
  return null;
}

/** Converte in stringa, toglie a capo e spazi superflui e limita la lunghezza. */
function clean(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength);
}

/** Evita che il testo inserito nel form venga interpretato come HTML nell'email. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY mancante");
    return res.status(500).json({ error: "Configurazione server mancante." });
  }

  const resend = new Resend(apiKey);

  const body = req.body ?? {};

  // --- Filtri anti-bot (vedi client/src/lib/antibot.tsx) -------------------
  // Agli invii riconosciuti come spam rispondiamo comunque "success", così il
  // bot non capisce di essere stato bloccato; l'email però non parte.
  const spamReason = detectSpam(body);
  if (spamReason) {
    console.warn("[contact] Invio scartato come spam:", spamReason);
    return res.status(200).json({ success: true });
  }

  const type = clean(body.type, 30);
  const nome = clean(body.nome, 100);
  const cognome = clean(body.cognome, 100);
  const azienda = clean(body.azienda, 200);
  const email = clean(body.email, 200);
  const telefono = clean(body.telefono, 40);
  const fondo = clean(body.fondo, 200);
  const titoloBando = clean(body.titoloBando, 500);
  const servizio = clean(body.servizio, 200);
  const opportunita = clean(body.opportunita, 500);

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome ed email sono obbligatori." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Indirizzo email non valido." });
  }

  let subject = "";
  let html = "";

  if (type === "bando") {
    subject = `Richiesta info bando: ${fondo} — ${titoloBando}`;
    html = `
      <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di informazioni su un bando</h2>
      <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${esc(nome)} ${esc(cognome)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${esc(azienda) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${esc(telefono) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Fondo:</td><td>${esc(fondo) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Bando:</td><td>${esc(titoloBando) || "—"}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:20px;">Inviato dal form bandi di mannarella.com</p>
    `;
  } else if (type === "servizio") {
    subject = `Richiesta consulenza: ${servizio}`;
    html = `
      <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di consulenza</h2>
      <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${esc(nome)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${esc(telefono) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Servizio:</td><td>${esc(servizio) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Interesse specifico:</td><td>${esc(opportunita) || "—"}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:20px;">Inviato dal form servizi di mannarella.com</p>
    `;
  } else if (type === "collaborazione") {
    subject = `Collaborazione in progettazione: ${azienda || nome}`;
    html = `
      <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta dalla pagina Collaborazioni</h2>
      <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${esc(nome)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Ente / Società:</td><td>${esc(azienda) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${esc(telefono) || "—"}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:20px;">Inviato dalla pagina /collaborazioni di mannarella.com</p>
    `;
  } else {
    subject = `Nuovo contatto da ${nome}`;
    html = `
      <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di contatto</h2>
      <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${esc(nome)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${esc(azienda) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${esc(telefono) || "—"}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:20px;">Inviato dal form di contatto di mannarella.com</p>
    `;
  }

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject,
      html,
    });
    console.log("[contact] Email inviata:", JSON.stringify(result));
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[contact] Errore Resend:", String(err));
    return res.status(500).json({ error: "Errore invio.", detail: String(err) });
  }
}
