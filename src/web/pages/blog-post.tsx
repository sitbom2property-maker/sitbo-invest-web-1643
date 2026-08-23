import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { type BlogBlock } from "../data/blog-posts";
import { getPostBySlugLocalized } from "../data/blog-posts-locale";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";

const C = {
  dark: "#21141A",
  teal: "#703C54",
  wine: "#703C54",
  pageBg: "#FFFEF9",
  text: "#2C1F27",
  muted: "rgba(33,20,26,0.55)",
  light: "#FFFEF9",
};

const ARTICLE_STYLES = `
  .blog-post-page {
    background: #FFFEF9;
    min-height: 100vh;
  }
  .blog-hero-inner {
    max-width: var(--site-max);
    margin: 0 auto;
    padding: 0 var(--site-gutter);
    box-sizing: border-box;
  }
  .blog-article-body {
    max-width: var(--site-max);
    margin: 0 auto;
    padding: 0 var(--site-gutter);
    box-sizing: border-box;
    color: #2C1F27;
    font-family: Inter, sans-serif;
  }
  .blog-article-body .blog-p {
    font-family: Inter, sans-serif;
    font-size: 17px;
    line-height: 1.8;
    color: #2C1F27;
    margin: 0 0 24px;
  }
  .blog-article-body .blog-h2 {
    font-family: Coolvetica, Inter, sans-serif;
    font-size: 26px;
    font-weight: 400;
    color: #2C1F27;
    line-height: 1.25;
    margin: 48px 0 20px;
  }
  .blog-article-body .blog-ul {
    list-style: disc;
    margin: 0 0 24px;
    padding-left: 20px;
  }
  .blog-article-body .blog-li {
    font-family: Inter, sans-serif;
    font-size: 17px;
    line-height: 1.8;
    color: #2C1F27;
    margin-bottom: 12px;
    padding-left: 4px;
  }
  .blog-article-body .blog-li:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    .blog-hero-inner,
    .blog-article-body {
      max-width: 100%;
      padding-left: 20px;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .blog-article-body .blog-p,
    .blog-article-body .blog-li {
      font-size: 16px;
      line-height: 1.75;
    }
    .blog-article-body .blog-h2 {
      font-size: 20px;
      margin-top: 40px;
    }
    .blog-article-body .blog-ul {
      padding-left: 20px;
      padding-right: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
  }
`;

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

function BlockRenderer({ block }: { block: BlogBlock }) {
  if (block.type === "heading") {
    return <h2 className="blog-h2">{block.text}</h2>;
  }
  if (block.type === "list") {
    return (
      <ul className="blog-ul">
        {block.items.map((item, i) => (
          <li key={i} className="blog-li">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="blog-p">{block.text}</p>;
}

function CtaBlock({ isMobile }: { isMobile: boolean }) {
  const t = useT();

  return (
    <div
      style={{
        background: C.dark,
        borderRadius: "10px",
        padding: isMobile ? "32px 24px" : "48px",
        marginTop: "48px",
        marginBottom: "48px",
      }}
    >
      <h2
        style={{
          fontFamily: "Coolvetica, Inter, sans-serif",
          fontSize: "clamp(1.75rem,4vw,2.25rem)",
          fontWeight: 400,
          color: C.light,
          lineHeight: 1.15,
          margin: "0 0 16px",
        }}
      >
        {t("blogPost.readyTitle")}
      </h2>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.9rem",
          color: C.light,
          lineHeight: 1.75,
          margin: "0 0 32px",
          maxWidth: "520px",
        }}
      >
        {t("blogPost.readyBody")}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/#contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 28px",
            borderRadius: "8px",
            background: C.teal,
            color: C.light,
            fontFamily: "Inter, sans-serif",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {t("cta.requestConsultation")}
        </a>
        <a
          href="https://wa.me/995555505288"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 28px",
            borderRadius: "8px",
            background: "transparent",
            border: "1px solid rgba(255,254,249,0.5)",
            color: C.light,
            fontFamily: "Inter, sans-serif",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textDecoration: "none",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.light;
            e.currentTarget.style.background = "rgba(255,254,249,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,254,249,0.5)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

function AuthorBlock({ author }: { author: string }) {
  const t = useT();

  return (
    <div
      style={{
        display: "flex",
        gap: "18px",
        alignItems: "center",
        padding: "24px 28px",
        background: "#FFFEF9",
        borderRadius: "10px",
        border: "1px solid rgba(44,31,39,0.08)",
        boxShadow: "0 2px 12px rgba(33,20,26,0.04)",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src="/home/founder.png"
          alt={author}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 6px",
          }}
        >
          {t("blogPost.writtenBy")}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: C.text,
            margin: 0,
          }}
        >
          {author}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.85rem",
            color: C.muted,
            margin: "6px 0 0",
            lineHeight: 1.6,
          }}
        >
          {t("blogPost.authorRole")}
        </p>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const isMobile = useIsMobile();
  const t = useT();
  const { language } = useLocale();
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = getPostBySlugLocalized(slug, language);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <>
        <div
          className="blog-post-page"
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 20px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <h1
              style={{
                fontFamily: "Coolvetica, Inter, sans-serif",
                fontSize: "2rem",
                fontWeight: 400,
                color: C.text,
                margin: "0 0 16px",
              }}
            >
              {t("blogPost.notFoundTitle")}
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: C.muted, margin: "0 0 24px" }}>
              {t("blogPost.notFoundBody")}
            </p>
            <Link
              href="/blog"
              className="blog-back-link"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: C.teal,
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              {t("blogPost.backToBlog")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{ARTICLE_STYLES}</style>
      <div className="blog-post-page">
        <section style={{ background: C.dark, width: "100%", padding: "clamp(80px,10vw,140px) 0" }}>
          <div className="blog-hero-inner">
            <Link
              href="/blog"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: C.light,
                textDecoration: "none",
                letterSpacing: "0.06em",
                display: "inline-block",
                marginBottom: "28px",
              }}
            >
              {t("blogPost.backToBlog")}
            </Link>
            <div style={{ marginBottom: "24px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.light,
                  border: `1px solid rgba(255,254,249,0.35)`,
                  padding: "5px 12px",
                  borderRadius: "10px",
                }}
              >
                {post.category}
              </span>
            </div>
            <h1
              style={{
                fontFamily: "Coolvetica, Inter, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 400,
                color: C.light,
                lineHeight: 1.12,
                margin: "0 0 24px",
              }}
            >
              {post.title}
            </h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 16px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.82rem",
                color: C.light,
              }}
            >
              <span style={{ fontWeight: 600, color: C.light }}>{post.author}</span>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        <article
          style={{
            padding: "clamp(48px,6vw,96px) 0",
          }}
        >
          <div className="blog-article-body">
            {post.content.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
            <CtaBlock isMobile={isMobile} />
            <AuthorBlock author={post.author} />
          </div>
        </article>
      </div>
    </>
  );
}
