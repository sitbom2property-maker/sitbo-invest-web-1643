import { describe, expect, test } from "bun:test";
import { flatshowEmbedFetchUrl, isFlatshowLeadMessage } from "./flatshow";

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

describe("flatshowEmbedFetchUrl", () => {
  test("points at the embed API without a parent rewrite query", () => {
    const src = flatshowEmbedFetchUrl("piazza", "ru");
    expect(src).toBe("/api/flatshow/embed/piazza?lang=ru");
    expect(src).not.toContain("parent=");
  });
});
