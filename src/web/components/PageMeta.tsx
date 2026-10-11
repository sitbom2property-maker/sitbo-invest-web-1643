import { useEffect } from "react";
import { useLocation } from "wouter";
import { applyDocumentMeta } from "../lib/seo";

/** Keeps <title> / OG / Twitter / canonical in sync on client navigations. */
export function PageMeta() {
  const [location] = useLocation();

  useEffect(() => {
    applyDocumentMeta(location);
  }, [location]);

  return null;
}
