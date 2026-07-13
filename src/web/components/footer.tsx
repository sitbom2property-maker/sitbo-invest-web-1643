import { Link } from "wouter";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  light: "#FFFBF0",
};

const navLinks = [
  { label: "Catalog",            href: "/catalog" },
  { label: "Map",                href: "/map" },
  { label: "Services",           href: "/#about" },
  { label: "Turnkey Renovation", href: "/turnkey" },
  { label: "Why Georgia",        href: "/invest" },
  { label: "Mortgage",           href: "/mortgage" },
  { label: "Discovery Tour",     href: "/#discovery-tour" },
  { label: "Partner Program",    href: "/#contact" },
];

export function Footer() {
  return (
    <footer style={{ background: C.dark, padding: "clamp(40px,6vw,80px) 10px clamp(32px,4vw,48px)", borderTop: "1px solid rgba(140,178,192,0.2)" }}>
      {/* Main content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "200px 1fr", gap: "80px", alignItems: "start" }}>

        {/* Left — Logo + About */}
        <div>
          <div style={{ marginBottom: "16px" }}>
            <img src="/logo-dark-bg.png" alt="SITBO" style={{ height: "24px", width: "auto" }} />
          </div>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "#aaa", lineHeight: 1.7 }}>
            Premium real estate investment advisory in Batumi, Georgia.
          </p>
        </div>

        {/* Right — 2 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "48px" }}>

          {/* Col 1 — Navigation */}
          <div>
            <p style={{ color: C.teal, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "DM Sans", margin: "0 0 16px" }}>Navigation</p>
            {navLinks.map(l => (
              <Link key={l.label} href={l.href}>
                <a style={{ display: "block", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "8px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
                >{l.label}</a>
              </Link>
            ))}
          </div>

          {/* Col 2 — Contact */}
          <div>
            <p style={{ color: C.teal, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "DM Sans", margin: "0 0 16px" }}>Contact</p>
            <a href="https://wa.me/995555505288" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "10px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
              onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              +995 555 50 52 88
            </a>
            <a href="mailto:sitboinvest@gmail.com"
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "10px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
              onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              sitboinvest@gmail.com
            </a>
            <a href="https://maps.google.com/?q=Batumi,Georgia" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
              onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Batumi, Georgia
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: "1100px", margin: "40px auto 0", paddingTop: "24px", borderTop: "1px solid rgba(140,178,192,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "#aaa", margin: 0 }}>© 2026 Sitbo Invest. All rights reserved.</p>
        <Link href="/legal">
          <a style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "#aaa", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
          >Terms of Service &amp; Privacy Policy</a>
        </Link>
      </div>
    </footer>
  );
}
