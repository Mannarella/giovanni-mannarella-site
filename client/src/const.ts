export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // Guard: se le env var non sono definite (es. deploy su Netlify senza backend),
  // restituisce "/" per evitare il crash "TypeError: Invalid URL"
  if (!oauthPortalUrl || !appId) {
    console.warn(
      "[Auth] VITE_OAUTH_PORTAL_URL o VITE_APP_ID non definiti. " +
      "Il login OAuth non è disponibile in questo ambiente."
    );
    return "/";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
