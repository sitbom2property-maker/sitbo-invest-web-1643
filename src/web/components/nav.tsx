import { useState, type CSSProperties } from "react";
import { Link, useLocation } from "wouter";

const C = {
  dark:  "#21141A",
  teal:  "#8CB2C0",
  light: "#FFFBF0",
};

export const NAV_HEIGHT = 80;

const LINK_STYLE: CSSProperties = {
  fontFamily: "DM Sans",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  const links = [
    { label: "Catalog",            href: "/catalog" },
    { label: "Services",           href: "/#about" },
    { label: "Turnkey Renovation", href: "/turnkey" },
    { label: "Why Georgia",        href: "/invest" },
    { label: "Mortgage",           href: "/mortgage" },
    { label: "Discovery Tour",     href: "/#discovery-tour" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: `${NAV_HEIGHT}px`,
        background: C.light,
        borderBottom: "1px solid rgba(33,20,26,0.08)",
        backdropFilter: "saturate(120%) blur(6px)",
      }}
    >
      <div
        style={{
          height: "100%",
          padding: "0 clamp(16px, 4vw, 32px)",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          columnGap: "16px",
        }}
      >
        {/* Logo — hidden on homepage */}
        {isHome ? (
          <div aria-hidden="true" style={{ width: "1px", height: "19px" }} />
        ) : (
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", height: "100%" }}>
            <img src="/logo-light-bg.png" alt="SITBO" style={{ height: "19px", objectFit: "contain" }} />
          </Link>
        )}

        {/* Desktop nav links — hidden on mobile via .nav-desktop-links CSS class */}
        <div className="nav-desktop-links" style={{ justifyContent: "center" }}>
          {links.map(l => (
            <Link
              key={l.label}
              href={l.href}
              style={{ ...LINK_STYLE, color: "rgba(0,0,0,0.8)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(0,0,0,1)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,0,0,0.8)")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right column: WhatsApp CTA (desktop) + Hamburger (mobile) */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifySelf: "end" }}>
          {/* WhatsApp icon — hidden on mobile via .nav-desktop-cta */}
          <div className="nav-desktop-cta">
            <a
              href="https://wa.me/995555505288"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "999px",
                background: "transparent",
                border: `1px solid ${C.teal}`,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = C.teal;
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 10px rgba(140,178,192,0.28)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </a>
          </div>

          {/* Hamburger — shown on mobile via .nav-hamburger CSS class */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: C.dark,
              fontSize: "22px",
              lineHeight: 1,
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: `${NAV_HEIGHT}px`,
            left: 0,
            right: 0,
            background: C.light,
            borderBottom: "1px solid rgba(33,20,26,0.08)",
            boxShadow: "0 8px 24px rgba(33,20,26,0.08)",
            padding: "8px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "0",
            zIndex: 99,
          }}
        >
          {links.map(l => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                ...LINK_STYLE,
                fontSize: "13px",
                color: "rgba(0,0,0,0.8)",
                padding: "13px 0",
                borderBottom: "1px solid rgba(33,20,26,0.06)",
                display: "block",
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/995555505288"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "16px",
              padding: "14px 20px",
              background: C.teal,
              borderRadius: "8px",
              textDecoration: "none",
              fontFamily: "DM Sans",
              fontWeight: 600,
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.dark,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}
