import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { Link } from "wouter";
import { Instagram, Mail, MessageCircle, Send } from "lucide-react";
import { AppLink } from "./app-link";

const C = {
  dark: "#21141A",
  light: "#FAF7F0",
  teal: "#8CB2C0",
};

const colTitleStyle: CSSProperties = {
  fontFamily: "Manrope, sans-serif",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: C.teal,
  margin: "0 0 24px 0",
};

const linkStyle: CSSProperties = {
  fontFamily: "Manrope, sans-serif",
  fontSize: 13,
  fontWeight: 400,
  color: C.light,
  opacity: 0.75,
  textDecoration: "none",
  transition: "opacity 0.2s",
};

function useFooterLayout() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    isStacked: width <= 1024,
    isBarStacked: width <= 640,
    sidePad: width <= 1024 ? 24 : 56,
  };
}

function FooterIcon({ name, size = 16 }: { name: string; size?: number }) {
  switch (name) {
    case "whatsapp":
      return <MessageCircle size={size} strokeWidth={1.5} />;
    case "email":
      return <Mail size={size} strokeWidth={1.5} />;
    case "instagram":
      return <Instagram size={size} strokeWidth={1.5} />;
    case "telegram":
      return <Send size={size} strokeWidth={1.5} />;
    default:
      return null;
  }
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 style={colTitleStyle}>{title}</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {links.map((link) => {
          const hover = {
            onMouseEnter: (e: MouseEvent<HTMLElement>) => {
              e.currentTarget.style.opacity = "1";
            },
            onMouseLeave: (e: MouseEvent<HTMLElement>) => {
              e.currentTarget.style.opacity = "0.75";
            },
          };

          if (link.href.includes("#")) {
            return (
              <li key={link.href}>
                <AppLink href={link.href} style={linkStyle} {...hover}>
                  {link.label}
                </AppLink>
              </li>
            );
          }

          return (
            <li key={link.href}>
              <Link href={link.href} style={linkStyle} {...hover}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FooterColExternal({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; icon: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 style={colTitleStyle}>{title}</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              style={{
                ...linkStyle,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.75";
              }}
            >
              <FooterIcon name={link.icon} size={16} />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { isStacked, isBarStacked, sidePad } = useFooterLayout();

  const barLinkStyle: CSSProperties = {
    color: "inherit",
    textDecoration: "none",
    opacity: 0.5,
    transition: "opacity 0.2s",
  };

  const barHover = {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      e.currentTarget.style.opacity = "1";
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      e.currentTarget.style.opacity = "0.5";
    },
  };

  return (
    <footer style={{ background: C.dark }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isStacked ? `96px ${sidePad}px 64px` : "96px 56px 64px",
          display: "grid",
          gridTemplateColumns: isStacked ? "1fr" : "1.1fr 2.4fr",
          gap: isStacked ? 48 : 80,
          alignItems: "start",
        }}
      >
        {/* Left: logo + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          <Link
            href="/"
            aria-label="SITBO Invest — Home"
            style={{
              display: "block",
              marginBottom: 24,
              lineHeight: 0,
              transition: "opacity 0.2s ease",
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
                height: 56,
                width: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Link>

          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.7,
              color: C.light,
              opacity: 0.6,
              maxWidth: 360,
              margin: 0,
            }}
          >
            Premium real estate investment advisory in Batumi, Georgia. Off-market access, legal security, honest
            returns.
          </p>
        </div>

        {/* Right: 4 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isStacked ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: 40,
          }}
        >
          <FooterCol
            title="Investments"
            links={[
              { label: "Properties", href: "/catalog" },
              { label: "Blog & Guides", href: "/blog" },
              /* TODO: создать страницу /about — пока якорь на главной */
              { label: "Partnership", href: "/#contact" },
            ]}
          />

          <FooterCol
            title="Services"
            links={[
              { label: "Due Diligence", href: "/services#due-diligence" },
              { label: "Discovery Tour", href: "/services#discovery-tour" },
              { label: "Mortgage", href: "/services#mortgage" },
              { label: "Property Management", href: "/services#management" },
              { label: "Residency & Relocation", href: "/services#residency" },
            ]}
          />

          <FooterColExternal
            title="Contact"
            links={[
              {
                label: "WhatsApp",
                href: "https://wa.me/995555505288",
                icon: "whatsapp",
                external: true,
              },
              {
                label: "sitboinvest@gmail.com",
                href: "mailto:sitboinvest@gmail.com",
                icon: "email",
                external: false,
              },
            ]}
          />

          <FooterColExternal
            title="Socials"
            links={[
              {
                label: "Instagram",
                href: "https://instagram.com/sitboinvest",
                icon: "instagram",
                external: true,
              },
              {
                label: "Telegram",
                href: "https://t.me/sitboinvest",
                icon: "telegram",
                external: true,
              },
            ]}
          />
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(250, 247, 240, 0.08)",
          maxWidth: 1280,
          margin: "0 auto",
          padding: isBarStacked ? "24px" : `24px ${sidePad}px`,
          display: "grid",
          gridTemplateColumns: isBarStacked ? "1fr" : "1fr auto 1fr",
          gap: isBarStacked ? 12 : 0,
          alignItems: "center",
          justifyItems: isBarStacked ? "center" : undefined,
          textAlign: isBarStacked ? "center" : undefined,
          fontFamily: "Manrope, sans-serif",
          fontSize: 11,
          fontWeight: 400,
          color: C.light,
        }}
      >
        <span style={{ justifySelf: isBarStacked ? "center" : "start", opacity: 0.5 }}>
          © 2026 Sitbo Invest. All rights reserved.
        </span>

        <a
          href="https://g.page/r/CR1_vKWcSyUNEAI/review"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...barLinkStyle,
            justifySelf: isBarStacked ? "center" : "center",
          }}
          {...barHover}
        >
          Leave us a Google Review ↗
        </a>

        <Link
          href="/legal"
          style={{
            ...barLinkStyle,
            justifySelf: isBarStacked ? "center" : "end",
          }}
          {...barHover}
        >
          Privacy Policy & Terms of Service
        </Link>
      </div>
    </footer>
  );
}
