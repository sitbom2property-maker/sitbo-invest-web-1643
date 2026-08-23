import app from "./api/index";
import { SITE_NAME, absolutePageMeta } from "./web/lib/seo";

function applySeoMeta(response: Response, pathname: string, origin: string): Response {
  const meta = absolutePageMeta(pathname, origin);

  return new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(meta.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", meta.description);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute("content", meta.title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute("content", meta.description);
      },
    })
    .on('meta[property="og:image"]', {
      element(el) {
        el.setAttribute("content", meta.imageUrl);
      },
    })
    .on('meta[property="og:image:width"]', {
      element(el) {
        el.setAttribute("content", String(meta.imageWidth));
      },
    })
    .on('meta[property="og:image:height"]', {
      element(el) {
        el.setAttribute("content", String(meta.imageHeight));
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute("content", meta.pageUrl);
      },
    })
    .on('meta[property="og:type"]', {
      element(el) {
        el.setAttribute("content", meta.type);
      },
    })
    .on('meta[property="og:site_name"]', {
      element(el) {
        el.setAttribute("content", SITE_NAME);
      },
    })
    .on('meta[name="twitter:card"]', {
      element(el) {
        el.setAttribute("content", "summary_large_image");
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute("content", meta.title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute("content", meta.description);
      },
    })
    .on('meta[name="twitter:image"]', {
      element(el) {
        el.setAttribute("content", meta.imageUrl);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute("href", meta.pageUrl);
      },
    })
    .transform(response);
}

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      return app.fetch(request, env, ctx);
    }

    let assetResponse: Response | null = await env.ASSETS.fetch(request).catch(() => null);
    if (!assetResponse || assetResponse.status === 404) {
      const indexRequest = new Request(new URL("/", url).toString(), request);
      assetResponse = await env.ASSETS.fetch(indexRequest);
    }

    const contentType = assetResponse.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      return applySeoMeta(assetResponse, url.pathname, url.origin);
    }

    return assetResponse;
  },
};
