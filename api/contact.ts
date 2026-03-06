import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "noreply@send.mannarella.com";
const TO_ADDRESS = "info@mannarella.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { type, nome, cognome, azienda, email, telefono, fondo, titoloBando } = req.body ?? {};

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome ed email sono obbligatori." });
  }

  const isBando = type === "bando";

  const subject = isBando
    ? `Richiesta info bando: ${fondo ?? ""} — ${titoloBando ?? ""}`
    : `Nuovo contatto da ${nome}`;

  const html = isBando
    ? `
      <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di informazioni su un bando</h2>
      <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${nome} ${cognome ?? ""}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${azienda || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${telefono || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Fondo:</td><td>${fondo || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Bando:</td><td>${titoloBando || "—"}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:20px;">Inviato dal form bandi di mannarella.com</p>
    `
    : `
      <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di contatto</h2>
      <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${nome}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${azienda || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${telefono || "—"}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:20px;">Inviato dal form di contatto di mannarella.com</p>
    `;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject,
      html,
    });

    console.log("[contact] Email sent:", result);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return res.status(500).json({ error: "Errore nell'invio email.", detail: String(err) });
  }
}
