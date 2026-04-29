const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  wine: "#683D47",
  light: "#FFFBF0",
  muted: "rgba(33,20,26,0.6)",
};

export function Footer() {
  return (
    <footer style={{ background: "#21141A", padding: "clamp(40px,6vw,80px) 10px clamp(32px,4vw,48px)", borderTop: "1px solid rgba(140,178,192,0.2)" }}>
      <div className="footer-grid" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div>
          <div style={{ marginBottom: "16px" }}>
            <img src="/logo-dark-bg.png" alt="SITBO" style={{ height: "20px", width: "auto" }} />
          </div>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "#aaa", lineHeight: 1.7, maxWidth: "240px" }}>
            Premium real estate investment advisory in Batumi, Georgia. Off-market access, legal security, honest returns.
          </p>
        </div>
        {[
          { title: "Investment", links: ["Portfolio", "Off-Market", "Analytics", "ROI Calculator"] },
          { title: "Services",   links: ["Legal Verification", "Renovation", "Management", "Residency", "Ambassador Club"] },
        ].map((col) => (
          <div key={col.title}>
            <p style={{ color: C.teal, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: "12px" }}>{col.title}</p>
            {col.links.map((link) => (
              <a key={link} href="#contact"
                style={{ display: "block", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "8px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
              >{link}</a>
            ))}
          </div>
        ))}

        {/* Contact + Socials */}
        <div>
          <p style={{ color: C.teal, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: "12px" }}>Contact</p>
          <a href="https://wa.me/995555505288" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "8px", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <a href="mailto:sitboinvest@gmail.com"
            style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "24px", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            sitboinvest@gmail.com
          </a>

          <p style={{ color: C.teal, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: "12px" }}>Socials</p>
          <a href="https://instagram.com/sitboinvest" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "8px", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Instagram
          </a>
          <a href="https://t.me/sitboinvest" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "0.8rem", fontFamily: "DM Sans", marginBottom: "8px", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </a>
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "32px auto 0", paddingTop: "24px", borderTop: "1px solid rgba(140,178,192,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "#aaa" }}>© 2026 Sitbo Invest. All rights reserved.</p>
        <a href="https://g.page/r/CR1_vKWcSyUNEAI/review" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "#aaa", textDecoration: "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#8CB2C0")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#aaa"/>
            <path d="M21.35 11.1h-9.17v2.73h5.24c-.23 1.23-1.42 3.61-5.24 3.61-3.15 0-5.72-2.6-5.72-5.83s2.57-5.83 5.72-5.83c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.7 3.43 14.54 2.5 12.18 2.5 6.84 2.5 2.5 6.84 2.5 12.18s4.34 9.68 9.68 9.68c5.59 0 9.29-3.92 9.29-9.44 0-.63-.07-1.12-.12-1.32z" fill="#4285F4"/>
          </svg>
          Leave us a Google Review ↗
        </a>
        <a href="https://maps.google.com/?q=Batumi,Georgia" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "#aaa", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
        >Batumi, Georgia · International Investment Advisory ↗</a>
      </div>
    </footer>
  );
}
