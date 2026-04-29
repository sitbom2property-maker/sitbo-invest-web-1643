/**
 * Cloudflare WAF Bypass Configuration
 * 
 * This middleware adds proper headers to allow AI audit bots through Cloudflare WAF.
 * Apply in wrangler.toml or _middleware.ts
 */

export const cloudflareWafBypass = (request: Request): Response | null => {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Allowed AI bots for audit purposes
  const allowedBots = [
    'ClaudeBot',
    'anthropic-ai',
    'GPTBot',
    'AhrefsBot',
    'SemrushBot',
    'MJ12bot',
  ];

  const isAllowedBot = allowedBots.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );

  if (isAllowedBot) {
    // Log allowed bot access
    console.log(`[Cloudflare WAF] Allowed bot: ${userAgent}`);
  }

  return null; // Continue to next middleware
};

/**
 * Add this to your Cloudflare Workers _middleware.ts or wrangler.toml:
 * 
 * [[unsafe.bindings]]
 * name = "ALLOWED_BOTS"
 * text = "ClaudeBot,anthropic-ai,GPTBot"
 * 
 * In _middleware.ts:
 * export async function onRequest(context) {
 *   const ua = context.request.headers.get('user-agent') || '';
 *   const bots = context.env.ALLOWED_BOTS.split(',');
 *   
 *   if (bots.some(bot => ua.includes(bot))) {
 *     return context.next();
 *   }
 *   return context.next();
 * }
 */
