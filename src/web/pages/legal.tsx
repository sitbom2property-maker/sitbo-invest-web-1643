import { Link } from "wouter";
import { useT } from "../i18n";

const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  light:     "#FFFBF0",
  parchment: "#FFFBF0",
  muted:     "#7a7a7a",
};

export default function LegalPage() {
  const t = useT();
  const sections = [
    {
      title: t("legal.privacyTitle"),
      items: [
        {
          heading: t("legal.privacy.introduction.heading"),
          body: t("legal.privacy.introduction.body"),
        },
        {
          heading: t("legal.privacy.information.heading"),
          body: t("legal.privacy.information.body"),
        },
        {
          heading: t("legal.privacy.use.heading"),
          body: t("legal.privacy.use.body"),
          list: [
            t("legal.privacy.use.list1"),
            t("legal.privacy.use.list2"),
            t("legal.privacy.use.list3"),
            t("legal.privacy.use.list4"),
          ],
        },
        {
          heading: t("legal.privacy.sharing.heading"),
          body: t("legal.privacy.sharing.body"),
        },
        {
          heading: t("legal.privacy.rights.heading"),
          body: t("legal.privacy.rights.body"),
        },
        {
          heading: t("legal.privacy.changes.heading"),
          body: t("legal.privacy.changes.body"),
        },
      ],
    },
    {
      title: t("legal.termsTitle"),
      items: [
        {
          heading: t("legal.terms.acceptance.heading"),
          body: t("legal.terms.acceptance.body"),
        },
        {
          heading: t("legal.terms.services.heading"),
          body: t("legal.terms.services.body"),
        },
        {
          heading: t("legal.terms.ip.heading"),
          body: t("legal.terms.ip.body"),
        },
        {
          heading: t("legal.terms.conduct.heading"),
          body: t("legal.terms.conduct.body"),
        },
        {
          heading: t("legal.terms.liability.heading"),
          body: t("legal.terms.liability.body"),
        },
        {
          heading: t("legal.terms.law.heading"),
          body: t("legal.terms.law.body"),
        },
        {
          heading: t("legal.terms.contact.heading"),
          body: t("legal.terms.contact.body"),
        },
      ],
    },
  ];

  return (
    <>
      <div style={{ background: C.light, minHeight: "100vh" }}>

        {/* Content */}
        <section style={{ background: C.light, padding: "72px 0 96px" }}>
          <div className="site-wrap">
            
            {/* Page title */}
            <div style={{ marginBottom: "64px" }}>
              <h1 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1, margin: "0 0 12px" }}>
                {t("legal.title")}
              </h1>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>
                {t("legal.updated")}
              </p>
            </div>
            {sections.map((section, si) => (
              <div key={section.title} style={{ marginBottom: si < sections.length - 1 ? "72px" : 0 }}>
                {/* Section title */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px", paddingBottom: "20px", borderBottom: `2px solid ${C.teal}` }}>
                  <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: C.dark, margin: 0 }}>
                    {section.title}
                  </h2>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  {section.items.map(item => (
                    <div key={item.heading}>
                      <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1rem", fontWeight: 400, color: C.dark, margin: "0 0 10px", letterSpacing: "0.01em" }}>
                        {item.heading}
                      </h3>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "#444", lineHeight: 1.8, margin: 0 }}>
                        {item.body}
                      </p>
                      {item.list && (
                        <ul style={{ margin: "10px 0 0 0", padding: "0 0 0 20px" }}>
                          {item.list.map(li => (
                            <li key={li} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "#444", lineHeight: 1.8, marginBottom: "4px" }}>
                              {li}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Back link */}
            <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(33,20,26,0.1)" }}>
              <Link href="/">
                <a style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: C.teal, textDecoration: "none", letterSpacing: "0.06em" }}>
                  {t("legal.backHome")}
                </a>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
