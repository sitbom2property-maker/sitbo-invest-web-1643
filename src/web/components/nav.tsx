import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { AppLink } from "./app-link";
import { NavLocaleSwitcher } from "./NavLocaleSwitcher";
import { RequestModal } from "./RequestModal";
import { useT, type MessageKey } from "../i18n";

export const NAV_HEIGHT = 88;
export const NAV_HEIGHT_MOBILE = 72;

const MOBILE_BP = 1024;

const ALL_LINKS: { labelKey: MessageKey; href: string }[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.about", href: "/services" },
  { labelKey: "nav.properties", href: "/catalog" },
  { labelKey: "nav.whyGeorgia", href: "/invest" },
  { labelKey: "nav.pricing", href: "/#consultation" },
  { labelKey: "nav.notes", href: "/blog" },
  { labelKey: "nav.feedback", href: "/#feedback" },
];

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
    if (href === "/") return location === "/" && !hash;
    if (href.startsWith("/#")) return location === "/" && hash === href.slice(1);
    if (href === "/history") return location === "/history" || location.startsWith("/history/");
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
  const style = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 400,
    letterSpacing: 0,
    color: "#FFFEF9",
    textTransform: "none" as const,
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
    transition: "opacity 0.2s",
    padding: "0 4px",
    opacity: isActive ? 1 : undefined,
  };

  const onMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) e.currentTarget.style.opacity = "0.6";
  };
  const onMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.opacity = "1";
  };

  // Hash links need AppLink so /#consultation scrolls to pricing on the homepage
  if (href.includes("#")) {
    return (
      <AppLink
        href={href}
        style={style}
        onNavigate={onNavigate}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </AppLink>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path d="M0 1h22M0 8h22M0 15h22" stroke="#FFFEF9" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Nav() {
  const [location] = useLocation();
  const isHome = location === "/";
  const isMobile = useIsMobile();
  const { isActive } = useNavActive();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const navHeight = isMobile ? NAV_HEIGHT_MOBILE : NAV_HEIGHT;

  const openContact = () => {
    setMenuOpen(false);
    setContactOpen(true);
  };

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

  const transparent = isHome && !scrolled && !menuOpen;
  const showSolid = !transparent;

  const navBackground = !showSolid
    ? "#21141A"
    : isMobile
      ? "rgba(33, 20, 26, 0.92)"
      : "rgba(33, 20, 26, 0.94)";

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
            maxWidth: "var(--site-max)",
            width: "100%",
            height: "100%",
            margin: "0 auto",
            padding: "0 var(--site-gutter)",
            display: "grid",
            // Mobile: language | menu — no logo
            gridTemplateColumns: isMobile ? "1fr auto" : "auto 1fr auto",
            alignItems: "center",
            columnGap: isMobile ? 8 : 32,
            boxSizing: "border-box",
          }}
        >
          {/* Left: language switcher */}
          <div
            style={{
              justifySelf: "start",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 0 : 22,
              minWidth: 0,
            }}
          >
            <NavLocaleSwitcher compact={isMobile} />
          </div>

          {/* Center: desktop links only */}
          {!isMobile ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
                flexWrap: "wrap",
              }}
            >
              {ALL_LINKS.map((l) => (
                <NavItem key={l.href} href={l.href} isActive={isActive(l.href)}>
                  {t(l.labelKey)}
                </NavItem>
              ))}
            </div>
          ) : null}

          {/* Contact CTA + menu — right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifySelf: "end",
              gap: isMobile ? 2 : 8,
            }}
          >
            {!isMobile && (
              <button
                type="button"
                onClick={openContact}
                style={{
                  marginLeft: 10,
                  padding: "12px 26px",
                  borderRadius: 2,
                  background: "transparent",
                  color: "#FFFEF9",
                  border: "1px solid rgba(255,255,255,0.55)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  fontWeight: 400,
                  letterSpacing: 0,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFFEF9";
                  e.currentTarget.style.color = "#21141A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#FFFEF9";
                }}
              >
                {t("nav.contactArthur")}
              </button>
            )}

            {isMobile && (
              <button
                type="button"
                aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  alignItems: "center",
                }}
              >
                <HamburgerIcon />
              </button>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && isMobile && (
        <div
          className="nav-mobile-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.openMenu")}
        >
          <button
            type="button"
            className="nav-mobile-close"
            aria-label={t("nav.closeMenu")}
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>

          <div className="nav-mobile-links">
            {ALL_LINKS.map((l) =>
              l.href.includes("#") ? (
                <AppLink
                  key={l.href}
                  href={l.href}
                  onNavigate={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(26px, 6.5vw, 40px)",
                    fontWeight: 400,
                    color: "#FFFEF9",
                    textTransform: "none",
                    letterSpacing: 0,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    textAlign: "center",
                  }}
                >
                  {t(l.labelKey)}
                </AppLink>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(26px, 6.5vw, 40px)",
                    fontWeight: 400,
                    color: "#FFFEF9",
                    textTransform: "none",
                    letterSpacing: 0,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFEF9")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#FFFEF9")
                  }
                >
                  {t(l.labelKey)}
                </Link>
              ),
            )}

            <button
              type="button"
              onClick={openContact}
              style={{
                marginTop: 12,
                padding: "15px 28px",
                borderRadius: 2,
                background: "#703C54",
                color: "#FFFEF9",
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("nav.contactArthur")}
            </button>
          </div>
        </div>
      )}

      <RequestModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        source="Nav — Contact"
        title={t("nav.contactArthur")}
      />
    </>
  );
}
