import { useState } from "react";
import { Link } from "wouter";

const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  light:     "#FFFBF0",
  muted:     "#7a7a7a",
};

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Catalog",              href: "/catalog" },
    { label: "Services",             href: "/#about" },
    { label: "Turnkey Renovation",   href: "/turnkey" },
    { label: "Invest",               href: "/invest" },
    { label: "Mortgage",             href: "/mortgage" },
    { label: "Discovery Tour",       href: "/#discovery-tour" },
  ];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "64px", display: "flex", alignItems: "center", background: C.light, borderBottom: `1px solid rgba(33,20,26,0.08)` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/">
          <a style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo-light-bg.png" alt="SITBO" style={{ height: "19px", objectFit: "contain" }} />
          </a>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {links.map(l => (
            <Link key={l.label} href={l.href}>
              <a style={{ fontFamily: "DM Sans", fontSize: "0.73rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = C.teal)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                {l.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: C.dark, "@media (max-width: 768px)": { display: "block" } }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ position: "absolute", top: "64px", left: 0, right: 0, background: C.light, borderBottom: `1px solid rgba(33,20,26,0.08)`, padding: "16px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 99 }}>
          {links.map(l => (
            <Link key={l.label} href={l.href}>
              <a onClick={() => setMenuOpen(false)} style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: C.dark, textDecoration: "none", padding: "10px 0", borderBottom: `1px solid rgba(33,20,26,0.06)` }}>
                {l.label}
              </a>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
