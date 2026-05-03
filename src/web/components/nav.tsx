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
    { label: "Why Georgia",          href: "/invest" },
    { label: "Mortgage",             href: "/mortgage" },
    { label: "Discovery Tour",       href: "/#discovery-tour" },
  ];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "64px", display: "flex", alignItems: "center", background: C.light, borderBottom: `1px solid rgba(33,20,26,0.08)` }}>
      {/* Logo — left */}
      <Link href="/">
        <a style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0, marginLeft: "45px" }}>
          <img src="/logo-light-bg.png" alt="SITBO" style={{ height: "19px", objectFit: "contain" }} />
        </a>
      </Link>

      {/* Desktop links — centered */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "24px", alignItems: "center" }}>
        {links.map(l => (
          <Link key={l.label} href={l.href}>
            <a style={{ fontFamily: "DM Sans", fontSize: "0.73rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = C.teal)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {l.label}
            </a>
          </Link>
        ))}
      </div>

      {/* WhatsApp button — right */}
      <div style={{ marginLeft: "auto", marginRight: "40px", display: "flex", gap: "12px", alignItems: "center" }}>
        <a href="https://wa.me/995555505288" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", background: "transparent", border: `1.5px solid ${C.teal}`, textDecoration: "none", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.teal; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px rgba(140,178,192,0.3)`; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }} onMouseEnter={e => (e.currentTarget.style.stroke = C.dark)} onMouseLeave={e => (e.currentTarget.style.stroke = C.teal)}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "8px", marginRight: "20px", fontSize: "24px", color: C.dark }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
        ☰
      </button>

      {/* Mobile menu */}
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
