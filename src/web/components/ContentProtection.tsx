import { useEffect } from "react";
import { initContentProtection } from "../lib/content-protection";

/** Blocks casual copy / save / drag of site content; forms & Share stay usable. */
export function ContentProtection() {
  useEffect(() => initContentProtection(), []);
  return null;
}
