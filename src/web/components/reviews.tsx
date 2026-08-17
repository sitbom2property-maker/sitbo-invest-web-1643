import { useT, type MessageKey } from "../i18n";

const reviews: { quoteKey: MessageKey; nameKey: MessageKey; statusKey: MessageKey }[] = [
  {
    quoteKey: "reviews.1.quote",
    nameKey: "reviews.1.name",
    statusKey: "reviews.1.status",
  },
  {
    quoteKey: "reviews.2.quote",
    nameKey: "reviews.2.name",
    statusKey: "reviews.2.status",
  },
  {
    quoteKey: "reviews.3.quote",
    nameKey: "reviews.3.name",
    statusKey: "reviews.3.status",
  },
  {
    quoteKey: "reviews.4.quote",
    nameKey: "reviews.4.name",
    statusKey: "reviews.4.status",
  },
  {
    quoteKey: "reviews.5.quote",
    nameKey: "reviews.5.name",
    statusKey: "reviews.5.status",
  },
  {
    quoteKey: "reviews.6.quote",
    nameKey: "reviews.6.name",
    statusKey: "reviews.6.status",
  },
  {
    quoteKey: "reviews.7.quote",
    nameKey: "reviews.7.name",
    statusKey: "reviews.7.status",
  },
];

export function Reviews() {
  const t = useT();
  const visibleReviews = reviews.slice(0, 6);

  return (
    <section style={{ background: "#FFFEF9", padding: "clamp(52px,7vw,90px) 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
        <h3 style={{ margin: "0 0 30px", fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.7rem,3.8vw,2.5rem)", fontWeight: 400, color: "#21141A", lineHeight: 1.15 }}>
          {t("reviews.headline")}
          <br />
          <em style={{ fontStyle: "italic", color: "#703C54" }}>{t("reviews.headlineEm")}</em>
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "8px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {visibleReviews.map((item) => (
            <article
              key={item.nameKey}
              style={{
                flex: "0 0 min(320px, 86vw)",
                background: "#FFFEF9",
                border: "1px solid rgba(33,20,26,0.08)",
                borderRadius: "12px",
                padding: "18px 18px 16px",
                boxShadow: "0 8px 20px rgba(33,20,26,0.06)",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p style={{ margin: "0 0 14px", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(33,20,26,0.78)", fontStyle: "italic" }}>
                "{t(item.quoteKey)}"
              </p>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 400, color: "#21141A" }}>
                {t(item.nameKey)}
              </p>
              <p style={{ margin: "3px 0 0", fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(33,20,26,0.55)" }}>
                {t(item.statusKey)}
              </p>
            </article>
          ))}

          <a
            href="https://www.google.com/search?q=sitbo+invest+reviews"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: "0 0 min(320px, 86vw)",
              background: "#21141A",
              border: "1px solid rgba(33,20,26,0.12)",
              borderRadius: "12px",
              padding: "18px",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(33,20,26,0.08)",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.86rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFFEF9" }}>
              {t("reviews.readMore")}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
