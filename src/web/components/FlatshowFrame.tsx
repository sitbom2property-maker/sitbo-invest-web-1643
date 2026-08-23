import { useEffect, useState } from "react";
import { useSitboModalOpen } from "../hooks/useSitboModalOpen";
import { flatshowEmbedFetchUrl } from "../lib/flatshow";

export function FlatshowFrame({
  projectKey,
  lang,
  hash = "#/",
  title,
  fallbackSrc,
}: {
  projectKey: "piazza" | "parkline";
  lang: "en" | "ru";
  hash?: string;
  title: string;
  /** Cross-origin widget if the proxy HTML cannot be loaded. */
  fallbackSrc?: string;
}) {
  const modalOpen = useSitboModalOpen();
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;
    let blobUrl: string | null = null;
    const suffix = hash.startsWith("#") ? hash : `#${hash}`;

    fetch(flatshowEmbedFetchUrl(projectKey, lang))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((html) => {
        if (cancelled) return;
        if (!html.includes("__sitboFsHook")) throw new Error("missing intercept hook");
        const blob = new Blob([html], { type: "text/html" });
        blobUrl = URL.createObjectURL(blob);
        setSrc(`${blobUrl}${suffix}`);
      })
      .catch(() => {
        if (!cancelled) setSrc(fallbackSrc ?? "");
      });

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [projectKey, lang, hash, fallbackSrc]);

  return (
    <>
      <style>{`.fs-paused { width: 100%; height: 100%; background: #21141A; }`}</style>
      {modalOpen ? (
        <div className="fs-paused" aria-hidden="true" />
      ) : (
        <iframe
          title={title}
          src={src}
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; clipboard-write"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </>
  );
}
