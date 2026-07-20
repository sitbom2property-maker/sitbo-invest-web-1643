import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { getPostBySlug, type BlogBlock } from "../data/blog-posts";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  wine: "#683D47",
  pageBg: "#FAF7F0",
  text: "#2C1F27",
  muted: "#7a7a7a",
  light: "#FFFBF0",
};

const ARTICLE_STYLES = `
  .blog-post-page {
    background: #FAF7F0;
    min-height: 100vh;
  }
  .blog-hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 0px);
  }
  .blog-article-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 0px);
    color: #2C1F27;
    font-family: Manrope, sans-serif;
  }
  .blog-article-body .blog-p {
    font-family: Manrope, sans-serif;
    font-size: 17px;
    line-height: 1.8;
    color: #2C1F27;
    margin: 0 0 24px;
  }
  .blog-article-body .blog-h2 {
    font-family: Jun, serif;
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
    font-family: Manrope, sans-serif;
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
  return (
    <div
      style={{
        background: C.dark,
        borderRadius: "16px",
        padding: isMobile ? "32px 24px" : "48px",
        marginTop: "48px",
        marginBottom: "48px",
      }}
    >
      <h2
        style={{
          fontFamily: "Jun, serif",
          fontSize: "clamp(1.75rem,4vw,2.25rem)",
          fontWeight: 400,
          color: C.light,
          lineHeight: 1.15,
          margin: "0 0 16px",
        }}
      >
        Ready to invest in Batumi?
      </h2>
      <p
        style={{
          fontFamily: "Manrope, sans-serif",
          fontSize: "0.9rem",
          color: "rgba(255,251,240,0.6)",
          lineHeight: 1.75,
          margin: "0 0 32px",
          maxWidth: "520px",
        }}
      >
        Book a free 30-minute strategy call. No catalog, no pressure — just honest numbers.
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
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Request a Consultation
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
            border: "1px solid rgba(255,251,240,0.5)",
            color: C.light,
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textDecoration: "none",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.light;
            e.currentTarget.style.background = "rgba(255,251,240,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,251,240,0.5)";
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
  return (
    <div
      style={{
        display: "flex",
        gap: "18px",
        alignItems: "center",
        padding: "24px 28px",
        background: "#FFFFFF",
        borderRadius: "12px",
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
          src="/founder.png"
          alt={author}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div>
        <p
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 6px",
          }}
        >
          Written by
        </p>
        <p
          style={{
            fontFamily: "Manrope, sans-serif",
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
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.85rem",
            color: C.muted,
            margin: "6px 0 0",
            lineHeight: 1.6,
          }}
        >
          Founder, SITBO Invest · Batumi real estate advisory
        </p>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const isMobile = useIsMobile();
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = getPostBySlug(slug);

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
                fontFamily: "Jun, serif",
                fontSize: "2rem",
                fontWeight: 400,
                color: C.text,
                margin: "0 0 16px",
              }}
            >
              Article not found
            </h1>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.9rem", color: C.muted, margin: "0 0 24px" }}>
              This article may have been moved or removed.
            </p>
            <Link
              href="/blog"
              className="blog-back-link"
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: C.teal,
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              ← Back to Blog
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
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: C.teal,
                textDecoration: "none",
                letterSpacing: "0.06em",
                display: "inline-block",
                marginBottom: "28px",
              }}
            >
              ← Back to Blog
            </Link>
            <div style={{ marginBottom: "24px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.teal,
                  border: `1px solid ${C.teal}`,
                  padding: "5px 12px",
                  borderRadius: "100px",
                }}
              >
                {post.category}
              </span>
            </div>
            <h1
              style={{
                fontFamily: "Jun, serif",
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
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.82rem",
                color: "rgba(255,251,240,0.55)",
              }}
            >
              <span style={{ fontWeight: 600, color: "rgba(255,251,240,0.75)" }}>{post.author}</span>
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
