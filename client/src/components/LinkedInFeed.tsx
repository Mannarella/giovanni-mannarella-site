import { useEffect } from "react";

/**
 * Box "Ultimi post su LinkedIn" in homepage.
 *
 * Fornitore attivo: Curator.io (feed del profilo personale, piano gratuito,
 * aggiornamento ogni 24 ore).
 *
 * Per tornare a SociableKit basta cambiare LINKEDIN_FEED_PROVIDER in
 * "sociablekit": il codice del widget precedente è conservato qui sotto,
 * invariato (embed-id 25724126).
 */
export type LinkedInFeedProvider = "curator" | "sociablekit";

export const LINKEDIN_FEED_PROVIDER: LinkedInFeedProvider = "curator";

// --- Curator.io -------------------------------------------------------------

const CURATOR_FEED_ID = "f5873b9a-e98f-4055-9b76-618d1468b0d4";
const CURATOR_CONTAINER_ID = "curator-feed-default-feed-layout";
const CURATOR_SCRIPT_SRC = `https://cdn.curator.io/published/${CURATOR_FEED_ID}.js`;

function CuratorFeed() {
  useEffect(() => {
    // In una SPA lo script già caricato non ridisegna il feed quando si torna
    // alla home: lo rimuoviamo e lo reinseriamo a ogni montaggio.
    document.querySelector(`script[src="${CURATOR_SCRIPT_SRC}"]`)?.remove();

    const script = document.createElement("script");
    script.src = CURATOR_SCRIPT_SRC;
    script.async = true;
    script.charset = "UTF-8";
    document.body.appendChild(script);

    return () => {
      script.remove();
      const container = document.getElementById(CURATOR_CONTAINER_ID);
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div id={CURATOR_CONTAINER_ID}>
      <a
        href="https://curator.io"
        target="_blank"
        rel="noopener noreferrer"
        className="crt-logo crt-tag"
      >
        Powered by Curator.io
      </a>
    </div>
  );
}

// --- SociableKit (widget precedente, conservato per un eventuale ritorno) ----

const SOCIABLEKIT_EMBED_ID = "25724126";
const SOCIABLEKIT_SCRIPT_SRC =
  "https://widgets.sociablekit.com/linkedin-profile-posts/widget.js";

function SociableKitFeed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = SOCIABLEKIT_SCRIPT_SRC;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      className="sk-ww-linkedin-profile-post"
      data-embed-id={SOCIABLEKIT_EMBED_ID}
    ></div>
  );
}

// ----------------------------------------------------------------------------

export function LinkedInFeed() {
  return LINKEDIN_FEED_PROVIDER === "curator" ? (
    <CuratorFeed />
  ) : (
    <SociableKitFeed />
  );
}
