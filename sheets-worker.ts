/**
 * Tiny Bun HTTP server that bridges API routes → Google Sheets via connector.
 * Runs on port 6475 locally (not exposed externally).
 */
import { $ } from "bun";

const PORT = 6475;
const SECRET = "sitbo-sheets-secret";

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    if (req.headers.get("x-secret") !== SECRET) return new Response("Unauthorized", { status: 401 });

    try {
      const { row } = await req.json() as { row: string[] };
      // Prefix values starting with + or = to prevent Sheets formula parsing
      const safeRow = row.map(cell => 
        typeof cell === 'string' && (cell.startsWith('+') || cell.startsWith('=') || cell.startsWith('-'))
          ? `'${cell}`
          : cell
      );
      const props = JSON.stringify({
        spreadsheetId: "1NO4m01el_qhPqWvr45Mk-T9bluUcrLoKMupVdhXuXnk",
        sheetName: "Leads",
        rows: JSON.stringify([safeRow]),
        hasHeaders: false,
      });

      const result = await $`connector run google_sheets google_sheets-add-rows ${props}`.text();
      console.log("[sheets-worker] appended:", result.trim());
      return Response.json({ ok: true });
    } catch (err) {
      console.error("[sheets-worker] error:", err);
      return Response.json({ ok: false, error: String(err) }, { status: 500 });
    }
  },
});

console.log(`[sheets-worker] listening on :${PORT}`);
