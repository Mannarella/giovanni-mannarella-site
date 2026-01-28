import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";

/**
 * Pagina Servizio: Europrogettazione
 * Mostra le opportunità attive e il form di adesione
 */

export default function Europrogettazione() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
    opportunita: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const programmi = [
    { name: "Portale UE FSE+", url: "https://european-social-fund-plus.ec.europa.eu/it" },
    { name: "Anpal FSE+ Italia", url: "https://www.anpal.gov.it/europa/fse-plus" },
    { name: "OpenCoesione", url: "https://opencoesione.gov.it/it/" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Adesione a Opportunità - Europrogettazione`;
    const body = `Nome: ${formData.nome}\nEmail: ${formData.email}\nTelefono: ${formData.telefono}\nProgramma selezionato: ${formData.opportunita}`;
    window.location.href = `mailto:info@mannarella.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
            <h1 className="text-5xl font-bold mb-4 text-foreground">Europrogettazione</h1>
            <p className="text-xl text-foreground/70 mb-12">
              Progettazione di iniziative FESR, FSE e altri programmi europei secondo le specifiche dei bandi.
            </p>

            {/* Programmi disponibili */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-foreground">Programmi Europei</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {programmi.map((programma) => (
                  <Card key={programma.name} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{programma.name}</h3>
                      <a
                        href={programma.url}
                        target="_blank"
                        rel="noopener noreferrer"
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
                Compila il form sottostante per richiedere una consulenza personalizzata su una delle opportunità europee disponibili.
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
                    Programma di Interesse *
                  </label>
                  <select
                    value={formData.opportunita}
                    onChange={(e) => setFormData({ ...formData, opportunita: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  >
                    <option value="">Seleziona un programma</option>
                    {programmi.map((programma) => (
                      <option key={programma.name} value={programma.name}>
                        {programma.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Invia Richiesta
                </Button>

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
        </div>
      </footer>
    </div>
  );
}
