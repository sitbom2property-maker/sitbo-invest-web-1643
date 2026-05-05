type Partner = {
  name: string;
  category: "developers" | "banks" | "insurance";
  logo: string;
};

const PARTNERS_DIR = "/partners ";

const partners: Partner[] = [
  { name: "Bank of Georgia", category: "banks", logo: `${PARTNERS_DIR}/partner-bank-bog.png` },
  { name: "TBC Bank", category: "banks", logo: `${PARTNERS_DIR}/partner-bank-tbc.png` },
  { name: "GPI Insurance", category: "insurance", logo: `${PARTNERS_DIR}/partner-insurance-gpi.png` },
  { name: "Ambassadori", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-ambassadori.png` },
  { name: "Archi", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-archi.png` },
  { name: "Artex", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-artex.png` },
  { name: "Eagle Hills", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-eaglehills.png` },
  { name: "Gumbati", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-gumbati.png` },
  { name: "One", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-one.png` },
  { name: "Rogantini", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-rogantini.png` },
  { name: "Silk Development", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-silkdev.png` },
  { name: "Tempo", category: "developers", logo: `${PARTNERS_DIR}/partner-logo-tempo.png` },
];

export function Partners() {
  return (
    <section style={{ background: "#FFFBF0", padding: "0 0 clamp(58px,7vw,96px)" }}>
      <div style={{ maxWidth: "1650px", margin: "0 auto", padding: "0 15px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {["Partner Developers", "Partner Banks", "Partner Insurance"].map((title) => (
            <span
              key={title}
              style={{
                fontFamily: "DM Sans",
                fontSize: "0.66rem",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "rgba(33,20,26,0.52)",
                border: "1px solid rgba(33,20,26,0.12)",
                borderRadius: "999px",
                padding: "5px 10px",
              }}
            >
              {title}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {partners.map((item) => (
            <div
              key={item.name}
              style={{
                minHeight: "132px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "22px 24px",
                borderRadius: "12px",
                background: "rgba(33,20,26,0.03)",
                border: "1px solid rgba(33,20,26,0.14)",
                boxSizing: "border-box",
              }}
            >
              <img
                src={item.logo}
                alt={item.name}
                style={{
                  width: "auto",
                  maxWidth: "100%",
                  maxHeight: "78px",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
