import { useEffect, useState } from "react";
import { ApartmentChessboard } from "./ApartmentChessboard";
import { useSitboModalOpen } from "../hooks/useSitboModalOpen";
import { useT, type MessageKey } from "../i18n";

const C = {
  dark: "#21141A",
  teal: "#703C54",
  light: "#FFFEF9",
  muted: "rgba(33,20,26,0.55)",
};

type ViewMode = "3d" | "2d" | "360";

function hashToMode(hash: string): ViewMode | null {
  if (hash.includes("2d") || hash.includes("chess")) return "2d";
  if (hash.includes("360") || hash.includes("pano")) return "360";
  if (hash.includes("3d") || hash.includes("apartments") || hash.includes("tour")) return "3d";
  return null;
}

function modeToHash(mode: ViewMode) {
  if (mode === "2d") return "#2d";
  if (mode === "360") return "#360";
  return "#apartments";
}

export function ParklineViewer({
  projectName,
  tourUrl,
  panoramaUrl,
}: {
  projectName: string;
  tourUrl: string;
  panoramaUrl?: string;
}) {
  const t = useT();
  const modalOpen = useSitboModalOpen();
  const [mode, setMode] = useState<ViewMode>(() =>
    typeof window === "undefined" ? "3d" : hashToMode(window.location.hash) ?? "3d",
  );

  useEffect(() => {
    const apply = () => {
      const next = hashToMode(window.location.hash);
      if (next) setMode(next);
    };
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const goMode = (next: ViewMode) => {
    setMode(next);
    const hash = modeToHash(next);
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
  };

  const tourSrc = tourUrl;

  const tabs: Array<[ViewMode, MessageKey, boolean]> = [
    ["3d", "chess.view3d", true],
    ["2d", "chess.view2d", true],
    ["360", "chess.viewPanorama", Boolean(panoramaUrl)],
  ];

  return (
    <div id="apartments" className="pk">
      <div className="pk-head">
        <div>
          <h3 className="pk-title">{t("chess.title")}</h3>
          <p className="pk-sub">{t("chess.parklineHint")}</p>
        </div>
        <div className="pk-switch">
          {tabs.filter(([, , on]) => on).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={mode === id ? "is-on" : ""}
              onClick={() => goMode(id)}
              aria-pressed={mode === id}
            >
              {t(label)}
            </button>
          ))}
        </div>
      </div>

      {mode === "2d" ? (
        <ApartmentChessboard projectName={projectName} projectKey="parkline" embedded source="Parkline chessboard" />
      ) : (
        <div className="pk-frame">
          {modalOpen ? (
            <div className="pk-paused" aria-hidden="true" />
          ) : (
            <iframe
              src={mode === "360" && panoramaUrl ? panoramaUrl : tourSrc}
              title={mode === "360" ? `${projectName} 360` : `${projectName} 3D`}
              allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; clipboard-write"
              allowFullScreen
            />
          )}
          <a
            className="pk-open"
            href={mode === "360" && panoramaUrl ? panoramaUrl : tourSrc}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("chess.openFullscreen")}
          </a>
        </div>
      )}

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
  .pk { color: ${C.dark}; }
  .pk-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; flex-wrap: wrap; margin-bottom: 22px;
  }
  .pk-title {
    font-family: Coolvetica, Inter, sans-serif;
    font-size: clamp(1.6rem, 2.5vw, 2.2rem);
    font-weight: 400; margin: 0;
  }
  .pk-sub {
    font-family: Inter, sans-serif; font-size: 0.85rem;
    color: ${C.muted}; margin: 8px 0 0; line-height: 1.55;
  }
  .pk-switch { display: flex; gap: 8px; flex-wrap: wrap; }
  .pk-switch button {
    font-family: Inter, sans-serif; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px; cursor: pointer;
    border: 1px solid rgba(33,20,26,0.12); background: transparent; color: ${C.dark};
  }
  .pk-switch button.is-on {
    background: ${C.dark}; color: ${C.light}; border-color: ${C.dark};
  }
  .pk-frame {
    position: relative; border-radius: 16px; overflow: hidden;
    background: ${C.dark}; height: min(78vh, 760px); min-height: 480px;
  }
  .pk-frame iframe { width: 100%; height: 100%; border: 0; display: block; background: #21141A; }
  .pk-paused { width: 100%; height: 100%; background: #21141A; }
  .pk-open {
    position: absolute; top: 12px; right: 12px;
    font-family: Inter, sans-serif; font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: ${C.dark}; background: ${C.teal}; border-radius: 8px;
    padding: 8px 12px; text-decoration: none;
  }
  @media (max-width: 767px) {
    .pk-frame { height: 70vh; min-height: 420px; }
  }
`;
