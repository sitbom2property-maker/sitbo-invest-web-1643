import { useEffect, useRef, useState, type RefObject } from "react";
import { type TimelineEvent } from "../data/history-regions";
import { getHistoryRegions, getLiveRegion } from "../data/history-regions-locale";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";

const C = {
  dark: "#21141A",
  light: "#FFFEF9",
  teal: "#703C54",
  wine: "#703C54",
};

function useScrollProgress(containerRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight * 0.65;
      if (total <= 0) {
        setProgress(rect.top < 0 ? 1 : 0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top + window.innerHeight * 0.15, 0), total);
      setProgress(scrolled / total);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return progress;
}

function useRevealItems(deps: unknown[]) {
  useEffect(() => {
    const els = document.querySelectorAll(".ht-item");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ht-item--visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function TimelineItem({
  event,
  active,
}: {
  event: TimelineEvent;
  active: boolean;
}) {
  return (
    <li className={`ht-item${active ? " ht-item--active" : ""}`}>
      <div className="ht-item__dot" aria-hidden="true" />
      <div className="ht-item__card">
        <span className="ht-item__year">{event.year}</span>
        <h3 className="ht-item__title">{event.title}</h3>
        <p className="ht-item__body">{event.body}</p>
      </div>
    </li>
  );
}

export default function HistoryPage() {
  const trackRef = useRef<HTMLElement | null>(null);
  const progress = useScrollProgress(trackRef);
  const { language } = useLocale();
  const regions = getHistoryRegions(language);
  const region = getLiveRegion(language);
  const t = useT();
  useRevealItems([region.id, language]);

  const activeIndex = Math.min(
    Math.max(region.events.length - 1, 0),
    Math.floor(progress * region.events.length)
  );

  return (
    <div className="ht-page">
      <style>{`
        .ht-page {
          background: ${C.dark};
          color: ${C.light};
          min-height: 100vh;
          overflow-x: hidden;
        }

        .ht-hero {
          padding: clamp(48px, 8vw, 96px) var(--site-gutter) clamp(32px, 5vw, 56px);
          max-width: var(--site-max);
          margin: 0 auto;
          box-sizing: border-box;
        }

        .ht-hero h1 {
          font-family: Coolvetica, Inter, sans-serif;
          font-size: clamp(2.4rem, 7vw, 4.4rem);
          font-weight: 400;
          line-height: 1.08;
          margin: 0 0 18px;
          color: ${C.light};
        }

        .ht-hero h1 em {
          font-style: italic;
          color: ${C.teal};
        }

        .ht-hero p {
          font-family: Inter, sans-serif;
          font-size: clamp(0.92rem, 2vw, 1.05rem);
          line-height: 1.75;
          color: rgba(255,254,249,0.58);
          max-width: 560px;
          margin: 0;
        }

        .ht-regions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 36px;
        }

        .ht-region-chip {
          font-family: Inter, sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 10px 16px;
          border: 1px solid rgba(255,254,249,0.16);
          color: rgba(255,254,249,0.45);
          background: transparent;
          border-radius: 999px;
        }

        .ht-region-chip--live {
          color: ${C.dark};
          background: ${C.teal};
          border-color: ${C.teal};
        }

        .ht-track {
          position: relative;
          max-width: var(--site-max);
          margin: 0 auto;
          padding: 8px var(--site-gutter) clamp(96px, 12vw, 160px);
          box-sizing: border-box;
        }

        .ht-sticky {
          position: sticky;
          top: calc(var(--nav-height, 88px) + 10px);
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 48px;
          padding: 14px 18px;
          background: rgba(33,20,26,0.86);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,254,249,0.1);
          border-radius: 12px;
        }

        .ht-sticky strong {
          font-family: Inter, sans-serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: ${C.light};
        }

        .ht-sticky span {
          font-family: Inter, sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.teal};
          white-space: nowrap;
        }

        .ht-rail {
          position: relative;
          padding-left: 34px;
        }

        .ht-progress {
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255,254,249,0.1);
        }

        .ht-progress__fill {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 0%;
          background: linear-gradient(to bottom, ${C.teal}, ${C.wine});
          transform-origin: top center;
        }

        .ht-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(36px, 6vw, 64px);
        }

        .ht-item {
          position: relative;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ht-item--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ht-item__dot {
          position: absolute;
          left: -34px;
          top: 30px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${C.dark};
          border: 2px solid rgba(255,254,249,0.28);
          z-index: 2;
          transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
        }

        .ht-item--active .ht-item__dot {
          background: ${C.teal};
          border-color: ${C.teal};
          box-shadow: 0 0 0 6px rgba(140,178,192,0.1);
        }

        .ht-item__card {
          padding: clamp(22px, 4vw, 30px);
          border: 1px solid rgba(255,254,249,0.1);
          border-radius: 16px;
          background: rgba(255,254,249,0.03);
          transition: border-color 0.35s ease, background 0.35s ease, transform 0.35s ease;
        }

        .ht-item--active .ht-item__card {
          border-color: rgba(140,178,192,0.1);
          background: rgba(140,178,192,0.1);
        }

        .ht-item__year {
          display: block;
          font-family: Inter, sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${C.teal};
          margin-bottom: 10px;
        }

        .ht-item__title {
          font-family: Coolvetica, Inter, sans-serif;
          font-size: clamp(1.35rem, 3.2vw, 1.9rem);
          font-weight: 400;
          line-height: 1.2;
          margin: 0 0 12px;
          color: ${C.light};
        }

        .ht-item__body {
          font-family: Inter, sans-serif;
          font-size: 0.92rem;
          line-height: 1.7;
          color: rgba(255,254,249,0.62);
          margin: 0;
        }

        .ht-footer-note {
          max-width: 520px;
          margin: 72px auto 0;
          text-align: center;
          font-family: Inter, sans-serif;
          font-size: 0.88rem;
          line-height: 1.7;
          color: rgba(255,254,249,0.45);
        }

        @media (prefers-reduced-motion: reduce) {
          .ht-item {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <header className="ht-hero">
        <h1>
          {t("history.title")}<br />
          <em>{t("history.titleEm")}</em>
        </h1>
        <p>{region.intro}</p>

        <div className="ht-regions" aria-label={t("history.regionsLabel")}>
          {regions.map((r) => (
            <span
              key={r.id}
              className={`ht-region-chip${r.status === "live" ? " ht-region-chip--live" : ""}`}
            >
              {r.name}
              {r.status === "soon" ? ` · ${t("history.soon")}` : ""}
            </span>
          ))}
        </div>
      </header>

      <section ref={trackRef} className="ht-track" aria-label={t("history.timelineLabel", { region: region.name })}>
        <div className="ht-sticky">
          <strong>{region.name}</strong>
          <span>{region.tag}</span>
        </div>

        <div className="ht-rail">
          <div className="ht-progress" aria-hidden="true">
            <div
              className="ht-progress__fill"
              style={{ height: `${Math.max(progress * 100, 2)}%` }}
            />
          </div>

          <ol className="ht-list">
            {region.events.map((event, index) => (
              <TimelineItem
                key={`${event.year}-${event.title}`}
                event={event}
                active={index <= activeIndex}
              />
            ))}
          </ol>
        </div>

        <p className="ht-footer-note">
          {t("history.footerNote")}
        </p>
      </section>

    </div>
  );
}
