import { projects } from "../data/projects";

export const SITE_NAME = "Arthur Arutiunyan — Private Property Advisor";
export const DEFAULT_DESCRIPTION =
  "Premium real estate investment advisory in Batumi, Georgia. Off-market deals, legal verification, and honest ROI analysis.";
export const DEFAULT_OG_IMAGE = "/brand/og-default.jpg";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 591;

export type PageMeta = {
  title: string;
  description: string;
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  path: string;
  type: "website" | "article";
};

function absoluteUrl(origin: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin.replace(/\/$/, "")}${path}`;
}

function clip(text: string, max = 200): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** First / main project photo for social previews. */
export function projectOgImage(slug: string): string | null {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  return p.photos[0] || p.cardImage || null;
}

export function resolvePageMeta(pathname: string): PageMeta {
  const path = pathname.split("?")[0].replace(/\/+$/, "") || "/";

  const projectMatch = path.match(/^\/project\/([^/]+)$/);
  if (projectMatch) {
    const project = projects.find((p) => p.slug === projectMatch[1]);
    if (project) {
      const imagePath = project.photos[0] || project.cardImage || DEFAULT_OG_IMAGE;
      return {
        title: `${project.name} | ${SITE_NAME}`,
        description: clip(project.desc || DEFAULT_DESCRIPTION),
        imagePath,
        imageWidth: DEFAULT_OG_IMAGE_WIDTH,
        imageHeight: DEFAULT_OG_IMAGE_HEIGHT,
        path: `/project/${project.slug}`,
        type: "website",
      };
    }
  }

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return {
      title: `${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      imagePath: DEFAULT_OG_IMAGE,
      imageWidth: DEFAULT_OG_IMAGE_WIDTH,
      imageHeight: DEFAULT_OG_IMAGE_HEIGHT,
      path,
      type: "article",
    };
  }

  const pageTitles: Record<string, string> = {
    "/": SITE_NAME,
    "/catalog": `Catalog | ${SITE_NAME}`,
    "/invest": `Why Georgia | ${SITE_NAME}`,
    "/mortgage": `Mortgage | ${SITE_NAME}`,
    "/turnkey": `Turnkey | ${SITE_NAME}`,
    "/services": `Services | ${SITE_NAME}`,
    "/legal": `Legal | ${SITE_NAME}`,
    "/blog": `Blog | ${SITE_NAME}`,
    "/history": `History | ${SITE_NAME}`,
  };

  return {
    title: pageTitles[path] || SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    imagePath: DEFAULT_OG_IMAGE,
    imageWidth: DEFAULT_OG_IMAGE_WIDTH,
    imageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    path,
    type: "website",
  };
}

export function absolutePageMeta(pathname: string, origin: string) {
  const meta = resolvePageMeta(pathname);
  return {
    ...meta,
    imageUrl: absoluteUrl(origin, meta.imagePath),
    pageUrl: absoluteUrl(origin, meta.path === "/" ? "/" : meta.path),
  };
}

/** Apply document head tags in the browser (SPA navigations). */
export function applyDocumentMeta(pathname: string, origin = typeof window !== "undefined" ? window.location.origin : "https://sitboinvest.ge") {
  const meta = absolutePageMeta(pathname, origin);
  document.title = meta.title;

  const upsert = (selector: string, attrs: Record<string, string>, createTag: "meta" | "link" = "meta") => {
    let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
    if (!el) {
      el = document.createElement(createTag);
      document.head.appendChild(el);
    }
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
  };

  upsert('meta[name="description"]', { name: "description", content: meta.description });
  upsert('meta[property="og:title"]', { property: "og:title", content: meta.title });
  upsert('meta[property="og:description"]', { property: "og:description", content: meta.description });
  upsert('meta[property="og:image"]', { property: "og:image", content: meta.imageUrl });
  upsert('meta[property="og:image:width"]', { property: "og:image:width", content: String(meta.imageWidth) });
  upsert('meta[property="og:image:height"]', { property: "og:image:height", content: String(meta.imageHeight) });
  upsert('meta[property="og:url"]', { property: "og:url", content: meta.pageUrl });
  upsert('meta[property="og:type"]', { property: "og:type", content: meta.type });
  upsert('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
  upsert('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsert('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
  upsert('meta[name="twitter:description"]', { name: "twitter:description", content: meta.description });
  upsert('meta[name="twitter:image"]', { name: "twitter:image", content: meta.imageUrl });
  upsert('link[rel="canonical"]', { rel: "canonical", href: meta.pageUrl }, "link");
}
