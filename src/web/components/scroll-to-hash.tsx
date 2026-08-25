import { useEffect } from "react";
import { useLocation } from "wouter";
import { scrollToId } from "../lib/scroll-to-id";

/** Scrolls to hash anchor after navigation (fixed nav offset). */
export function ScrollToHash() {
  const [location] = useLocation();

  useEffect(() => {
    // Amina ad landing: never auto-jump on open — user scrolls themselves.
    if (location === "/amina" || location.startsWith("/amina/")) return;

    const isApartmentHash = (raw: string) =>
      /(apartments|2d|360|chess|floors|tour|pano|^3d$)/i.test(raw.replace(/^\/?/, ""));

    const scroll = (fromHashChange: boolean) => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));
      // On project open, never auto-jump into the apartment selector.
      // In-page clicks still work via hashchange.
      if (!fromHashChange && location.startsWith("/project") && isApartmentHash(id)) {
        return;
      }
      window.setTimeout(() => scrollToId(id), 80);
      window.setTimeout(() => scrollToId(id), 280);
    };

    scroll(false);
    const onHash = () => scroll(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [location]);

  return null;
}
