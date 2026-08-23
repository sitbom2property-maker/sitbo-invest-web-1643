import { useMemo } from "react";
import { useSitboModalOpen } from "../hooks/useSitboModalOpen";
import { flatshowEmbedSrc } from "../lib/flatshow";

export function FlatshowFrame({
  projectKey,
  lang,
  hash = "#/",
  title,
}: {
  projectKey: "piazza" | "parkline";
  lang: "en" | "ru";
  hash?: string;
  title: string;
}) {
  const modalOpen = useSitboModalOpen();
  const src = useMemo(
    () => (typeof window === "undefined" ? "" : flatshowEmbedSrc(projectKey, lang, hash)),
    [projectKey, lang, hash],
  );

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
