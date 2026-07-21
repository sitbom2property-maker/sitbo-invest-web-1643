/**
 * Sitbo Invest — lead intake for Google Sheet
 *
 * Target spreadsheet:
 *   https://docs.google.com/spreadsheets/d/1NO4m01el_qhPqWvr45Mk-T9bluUcrLoKMupVdhXuXnk/edit?gid=1664909573
 *
 * One-time setup (2 minutes):
 * 1. Open the spreadsheet above while logged into Google.
 * 2. Extensions → Apps Script
 * 3. Delete any stub code, paste THIS entire file, Save.
 * 4. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Authorize, then copy the Web app URL (.../exec)
 * 6. In Cloudflare Worker for sitbo-invest-web-1643, add secret/var:
 *      SHEETS_WEBHOOK_URL = <that URL>
 *    Or reply in Cursor with the URL so it can be hardcoded.
 */

var SECRET = "sitbo-sheets-secret";
var SPREADSHEET_ID = "1NO4m01el_qhPqWvr45Mk-T9bluUcrLoKMupVdhXuXnk";
var SHEET_GID = 1664909573;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) {
      return json_({ ok: false, error: "unauthorized" });
    }

    var row = data.row;
    if (!row || !row.length) {
      return json_({ ok: false, error: "empty row" });
    }

    var ss = SpreadsheetApp.openById(data.spreadsheetId || SPREADSHEET_ID);
    var sheet = ss.getSheetById(Number(data.sheetGid || SHEET_GID));
    if (!sheet) {
      sheet = ss.getSheetByName("Leads") || ss.getSheets()[0];
    }
    sheet.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: "sitbo-leads" });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
