import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Always open pages at the top unless the URL has a #hash anchor.
 * (Previous sessionStorage restore caused a sharp jump down on load.)
 */
export function ScrollRestore() {
  const [location] = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    // Project / apartment flows handle their own top scroll.
    window.scrollTo(0, 0);
    // Beat late layout (images/fonts) that can nudge the viewport
    const t1 = window.setTimeout(() => {
      if (!window.location.hash) window.scrollTo(0, 0);
    }, 0);
    return () => window.clearTimeout(t1);
  }, [location]);

  return null;
}
