import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { AppLink } from "./app-link";
import { NavLocaleSwitcher } from "./NavLocaleSwitcher";
import { RequestModal } from "./RequestModal";
import { useT, type MessageKey } from "../i18n";

export const NAV_HEIGHT = 88;
export const NAV_HEIGHT_MOBILE = 72;

const MOBILE_BP = 1024;

type NavTone = "dark" | "light";

/** Matches hero mockup order */
const ALL_LINKS: { labelKey: MessageKey; href: string }[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.properties", href: "/catalog" },
  { labelKey: "nav.whyGeorgia", href: "/invest" },
  { labelKey: "nav.notes", href: "/blog" },
  { labelKey: "nav.feedback", href: "/#feedback" },
];

function useNavActive() {
  const [location] = useLocation();
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : "",
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
    typeof window !== "undefined" ? window.innerWidth <= bp : false,
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= bp);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);
  return mobile;
}

function parseCssColor(raw: string): { r: number; g: number; b: number; a: number } | null {
  const s = raw.trim().toLowerCase();
  if (!s || s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  const rgba = s.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/,
  );
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1];
    if (h.length === 3) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
        a: 1,
      };
    }
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1,
    };
  }
  return null;
}

function luminance(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Walk up from a point under the nav and find an opaque-ish surface color. */
function sampleSurfaceTone(): NavTone {
  if (typeof document === "undefined") return "dark";
  const y = Math.min(
    (Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-height"),
    ) || NAV_HEIGHT) + 2,
    window.innerHeight - 2,
  );
  const x = Math.round(window.innerWidth / 2);
  let el = document.elementFromPoint(x, y) as HTMLElement | null;

  // Ignore the nav itself / overlays
  while (
    el &&
    (el.tagName === "NAV" ||
      el.closest?.("nav") ||
      el.classList?.contains("nav-mobile-overlay") ||
      el.classList?.contains("ck") ||
      el.classList?.contains("float-consult"))
  ) {
    el = el.parentElement;
  }

  let node: HTMLElement | null = el;
  for (let i = 0; i < 12 && node; i++) {
    const bg = getComputedStyle(node).backgroundColor;
    const c = parseCssColor(bg);
    if (c && c.a >= 0.5) {
      return luminance(c.r, c.g, c.b) > 0.62 ? "light" : "dark";
    }
    node = node.parentElement;
  }

  const body = parseCssColor(getComputedStyle(document.body).backgroundColor);
  if (body && body.a >= 0.5) {
    return luminance(body.r, body.g, body.b) > 0.62 ? "light" : "dark";
  }
  return "dark";
}

function NavItem({
  href,
  children,
  isActive,
  onNavigate,
  tone,
}: {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  onNavigate?: () => void;
  tone: NavTone;
}) {
  const color = tone === "light" ? "#21141A" : "#FFFEF9";
  const style = {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 15,
    fontWeight: 400,
    letterSpacing: 0,
    color,
    textTransform: "none" as const,
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
    transition: "opacity 0.2s, color 0.25s",
    padding: "0 4px",
    opacity: isActive ? 1 : undefined,
  };

  const onMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) e.currentTarget.style.opacity = "0.65";
  };
  const onMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.opacity = "1";
  };

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

function HamburgerIcon({ tone }: { tone: NavTone }) {
  const stroke = tone === "light" ? "#21141A" : "#FFFEF9";
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path d="M0 1h22M0 8h22M0 15h22" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
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
  const [tone, setTone] = useState<NavTone>("dark");
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location]);

  // Sample page surface under the nav so chrome matches the current block.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Home hero: always dark chrome (white logo) over the photo.
        if (isHome && window.scrollY <= 40) {
          setTone("dark");
          return;
        }
        setTone(sampleSurfaceTone());
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Re-sample after route paint / images
    const t1 = window.setTimeout(update, 50);
    const t2 = window.setTimeout(update, 300);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [location, isHome]);

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

  // Home top only: fully transparent over hero. Everywhere else: solid matching the block;
  // after scroll: soft frosted tint of the same tone.
  const overHero = isHome && !scrolled && !menuOpen;
  const frosted = scrolled || menuOpen;

  const navBackground = overHero
    ? "transparent"
    : tone === "light"
      ? frosted
        ? "rgba(255, 254, 249, 0.72)"
        : "rgba(255, 254, 249, 0.94)"
      : frosted
        ? "rgba(33, 20, 26, 0.55)"
        : "rgba(33, 20, 26, 0.94)";

  const borderBottom = overHero
    ? "none"
    : tone === "light"
      ? "1px solid rgba(33,20,26,0.08)"
      : "1px solid rgba(255,255,249,0.08)";

  const logoSrc =
    tone === "light" ? "/brand/arthur-logo-black.png" : "/brand/arthur-logo-white.png";

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
          transition:
            "background-color 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
          // Use longhands only — Preact clears shorthand `background` when
          // backgroundImage is later set to "" / undefined.
          backgroundColor: navBackground,
          backgroundImage: "none",
          backdropFilter: overHero ? "none" : "blur(14px) saturate(1.15)",
          WebkitBackdropFilter: overHero ? "none" : "blur(14px) saturate(1.15)",
          borderBottom,
          boxShadow: "none",
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
            gridTemplateColumns: isMobile ? "auto 1fr auto" : "auto 1fr auto",
            alignItems: "center",
            columnGap: isMobile ? 12 : 28,
            boxSizing: "border-box",
          }}
        >
          {/* Left: arthur's logo */}
          <Link
            href="/"
            style={{
              justifySelf: "start",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              lineHeight: 0,
            }}
            aria-label="Arthur — Real Estate Strategist"
          >
            <img
              src={logoSrc}
              alt="arthur's — Real Estate Strategist"
              style={{
                height: isMobile ? 36 : 48,
                width: "auto",
                display: "block",
              }}
            />
          </Link>

          {/* Center: desktop links */}
          {!isMobile ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 26,
                flexWrap: "wrap",
              }}
            >
              {ALL_LINKS.map((l) => (
                <NavItem
                  key={l.href}
                  href={l.href}
                  isActive={isActive(l.href)}
                  tone={tone}
                >
                  {t(l.labelKey)}
                </NavItem>
              ))}
            </div>
          ) : (
            <div />
          )}

          {/* Right: locale + mobile menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifySelf: "end",
              gap: isMobile ? 4 : 8,
            }}
          >
            <NavLocaleSwitcher compact={isMobile} tone={tone} />

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
                <HamburgerIcon tone={tone} />
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
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "clamp(26px, 6.5vw, 40px)",
                    fontWeight: 400,
                    color: "#FFFEF9",
                    textTransform: "none",
                    letterSpacing: 0,
                    textDecoration: "none",
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
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "clamp(26px, 6.5vw, 40px)",
                    fontWeight: 400,
                    color: "#FFFEF9",
                    textTransform: "none",
                    letterSpacing: 0,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
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
                borderRadius: 8,
                background: "#703C54",
                color: "#FFFEF9",
                fontFamily: "Nunito, sans-serif",
                fontSize: 15,
                fontWeight: 500,
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
