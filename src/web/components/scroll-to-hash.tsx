import { useEffect } from "react";
import { useLocation } from "wouter";
import { scrollToId } from "../lib/scroll-to-id";

/** Scrolls to hash anchor after navigation (fixed nav offset). */
export function ScrollToHash() {
  const [location] = useLocation();

  useEffect(() => {
    const scroll = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));
      window.setTimeout(() => scrollToId(id), 80);
      window.setTimeout(() => scrollToId(id), 280);
    };

    scroll();
    window.addEventListener("hashchange", scroll);
    return () => window.removeEventListener("hashchange", scroll);
  }, [location]);

  return null;
}
