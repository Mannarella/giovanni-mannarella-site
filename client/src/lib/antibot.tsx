import { useRef, useState } from "react";

/**
 * Protezione anti-bot invisibile per i form che inviano a /api/contact.
 *
 * - Campo trappola (honeypot): un campo testo fuori dallo schermo, invisibile
 *   e non raggiungibile da tastiera. Le persone non lo vedono e lo lasciano
 *   vuoto; molti bot compilano tutti i campi che trovano.
 * - Tempo di compilazione: viene inviato quanto tempo è passato da quando il
 *   form è comparso. Un invio quasi istantaneo è tipico dei bot.
 *
 * I controlli veri e propri sono in api/contact.ts.
 *
 * Uso:
 *   const antiBot = useAntiBot();
 *   <form ...>{antiBot.field} ...</form>
 *   body: JSON.stringify({ ...antiBot.data(), type, nome, ... })
 */
export function useAntiBot() {
  const startedAt = useRef(Date.now());
  const [trap, setTrap] = useState("");

  const field = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label>
        Lascia vuoto questo campo
        <input
          type="text"
          name="sito_web"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </label>
    </div>
  );

  const data = () => ({
    sito_web: trap,
    tempo_compilazione: Date.now() - startedAt.current,
  });

  return { field, data };
}
