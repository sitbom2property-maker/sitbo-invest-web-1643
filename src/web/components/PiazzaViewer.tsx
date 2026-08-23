import { useEffect, useMemo, useState } from "react";
import { ApartmentChessboard } from "./ApartmentChessboard";
import { FlatshowFrame } from "./FlatshowFrame";
import { RequestModal } from "./RequestModal";
import { useLocale } from "../context/LocaleContext";
import { useFlatshowLeadCatch } from "../hooks/useFlatshowLeadCatch";
import { useT, type MessageKey } from "../i18n";

const C = {
  dark: "#21141A",
  teal: "#703C54",
  light: "#FFFEF9",
  muted: "rgba(33,20,26,0.55)",
};

type ViewMode = "3d" | "2d";

function hashToMode(hash: string): ViewMode | null {
  if (hash.includes("2d") || hash.includes("chess")) return "2d";
  if (hash.includes("3d") || hash.includes("apartments") || hash.includes("floors")) return "3d";
  return null;
}

export function PiazzaViewer({ projectName }: { projectName: string }) {
  const t = useT();
  const { language } = useLocale();
  const ru = language.toLowerCase().startsWith("ru");
  const { open, setOpen } = useFlatshowLeadCatch();
  const [mode, setMode] = useState<ViewMode>(() =>
    typeof window === "undefined" ? "3d" : hashToMode(window.location.hash) ?? "3d",
  );
  const tourHash = useMemo(
    () =>
      typeof window !== "undefined" && window.location.hash.toLowerCase().includes("floors")
        ? "#/floors"
        : "#/",
    [mode],
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
    const hash = next === "2d" ? "#2d" : "#apartments";
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
  };

  const tabs: Array<[ViewMode, MessageKey]> = [
    ["3d", "chess.view3d"],
    ["2d", "chess.view2d"],
  ];

  return (
    <div id="apartments" className="pz">
      <div className="pz-head">
        <div>
          <h3 className="pz-title">{t("chess.title")}</h3>
          <p className="pz-sub">{t("chess.officialHint")}</p>
        </div>
        <div className="pz-switch">
          {tabs.map(([id, label]) => (
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
          {mode === "3d" ? (
            <button type="button" className="is-call" onClick={() => setOpen(true)}>
              {t("popup.submit")}
            </button>
          ) : null}
        </div>
      </div>

      {mode === "2d" ? (
        <ApartmentChessboard projectName={projectName} embedded source="Piazza chessboard" />
      ) : (
        <div className="pz-frame">
          <FlatshowFrame
            projectKey="piazza"
            lang={ru ? "ru" : "en"}
            hash={tourHash}
            title={`${projectName} — Flat.show`}
          />
        </div>
      )}

      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        title={t("popup.submit")}
        subtitle={t("chess.flatshowCallBody", { project: projectName })}
        source={`Flat.show 3D — ${projectName}`}
        topic={projectName}
      />

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
  .pz { color: ${C.dark}; }
  .pz-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; flex-wrap: wrap; margin-bottom: 22px;
  }
  .pz-title {
    font-family: Coolvetica, Inter, sans-serif;
    font-size: clamp(1.6rem, 2.5vw, 2.2rem);
    font-weight: 400; margin: 0;
  }
  .pz-sub {
    font-family: Inter, sans-serif; font-size: 0.85rem;
    color: ${C.muted}; margin: 8px 0 0; line-height: 1.55;
  }
  .pz-switch { display: flex; gap: 8px; flex-wrap: wrap; }
  .pz-switch button {
    font-family: Inter, sans-serif; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 2px; cursor: pointer;
    border: 1px solid rgba(33,20,26,0.12); background: transparent; color: ${C.dark};
  }
  .pz-switch button.is-on {
    background: ${C.dark}; color: ${C.light}; border-color: ${C.dark};
  }
  .pz-switch button.is-call {
    background: ${C.teal}; color: ${C.light}; border-color: ${C.teal};
  }
  .pz-frame {
    position: relative; border-radius: 2px; overflow: hidden;
    background: #FFFEF9; height: min(82vh, 860px); min-height: 520px;
  }
  .pz-frame iframe { width: 100%; height: 100%; border: 0; display: block; background: #FFFEF9; }
  @media (max-width: 767px) {
    .pz-frame { height: 75vh; min-height: 460px; }
  }
`;
