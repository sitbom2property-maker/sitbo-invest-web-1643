import { useEffect } from "react";
import { useLocation } from "wouter";

const KEY = "sitbo_scroll_y";

/**
 * Keep the page at the same scroll position after a browser refresh.
 * Hash navigation still wins when a #section is present.
 */
export function ScrollRestore() {
  const [location] = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const save = () => {
      try {
        sessionStorage.setItem(
          KEY,
          JSON.stringify({ path: window.location.pathname, y: window.scrollY }),
        );
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);

    // Persist while scrolling so a hard refresh mid-scroll still restores
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        save();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      save();
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    // Project pages always start at the top; don't jump back into apartment picker.
    if (location.startsWith("/project")) return;
    if (window.location.hash) return;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { path?: string; y?: number };
      if (saved.path !== location || typeof saved.y !== "number") return;
      const y = saved.y;
      // Wait for layout (images / fonts) so restore lands correctly
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        window.setTimeout(() => window.scrollTo(0, y), 80);
        window.setTimeout(() => window.scrollTo(0, y), 280);
      });
    } catch {
      /* ignore */
    }
  }, [location]);

  return null;
}
