import { useState, useEffect } from "react";
import { Link } from "wouter";
import { getAllPostsLocalized } from "../data/blog-posts-locale";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";

const C = {
  dark: "#21141A",
  teal: "#703C54",
  wine: "#703C54",
  light: "#FFFEF9",
  muted: "rgba(33,20,26,0.55)",
};

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return mobile;
}

function ArticleCard({
  slug,
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
}: {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#FFFEF9",
          borderRadius: "12px",
          padding: "clamp(24px,3vw,32px)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: hovered
            ? "0 12px 40px rgba(33,20,26,0.12)"
            : "0 2px 16px rgba(33,20,26,0.06)",
          transform: hovered ? "translateY(-4px)" : "none",
          transition: "box-shadow 0.3s, transform 0.3s",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "inline-block",
            alignSelf: "flex-start",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.teal,
            border: `1px solid ${C.teal}`,
            padding: "5px 12px",
            borderRadius: "100px",
            marginBottom: "18px",
          }}
        >
          {category}
        </span>
        <h2
          style={{
            fontFamily: "Coolvetica, Inter, sans-serif",
            fontSize: "clamp(1.25rem,2.5vw,1.5rem)",
            fontWeight: 400,
            color: C.dark,
            lineHeight: 1.25,
            margin: "0 0 14px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.88rem",
            color: C.muted,
            lineHeight: 1.75,
            margin: "0 0 24px",
            flex: 1,
          }}
        >
          {excerpt}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(33,20,26,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.75rem",
              color: C.muted,
            }}
          >
            <span style={{ fontWeight: 600, color: C.dark }}>{author}</span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span>{readTime}</span>
          </div>
          <div
            style={{
              flexShrink: 0,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: `1px solid ${hovered ? C.dark : "rgba(33,20,26,0.12)"}`,
              background: hovered ? C.dark : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.25s, border-color 0.25s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6h8M6 2l4 4-4 4"
                stroke={hovered ? C.light : C.dark}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const isMobile = useIsMobile();
  const t = useT();
  const { language } = useLocale();
  const posts = getAllPostsLocalized(language);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div style={{ background: C.light, minHeight: "100vh" }}>
        <section style={{ background: C.dark, width: "100%", padding: "clamp(80px,10vw,140px) 0" }}>
          <div className="site-wrap">
            <h1
              style={{
                fontFamily: "Coolvetica, Inter, sans-serif",
                fontSize: "clamp(2.4rem,5vw,4rem)",
                fontWeight: 400,
                color: C.light,
                lineHeight: 1.05,
                margin: "0 0 20px",
                maxWidth: "720px",
              }}
            >
              {t("blog.title")}
            </h1>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.88rem",
                color: "rgba(255,254,249,0.6)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "520px",
              }}
            >
              {t("blog.subtitle")}
            </p>
          </div>
        </section>

        <section
          style={{
            background: C.light,
            padding: "clamp(48px,6vw,80px) 0 clamp(64px,8vw,96px)",
          }}
        >
          <div className="site-wrap">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "clamp(24px,3vw,32px)",
              }}
            >
              {posts.map((post) => (
                <ArticleCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  date={post.date}
                  readTime={post.readTime}
                  category={post.category}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
