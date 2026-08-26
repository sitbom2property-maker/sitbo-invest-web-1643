import { describe, expect, test } from "bun:test";
import { JSDOM } from "jsdom";
import { rewriteFlatshowHtml, FLATSHOW_INTERCEPT_SCRIPT, FLATSHOW_LEAD_MESSAGE } from "./flatshow-embed";

const SAMPLE = `<!DOCTYPE html><html><head></head><body>
<script>window.complexId="COMPLEX_ID"</script>
<script>window.realClientPageUrl="https://www.visarteam.tech/interactive-tools/piazza"</script>
<div id="root"></div></body></html>`;

describe("rewriteFlatshowHtml", () => {
  test("injects intercept hook and fills Parkline COMPLEX_ID without touching the client url", () => {
    const html = rewriteFlatshowHtml(SAMPLE, {
      complexId: "fs_34rjn61f9b9dbvkt_uid",
    });
    expect(html).toContain('window.complexId="fs_34rjn61f9b9dbvkt_uid"');
    expect(html).toContain('window.realClientPageUrl="https://www.visarteam.tech/interactive-tools/piazza"');
    expect(html).not.toContain("COMPLEX_ID");
    expect(html).not.toContain("sitboinvest.ge");
    expect(html).toContain("__sitboFsHook");
    expect(html).toContain(FLATSHOW_LEAD_MESSAGE.source);
    expect(html).toContain(FLATSHOW_LEAD_MESSAGE.event);
    expect(html.indexOf("__sitboFsHook")).toBeLessThan(html.lastIndexOf("</body>"));
  });

  test("keeps a real Piazza complexId as-is", () => {
    const piazza = SAMPLE.replace("COMPLEX_ID", "fs_xpoetz36bfjyf9k5_uid");
    const html = rewriteFlatshowHtml(piazza, { complexId: "fs_34rjn61f9b9dbvkt_uid" });
    expect(html).toContain('window.complexId="fs_xpoetz36bfjyf9k5_uid"');
    expect(html).not.toContain("fs_34rjn61f9b9dbvkt_uid");
  });

  test("does not double-inject the hook", () => {
    const once = rewriteFlatshowHtml(SAMPLE, {});
    const twice = rewriteFlatshowHtml(once, {});
    expect(twice.split("__sitboFsHook").length).toBe(once.split("__sitboFsHook").length);
  });

  test("clicking Request a call posts to the parent instead of opening a form", () => {
    const dom = new JSDOM(`<!DOCTYPE html><body>
      <button id="call">Request a call</button>
      <canvas></canvas>
    </body>`, { url: "https://sitboinvest.ge/api/flatshow/embed/piazza", runScripts: "dangerously" });
    const { window } = dom;
    const messages: unknown[] = [];
    (window.parent as Window).postMessage = ((data: unknown) => {
      messages.push(data);
    }) as Window["postMessage"];
    window.eval(FLATSHOW_INTERCEPT_SCRIPT);
    window.document.getElementById("call")!.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
    expect(messages).toEqual([FLATSHOW_LEAD_MESSAGE]);
  });

  test("Заказать звонок is intercepted the same way", () => {
    const dom = new JSDOM(`<!DOCTYPE html><body>
      <button id="call"><span>Заказать звонок</span></button>
    </body>`, { url: "https://sitboinvest.ge/api/flatshow/embed/piazza", runScripts: "dangerously" });
    const { window } = dom;
    const messages: unknown[] = [];
    (window.parent as Window).postMessage = ((data: unknown) => {
      messages.push(data);
    }) as Window["postMessage"];
    window.eval(FLATSHOW_INTERCEPT_SCRIPT);
    window.document.getElementById("call")!.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
    expect(messages).toEqual([FLATSHOW_LEAD_MESSAGE]);
  });

  test("3D canvas clicks are ignored", () => {
    const dom = new JSDOM(`<!DOCTYPE html><body><canvas id="c"></canvas></body>`, {
      url: "https://sitboinvest.ge/api/flatshow/embed/piazza",
      runScripts: "dangerously",
    });
    const { window } = dom;
    const messages: unknown[] = [];
    (window.parent as Window).postMessage = ((data: unknown) => {
      messages.push(data);
    }) as Window["postMessage"];
    window.eval(FLATSHOW_INTERCEPT_SCRIPT);
    window.document.getElementById("c")!.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
    expect(messages).toEqual([]);
  });
});
