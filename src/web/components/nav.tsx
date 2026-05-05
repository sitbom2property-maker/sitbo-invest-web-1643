import { useState, type CSSProperties } from "react";
import { Link } from "wouter";

const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  light:     "#FFFBF0",
  muted:     "#7a7a7a",
};

export const NAV_HEIGHT = 80;
const SIDE_PADDING = "32px";
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

  const links = [
    { label: "Catalog",              href: "/catalog" },
    { label: "Services",             href: "/#about" },
    { label: "Turnkey Renovation",   href: "/turnkey" },
    { label: "Why Georgia",          href: "/invest" },
    { label: "Mortgage",             href: "/mortgage" },
    { label: "Discovery Tour",       href: "/#discovery-tour" },
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
          padding: `0 ${SIDE_PADDING}`,
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          columnGap: "24px",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", height: "100%" }}>
          <img src="/logo-light-bg.png" alt="SITBO" style={{ height: "19px", objectFit: "contain" }} />
        </Link>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", minWidth: 0 }}>
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

        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifySelf: "end" }}>
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.teal}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "stroke 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.stroke = C.dark)}
              onMouseLeave={e => (e.currentTarget.style.stroke = C.teal)}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "8px", marginRight: "20px", fontSize: "24px", color: C.dark }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
        ☰
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "absolute", top: `${NAV_HEIGHT}px`, left: 0, right: 0, background: C.light, borderBottom: `1px solid rgba(33,20,26,0.08)`, padding: "16px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 99 }}>
          {links.map(l => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ ...LINK_STYLE, fontSize: "14px", color: "rgba(0,0,0,0.8)", padding: "10px 0", borderBottom: `1px solid rgba(33,20,26,0.06)` }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
