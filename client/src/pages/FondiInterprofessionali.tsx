import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, ArrowLeft, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Pagina Servizio: Fondi Interprofessionali
 * Mostra le opportunità attive e il form di adesione
 */

export default function FondiInterprofessionali() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
    opportunita: "",
  });
  const [consenso, setConsenso] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [fondi, setFondi] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    fetch("/fondi.json")
      .then((res) => res.json())
      .then((data) => setFondi(data))
      .catch(() => setFondi([]));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Invia il form a info@mannarella.com
    const subject = `Adesione a Opportunità - Fondi Interprofessionali`;
    const body = `Nome: ${formData.nome}\nEmail: ${formData.email}\nTelefono: ${formData.telefono}\nOpportunità selezionata: ${formData.opportunita}`;
    window.location.href = `mailto:info@mannarella.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const openInSizedWindow = (url: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const width = 980;
    const height = 720;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
    const features = `noopener,noreferrer,width=${width},height=${height},left=${Math.floor(left)},top=${Math.floor(top)}`;
    window.open(url, "_blank", features);
  };

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

        {/* Main Content */}
        <main className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-4 text-foreground">Progettazione Fondi Interprofessionali</h1>
              <p className="text-xl text-foreground/70 mb-12">
                Sviluppo progetti su FonARCom, Fondimpresa, Fon.Ter. e altri fondi con analisi dei bisogni personalizzata.
              </p>

              {/* Fondi disponibili */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-foreground">Fondi Disponibili</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {fondi.map((fondo) => (
                      <Card key={fondo.name} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">{fondo.name}</h3>
                          <a
                              href={fondo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={openInSizedWindow(fondo.url)}
                              className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                        <p className="text-foreground/60 text-sm mt-2">Accedi al sito ufficiale</p>
                      </Card>
                  ))}
                </div>
              </section>

              {/* Form di adesione */}
              <section className="bg-card rounded-lg p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-8 text-foreground">Richiedi Consulenza</h2>
                <p className="text-foreground/70 mb-8">
                  Compila il form sottostante per richiedere una consulenza personalizzata su una delle opportunità disponibili.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Nome Completo *
                    </label>
                    <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Il tuo nome"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email *
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tua.email@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Telefono *
                    </label>
                    <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="+39 XXX XXX XXXX"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Fondo di Interesse *
                    </label>
                    <select
                        value={formData.opportunita}
                        onChange={(e) => setFormData({ ...formData, opportunita: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                    >
                      <option value="">Seleziona un fondo</option>
                      {fondi.map((fondo) => (
                          <option key={fondo.name} value={fondo.name}>
                            {fondo.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={!consenso}
                  >
                    Invia Richiesta
                  </Button>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consenso-fondi"
                      checked={consenso}
                      onChange={(e) => setConsenso(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary cursor-pointer shrink-0"
                      required
                    />
                    <label htmlFor="consenso-fondi" className="text-sm text-foreground/60 leading-relaxed cursor-pointer">
                      Ho letto e accetto la{" "}
                      <a href="/privacy-policy" className="text-primary hover:underline font-medium">
                        Privacy Policy
                      </a>{" "}
                      e acconsento al trattamento dei miei dati personali per rispondere alla mia richiesta. *
                    </label>
                  </div>

                  {submitted && (
                      <p className="text-center text-primary font-semibold">
                        Grazie! Ti contatterò al più presto.
                      </p>
                  )}
                </form>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-foreground/5 border-t border-border py-12 mt-20">
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
