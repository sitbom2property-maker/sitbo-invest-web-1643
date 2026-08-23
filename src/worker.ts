import app from "./api/index";

function withHtmlNoCache(response: Response): Response {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      return app.fetch(request, env, ctx);
    }
    const assetResponse = await env.ASSETS.fetch(request).catch(() => null);
    if (assetResponse && assetResponse.status !== 404) {
      return withHtmlNoCache(assetResponse);
    }
    const indexRequest = new Request(new URL("/", url).toString(), request);
    const indexResponse = await env.ASSETS.fetch(indexRequest);
    return withHtmlNoCache(indexResponse);
  }
};
