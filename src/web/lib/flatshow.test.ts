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
  test("does not put the page hash into the query string", () => {
    (globalThis as { window?: { location: { origin: string; pathname: string; search: string } } }).window = {
      location: {
        origin: "https://sitboinvest.ge",
        pathname: "/project/piazza-residence",
        search: "",
      },
    };
    const src = flatshowEmbedFetchUrl("piazza", "ru");
    expect(src).toBe(
      "/api/flatshow/embed/piazza?lang=ru&parent=" +
        encodeURIComponent("https://sitboinvest.ge/project/piazza-residence"),
    );
    expect(src.includes("#")).toBe(false);
  });
});
