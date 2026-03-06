import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "noreply@mannarella.com";
const TO_ADDRESS = "info@mannarella.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, nome, cognome, azienda, email, telefono, fondo, titoloBando } =
    req.body ?? {};

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome ed email sono obbligatori." });
  }

  try {
    if (type === "bando") {
      // Popup richiesta info su un bando specifico
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: TO_ADDRESS,
        replyTo: email,
        subject: `Richiesta info bando: ${fondo ?? ""} — ${titoloBando ?? ""}`,
        html: `
          <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di informazioni su un bando</h2>
          <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${nome} ${cognome ?? ""}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${azienda || "—"}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${telefono || "—"}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Fondo:</td><td>${fondo || "—"}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Bando:</td><td>${titoloBando || "—"}</td></tr>
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
          <p style="font-family:sans-serif;font-size:12px;color:#999;">Inviato dal form bandi di mannarella.com</p>
        `,
      });
    } else {
      // Form di contatto principale
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: TO_ADDRESS,
        replyTo: email,
        subject: `Nuovo contatto da ${nome}`,
        html: `
          <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di contatto</h2>
          <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${nome}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${azienda || "—"}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${telefono || "—"}</td></tr>
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
          <p style="font-family:sans-serif;font-size:12px;color:#999;">Inviato dal form di contatto di mannarella.com</p>
        `,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return res.status(500).json({ error: "Errore nell'invio email." });
  }
}
