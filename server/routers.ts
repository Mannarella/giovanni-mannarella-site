import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getLatestNews } from "./db";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Indirizzo mittente: usa il dominio verificato su Resend.
// Finché non verifichi il dominio, usa "onboarding@resend.dev" (solo sandbox).
// Dopo la verifica DNS di mannarella.com su Resend, sostituisci con:
// "noreply@mannarella.com"
const FROM_ADDRESS = "noreply@mannarella.com";
const TO_ADDRESS = "info@mannarella.com";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  news: router({
    latest: publicProcedure.query(async () => {
      return await getLatestNews(5);
    }),
  }),

  contact: router({
    // Form di contatto principale (sezione Contattami)
    send: publicProcedure
      .input(
        z.object({
          nome: z.string().min(1, "Nome obbligatorio"),
          azienda: z.string().optional(),
          email: z.string().email("Email non valida"),
          telefono: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: TO_ADDRESS,
          replyTo: input.email,
          subject: `Nuovo contatto da ${input.nome}`,
          html: `
            <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di contatto</h2>
            <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${input.nome}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${input.azienda || "—"}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${input.email}">${input.email}</a></td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${input.telefono || "—"}</td></tr>
            </table>
            <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
            <p style="font-family:sans-serif;font-size:12px;color:#999;">Messaggio inviato dal form di contatto di mannarella.com</p>
          `,
        });
        return { success: true };
      }),

    // Popup richiesta informazioni su un bando specifico
    sendBando: publicProcedure
      .input(
        z.object({
          nome: z.string().min(1, "Nome obbligatorio"),
          cognome: z.string().min(1, "Cognome obbligatorio"),
          azienda: z.string().optional(),
          email: z.string().email("Email non valida"),
          telefono: z.string().optional(),
          fondo: z.string().optional(),
          titoloBando: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: TO_ADDRESS,
          replyTo: input.email,
          subject: `Richiesta info bando: ${input.fondo ?? ""} — ${input.titoloBando ?? ""}`,
          html: `
            <h2 style="color:#333;font-family:sans-serif;">Nuova richiesta di informazioni su un bando</h2>
            <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse;">
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Nome:</td><td>${input.nome} ${input.cognome}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Azienda / Ente:</td><td>${input.azienda || "—"}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${input.email}">${input.email}</a></td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Telefono:</td><td>${input.telefono || "—"}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Fondo:</td><td>${input.fondo || "—"}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#555;">Bando:</td><td>${input.titoloBando || "—"}</td></tr>
            </table>
            <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
            <p style="font-family:sans-serif;font-size:12px;color:#999;">Messaggio inviato dal form bandi di mannarella.com</p>
          `,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
