import { Link } from "wouter";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";

const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  light:     "#FFFBF0",
  parchment: "#F5F3ED",
  muted:     "#7a7a7a",
};

const sections = [
  {
    title: "Privacy Policy",
    items: [
      {
        heading: "1. Introduction",
        body: "Welcome to sitboinvest.ge, operated by Sitbo Group. We are committed to protecting your privacy and ensuring that your personal data is handled securely and transparently. This Privacy Policy explains how we collect, use, and protect your information when you interact with our premium real estate platform.",
      },
      {
        heading: "2. Information We Collect",
        body: "We may collect personal information that you voluntarily provide to us, including but not limited to your name, contact details, and investment preferences. Additionally, we automatically collect certain technical data (such as IP addresses and browsing behavior) through cookies to enhance your experience on our site.",
      },
      {
        heading: "3. How We Use Your Information",
        body: "We utilize your data to:",
        list: [
          "Provide personalized real estate and investment recommendations in the Batumi market.",
          "Improve our website's functionality and user experience through advanced analytics and PropTech integrations.",
          "Communicate with you regarding exclusive properties, market insights, and your inquiries.",
          "Comply with applicable legal obligations.",
        ],
      },
      {
        heading: "4. Data Sharing and Security",
        body: "We do not sell your personal information to third parties. We may share necessary data with trusted service providers who assist us in operating our platform, strictly under confidentiality agreements. We implement industry-standard security measures to protect your data against unauthorized access.",
      },
      {
        heading: "5. Your Rights",
        body: "Depending on your jurisdiction, you have the right to access, correct, or request the deletion of your personal data. You may also opt-out of marketing communications at any time. To exercise these rights, please contact us at sitboinvest@gmail.com.",
      },
      {
        heading: "6. Changes to This Policy",
        body: "We may update this Privacy Policy periodically to reflect changes in our practices or regulatory requirements. The latest version will always be available on this page.",
      },
    ],
  },
  {
    title: "Terms of Service",
    items: [
      {
        heading: "1. Acceptance of Terms",
        body: "By accessing and using sitboinvest.ge, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our website.",
      },
      {
        heading: "2. Services and Content",
        body: "Sitbo Group provides premium real estate consulting, investment opportunities, and property management insights in Batumi, Georgia. All information, including architectural renders, market data, and AI-driven analytics provided on this site, is for informational purposes only and does not constitute financial or legal advice.",
      },
      {
        heading: "3. Intellectual Property",
        body: "All content, branding, designs, and materials on this website are the exclusive intellectual property of Sitbo Group. You may not copy, reproduce, distribute, or create derivative works from our content without explicit written permission.",
      },
      {
        heading: "4. User Conduct",
        body: "You agree to use this website only for lawful purposes. You must not engage in any activity that disrupts or interferes with the site's operations, including unauthorized data scraping, attempting to bypass security measures, or transmitting malicious code.",
      },
      {
        heading: "5. Limitation of Liability",
        body: "While we strive for accuracy, Sitbo Group makes no warranties regarding the completeness or reliability of the information presented. Real estate investments carry inherent risks. We shall not be held liable for any direct, indirect, or consequential losses arising from your use of this website or reliance on its content.",
      },
      {
        heading: "6. Governing Law",
        body: "These Terms of Service are governed by and construed in accordance with the laws of Georgia. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in Georgia.",
      },
      {
        heading: "7. Contact Information",
        body: "If you have any questions regarding these Terms of Service, please contact us at sitboinvest@gmail.com.",
      },
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <div style={{ background: C.light, minHeight: "100vh" }}>
        <Nav />

        {/* Hero */}
        <section style={{ background: C.dark, paddingTop: "64px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px clamp(24px,4vw,48px) 56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "24px", height: "1px", background: C.teal }} />
              <span style={{ fontFamily: "DM Sans", fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,251,240,0.45)" }}>
                Legal
              </span>
            </div>
            <h1 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, margin: "0 0 16px" }}>
              Terms of Service &<br />Privacy Policy
            </h1>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: "rgba(255,251,240,0.5)", lineHeight: 1.7, margin: 0 }}>
              Last updated: January 2025 · sitboinvest.ge operated by Sitbo Group
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "72px 0 96px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 clamp(24px,4vw,48px)" }}>
            {sections.map((section, si) => (
              <div key={section.title} style={{ marginBottom: si < sections.length - 1 ? "72px" : 0 }}>
                {/* Section title */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px", paddingBottom: "20px", borderBottom: `2px solid ${C.teal}` }}>
                  <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: C.dark, margin: 0 }}>
                    {section.title}
                  </h2>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  {section.items.map(item => (
                    <div key={item.heading}>
                      <h3 style={{ fontFamily: "Jun, serif", fontSize: "1rem", fontWeight: 400, color: C.dark, margin: "0 0 10px", letterSpacing: "0.01em" }}>
                        {item.heading}
                      </h3>
                      <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "#444", lineHeight: 1.8, margin: 0 }}>
                        {item.body}
                      </p>
                      {item.list && (
                        <ul style={{ margin: "10px 0 0 0", padding: "0 0 0 20px" }}>
                          {item.list.map(li => (
                            <li key={li} style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "#444", lineHeight: 1.8, marginBottom: "4px" }}>
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
                <a style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: C.teal, textDecoration: "none", letterSpacing: "0.06em" }}>
                  ← Back to Home
                </a>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
