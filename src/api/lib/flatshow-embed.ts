export type FlatshowEmbedKey = "piazza" | "parkline";

const PIAZZA_CLIENT = {
  en: "https://www.visarteam.tech/interactive-tools/piazza",
  ru: "https://centralmg.ge/ru/piazza/apartments",
} as const;

const PARKLINE_TOUR = {
  en: "https://flatshow.property/en/Parkline",
  ru: "https://flatshow.property/ru/Parkline",
} as const;

const PARKLINE_COMPLEX_ID = "fs_34rjn61f9b9dbvkt_uid";

const INDEX_HTML = "https://pro-api.flat.show/api/complex/website/index_html";

/** postMessage payload the injected hook sends to the parent Sitbo page. */
export const FLATSHOW_LEAD_MESSAGE = {
  source: "sitbo-flatshow",
  event: "request_call",
} as const;

export function embedSourceUrl(key: FlatshowEmbedKey, lang: "en" | "ru"): string {
  if (key === "piazza") {
    return `${INDEX_HTML}?clientPageUrl=${encodeURIComponent(PIAZZA_CLIENT[lang])}`;
  }
  return PARKLINE_TOUR[lang];
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Capture-phase hook: Request a call / contact-manager inside the Flat.show
 * SPA opens the developer's CRM modal. We stop that click and tell Sitbo to
 * open our own lead form (Odoo) instead.
 */
export const FLATSHOW_INTERCEPT_SCRIPT = `(function(){
  if (window.__sitboFsHook) return;
  window.__sitboFsHook = true;
  var CTA = /request a call|request call|заказать звонок|замовити дзвінок|оставить заявку|обратный звонок|contact with manager|связаться с менеджером|зв.?язатися з менеджером/i;
  var last = 0;
  function label(el){
    if (!el || !el.getAttribute) return "";
    return [el.getAttribute("aria-label"), el.getAttribute("title"), el.innerText, el.textContent]
      .filter(Boolean).join(" ").replace(/\\s+/g, " ").trim();
  }
  function isCta(el){
    if (!el || el.nodeType !== 1) return false;
    var cls = typeof el.className === "string" ? el.className : "";
    if (cls.indexOf("buttonRequestNow") !== -1) return true;
    var tag = el.tagName;
    if (tag !== "BUTTON" && tag !== "A" && el.getAttribute("role") !== "button") return false;
    var t = label(el);
    return !!t && t.length <= 72 && CTA.test(t);
  }
  function climb(el){
    for (var i = 0; el && i < 6; i++, el = el.parentElement) {
      if (isCta(el)) return el;
    }
    return null;
  }
  function notify(){
    var now = Date.now();
    if (now - last < 600) return;
    last = now;
    try { window.parent.postMessage({ source: "sitbo-flatshow", event: "request_call" }, "*"); } catch (e) {}
  }
  function hideLeadModal(){
    if (!last || Date.now() - last > 2500) return;
    var nodes = document.querySelectorAll('[role="dialog"], .MuiModal-root, .MuiDialog-root');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var hasPhone = n.querySelector('input[type="tel"], input[name*="phone" i], input[placeholder*="phone" i]');
      var txt = (n.textContent || "").toLowerCase();
      if (hasPhone || /request a call|phone number/.test(txt)) {
        n.style.setProperty("display", "none", "important");
        var back = document.querySelector(".MuiBackdrop-root");
        if (back) back.style.setProperty("display", "none", "important");
      }
    }
  }
  function onPointer(e){
    var t = e.target;
    if (t && t.closest && t.closest("canvas")) return;
    if (!climb(t)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    notify();
    hideLeadModal();
  }
  document.addEventListener("click", onPointer, true);
  document.addEventListener("pointerdown", onPointer, true);
  var obs = new MutationObserver(hideLeadModal);
  function start(){ if (document.body) obs.observe(document.body, { childList: true, subtree: true }); }
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();`;

export function rewriteFlatshowHtml(
  html: string,
  opts: { parentUrl?: string; complexId?: string },
): string {
  let out = html;

  if (opts.complexId) {
    out = out.replace(
      /window\.complexId\s*=\s*(["'])COMPLEX_ID\1/,
      `window.complexId=${JSON.stringify(opts.complexId)}`,
    );
  }

  if (opts.parentUrl && isHttpUrl(opts.parentUrl)) {
    if (/window\.realClientPageUrl\s*=/.test(out)) {
      out = out.replace(
        /window\.realClientPageUrl\s*=\s*(["']).*?\1/,
        `window.realClientPageUrl=${JSON.stringify(opts.parentUrl)}`,
      );
    } else {
      out = out.replace(
        /<head[^>]*>/i,
        (m) => `${m}<script>window.realClientPageUrl=${JSON.stringify(opts.parentUrl)}</script>`,
      );
    }
  }

  if (!out.includes("__sitboFsHook")) {
    const tag = `<script>${FLATSHOW_INTERCEPT_SCRIPT}</script>`;
    if (/<\/body>/i.test(out)) {
      out = out.replace(/<\/body>/i, `${tag}</body>`);
    } else {
      out += tag;
    }
  }

  return out;
}

export async function fetchFlatshowEmbedHtml(
  key: FlatshowEmbedKey,
  lang: "en" | "ru",
  parentUrl?: string,
): Promise<string> {
  const url = embedSourceUrl(key, lang);
  const res = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "SitboInvestEmbed/1.0",
    },
  });
  if (!res.ok) throw new Error(`Flat.show embed ${res.status}`);
  const html = await res.text();
  if (!html.includes("flatshow") && !html.includes("FLAT.SHOW") && !html.includes("complexId")) {
    throw new Error("Flat.show embed unexpected");
  }
  return rewriteFlatshowHtml(html, {
    parentUrl,
    complexId: key === "parkline" ? PARKLINE_COMPLEX_ID : undefined,
  });
}
