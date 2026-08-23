import { describe, expect, test } from "bun:test";
import { flatshowEmbedSrc, isFlatshowLeadMessage } from "./flatshow";

describe("isFlatshowLeadMessage", () => {
  test("accepts the intercept payload", () => {
    expect(isFlatshowLeadMessage({ source: "sitbo-flatshow", event: "request_call" })).toBe(true);
  });

  test("rejects Flat.show's own analytics ping", () => {
    expect(isFlatshowLeadMessage({ source: "flatshow_iframe", event: "request_plan" })).toBe(false);
    expect(isFlatshowLeadMessage({ type: "iFrameRequest" })).toBe(false);
    expect(isFlatshowLeadMessage(null)).toBe(false);
  });
});

describe("flatshowEmbedSrc", () => {
  test("keeps the widget hash after the query string", () => {
    (globalThis as { window?: { location: { href: string } } }).window = {
      location: { href: "https://sitboinvest.ge/project/piazza-residence" },
    };
    const src = flatshowEmbedSrc("piazza", "ru", "#/floors");
    expect(src.startsWith("/api/flatshow/embed/piazza?")).toBe(true);
    expect(src).toContain("lang=ru");
    expect(src).toContain("parent=" + encodeURIComponent("https://sitboinvest.ge/project/piazza-residence"));
    expect(src.endsWith("#/floors")).toBe(true);
  });
});
