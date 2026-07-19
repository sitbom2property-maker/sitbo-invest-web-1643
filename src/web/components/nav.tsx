import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Globe as GlobeIcon } from "lucide-react";
import { LocaleModal } from "./LocaleModal";

export const NAV_HEIGHT = 88;
export const NAV_HEIGHT_MOBILE = 72;

const MOBILE_BP = 1024;

const LEFT_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/catalog" },
  { label: "Services", href: "/services" },
] as const;

const RIGHT_LINKS = [
  { label: "Why Georgia", href: "/invest" },
  { label: "About", href: "/#about" },
  { label: "Blog & Guide", href: "/blog" },
] as const;

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

function useNavActive() {
  const [location] = useLocation();
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    if (href === "/#about") return location === "/" && hash === "#about";
    if (href === "/catalog") return location === "/catalog" || location.startsWith("/project/");
    if (href === "/blog") return location === "/blog" || location.startsWith("/blog/");
    return location === href || location.startsWith(`${href}/`);
  };

  return { isActive };
}

function useIsMobile(bp = MOBILE_BP) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= bp : false
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= bp);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);
  return mobile;
}

function NavItem({
  href,
  children,
  isActive,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      style={{
        fontFamily: "Manrope, sans-serif",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.22em",
        color: "#FAF7F0",
        textTransform: "uppercase",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "opacity 0.2s",
        padding: "0 4px",
        opacity: isActive ? 1 : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.opacity = "0.6";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {children}
    </Link>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path d="M0 1h22M0 8h22M0 15h22" stroke="#FAF7F0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Nav() {
  const [location] = useLocation();
  const isHome = location === "/";
  const isMobile = useIsMobile();
  const { isActive } = useNavActive();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navHeight = isMobile ? NAV_HEIGHT_MOBILE : NAV_HEIGHT;

  useEffect(() => {
    document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
    return () => document.documentElement.style.removeProperty("--nav-height");
  }, [navHeight]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const transparent = isHome && !scrolled && !menuOpen && !langOpen;
  const showSolid = !transparent;

  const navBackground = !showSolid
    ? "transparent"
    : isMobile
      ? "rgba(33, 20, 26, 0.85)"
      : "rgba(33, 20, 26, 0.92)";

  const logoHeight = isMobile ? 22 : 26;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 100,
          height: navHeight,
          transition: "background 0.3s ease, backdrop-filter 0.3s ease",
          background: navBackground,
          backdropFilter: showSolid ? "blur(14px)" : "none",
          WebkitBackdropFilter: showSolid ? "blur(14px)" : "none",
          borderBottom: showSolid ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? undefined : 1680,
            height: "100%",
            margin: "0 auto",
            padding: isMobile ? "0 24px" : "0 56px",
            display: "grid",
            gridTemplateColumns: isMobile ? "auto 1fr auto" : "auto 1fr auto 1fr auto",
            alignItems: "center",
            gap: 0,
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setLangOpen(true)}
            aria-label="Language"
            aria-expanded={langOpen}
            style={{
              background: "none",
              border: "none",
              color: "#FAF7F0",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              alignItems: "center",
              opacity: 0.85,
              justifySelf: "start",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
          >
            <GlobeIcon size={18} />
          </button>

          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                gap: 8,
                paddingLeft: 64,
                paddingRight: 48,
              }}
            >
              {LEFT_LINKS.map((l) => (
                <NavItem key={l.href} href={l.href} isActive={isActive(l.href)}>
                  {l.label}
                </NavItem>
              ))}
            </div>
          )}

          <Link
            href="/"
            aria-label="SITBO Invest — Home"
            style={{
              display: "block",
              cursor: "pointer",
              lineHeight: 0,
              transition: "opacity 0.2s ease",
              justifySelf: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.75";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <img
              src="/logo-dark-bg.png"
              alt="SITBO Invest"
              style={{
                height: logoHeight,
                width: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Link>

          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                gap: 8,
                paddingLeft: 48,
                paddingRight: 64,
              }}
            >
              {RIGHT_LINKS.map((l) => (
                <NavItem key={l.href} href={l.href} isActive={isActive(l.href)}>
                  {l.label}
                </NavItem>
              ))}
            </div>
          )}

          {isMobile ? (
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                display: "flex",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                justifySelf: "end",
                alignItems: "center",
              }}
            >
              <HamburgerIcon />
            </button>
          ) : (
            <div style={{ width: 34, justifySelf: "end" }} aria-hidden="true" />
          )}
        </div>
      </nav>

      {menuOpen && isMobile && (
        <div
          className="nav-mobile-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            type="button"
            className="nav-mobile-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>

          {ALL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: "clamp(28px, 7vw, 42px)",
                fontWeight: 400,
                color: isActive(l.href) ? "#8CB2C0" : "#FAF7F0",
                textTransform: "none",
                letterSpacing: 0,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#8CB2C0")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isActive(l.href) ? "#8CB2C0" : "#FAF7F0")
              }
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <LocaleModal open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}
