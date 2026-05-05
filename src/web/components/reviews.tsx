const reviews = [
  {
    quote:
      "SITBO structured the deal exactly as promised. I entered with a clear exit strategy and started receiving rental income within the first season.",
    name: "Alexey M.",
    status: "Berlin, Germany",
  },
  {
    quote:
      "The team filtered projects with real numbers, not sales noise. The process felt calm, transparent, and very premium.",
    name: "Elena R.",
    status: "Warsaw, Poland",
  },
  {
    quote:
      "I appreciated the legal clarity and payment planning. Every milestone was documented and easy to track remotely.",
    name: "David K.",
    status: "London, UK",
  },
  {
    quote:
      "From selection to closing, communication was disciplined and fast. It saved me weeks of on-ground due diligence.",
    name: "Nino T.",
    status: "Tbilisi, Georgia",
  },
  {
    quote:
      "Their market perspective is practical: yield, liquidity, and risk in one view. Exactly what an investor needs.",
    name: "Maria S.",
    status: "Prague, Czechia",
  },
  {
    quote:
      "The renovation and furnishing guidance was concise and profitable. We launched rentals with no operational chaos.",
    name: "Igor P.",
    status: "Riga, Latvia",
  },
  {
    quote:
      "Quiet, professional execution. I never felt pressure to buy, only confidence in the final decision.",
    name: "Sophie L.",
    status: "Paris, France",
  },
];

export function Reviews() {
  const visibleReviews = reviews.slice(0, 6);

  return (
    <section style={{ background: "#FFFBF0", padding: "clamp(52px,7vw,90px) 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ width: "26px", height: "1px", background: "#683D47" }} />
          <span style={{ fontFamily: "DM Sans", fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(33,20,26,0.55)" }}>
            Investor Reviews
          </span>
        </div>

        <h3 style={{ margin: "0 0 30px", fontFamily: "Jun, serif", fontSize: "clamp(1.7rem,3.8vw,2.5rem)", fontWeight: 400, color: "#21141A", lineHeight: 1.15 }}>
          Trusted by investors who
          <br />
          <em style={{ fontStyle: "italic", color: "#8CB2C0" }}>optimize for quality.</em>
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
              key={item.name}
              style={{
                flex: "0 0 min(320px, 86vw)",
                background: "#fff",
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
              <p style={{ margin: "0 0 14px", fontFamily: "DM Sans", fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(33,20,26,0.78)", fontStyle: "italic" }}>
                "{item.quote}"
              </p>
              <p style={{ margin: 0, fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 400, color: "#21141A" }}>
                {item.name}
              </p>
              <p style={{ margin: "3px 0 0", fontFamily: "DM Sans", fontSize: "0.72rem", color: "rgba(33,20,26,0.55)" }}>
                {item.status}
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
            <span style={{ fontFamily: "DM Sans", fontSize: "0.86rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFFBF0" }}>
              Read More
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
