import { useT, type MessageKey } from "../i18n";

const reviews: {
  quoteKey: MessageKey;
  nameKey: MessageKey;
  tags: string[];
}[] = [
  {
    quoteKey: "reviews.1.quote",
    nameKey: "reviews.1.name",
    tags: ["#batumi", "#fastsale", "#vipservice"],
  },
  {
    quoteKey: "reviews.2.quote",
    nameKey: "reviews.2.name",
    tags: ["#batumi", "#mortgage", "#advisory"],
  },
  {
    quoteKey: "reviews.3.quote",
    nameKey: "reviews.3.name",
    tags: ["#batumi", "#investment", "#fullservice"],
  },
  {
    quoteKey: "reviews.4.quote",
    nameKey: "reviews.4.name",
    tags: ["#batumi", "#seamlessdeal", "#protection"],
  },
  {
    quoteKey: "reviews.5.quote",
    nameKey: "reviews.5.name",
    tags: ["#batumi", "#problemsolver", "#mortgage"],
  },
  {
    quoteKey: "reviews.6.quote",
    nameKey: "reviews.6.name",
    tags: ["#tbilisi", "#batumi", "#representation"],
  },
  {
    quoteKey: "reviews.7.quote",
    nameKey: "reviews.7.name",
    tags: ["#georgia", "#legalprotection", "#diplomacy"],
  },
];

function GoogleReviewBadge() {
  return (
    <img
      src="/images/google-review.svg"
      alt="Google Review"
      width={50}
      height={30}
      loading="lazy"
      decoding="async"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 50,
        height: 30,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}

export function Reviews() {
  const t = useT();

  return (
    <section style={{ background: "#FFFEF9", padding: "clamp(52px,7vw,90px) 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
        <h3 style={{ margin: "0 0 30px", fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.7rem,3.8vw,2.5rem)", fontWeight: 400, color: "#21141A", lineHeight: 1.15 }}>
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
          {reviews.map((item) => (
            <article
              key={item.nameKey}
              style={{
                position: "relative",
                flex: "0 0 min(320px, 86vw)",
                background: "#412835",
                borderRadius: "10px",
                padding: "48px 64px 16px 18px",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#FFFEF9",
                boxSizing: "border-box",
              }}
            >
              <GoogleReviewBadge />
              <p style={{ margin: "0 0 14px", fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", lineHeight: 1.65, color: "#FFFEF9", fontStyle: "italic" }}>
                "{t(item.quoteKey)}"
              </p>
              <div>
                <p style={{ margin: 0, fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", fontWeight: 400, color: "#FFFEF9" }}>
                  {t(item.nameKey)}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontSize: 12,
                        padding: "6px 12px",
                        border: "1px solid rgba(255,254,249,0.55)",
                        borderRadius: 10,
                        color: "#FFFEF9",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
              borderRadius: "10px",
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
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.86rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFFEF9" }}>
              {t("reviews.readMore")}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
