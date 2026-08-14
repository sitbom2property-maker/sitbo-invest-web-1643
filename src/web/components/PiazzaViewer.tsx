import { useEffect, useMemo, useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";
import { RequestModal } from "./RequestModal";

function viewerHash() {
  if (typeof window === "undefined") return "#/";
  const hash = window.location.hash.toLowerCase();
  if (hash.includes("floors")) return "#/floors";
  if (hash.includes("2d") || hash.includes("chess")) return "#/chess";
  return "#/";
}

export function PiazzaViewer({ projectName }: { projectName: string }) {
  const t = useT();
  const { language } = useLocale();
  const ru = language.toLowerCase().startsWith("ru");
  const src = useMemo(
    () => `/api/apartments/piazza-viewer?lang=${ru ? "ru" : "en"}${viewerHash()}`,
    [ru],
  );

  const [requestOpen, setRequestOpen] = useState(false);
  const [topic, setTopic] = useState(projectName);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== "sitbo-piazza" || data.event !== "request") return;
      const next = typeof data.topic === "string" && data.topic.trim() ? data.topic.trim() : projectName;
      setTopic(next);
      setRequestOpen(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [projectName]);

  return (
    <div id="apartments" className="pz">
      <div className="pz-head">
        <div>
          <h3 className="pz-title">{t("chess.title")}</h3>
          <p className="pz-sub">{t("chess.officialHint")}</p>
        </div>
      </div>

      <iframe
        className="pz-frame"
        title={projectName}
        src={src}
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        loading="eager"
      />

      <style>{CSS}</style>

      <RequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title={t("chess.request")}
        subtitle={topic}
        source="Piazza 360"
        topic={topic}
      />
    </div>
  );
}

const CSS = `
.pz { font-family: Inter, sans-serif; color: #21141A; }
.pz-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin: 0 auto 18px; width: min(1180px, calc(100% - 40px)); }
.pz-title { font-family: Coolvetica, Inter, sans-serif; font-size: clamp(1.6rem,2.5vw,2.2rem); font-weight: 400; margin: 0; }
.pz-sub { font-size: 0.85rem; color: #7a7a7a; margin: 8px 0 0; }
.pz-frame { display: block; width: 100%; height: min(92vh, 980px); min-height: 640px; border: 0; background: #f4f1ec; }
@media (max-width: 720px) {
  .pz-frame { min-height: 520px; height: 80vh; }
  .pz-head { width: calc(100% - 32px); }
}
`;
