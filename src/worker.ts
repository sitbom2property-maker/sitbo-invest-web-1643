import app from "./api/index";

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      return app.fetch(request, env, ctx);
    }
    const assetResponse = await env.ASSETS.fetch(request).catch(() => null);
    if (assetResponse && assetResponse.status !== 404) {
      return assetResponse;
    }
    const indexRequest = new Request(new URL("/", url).toString(), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
