/**
 * Append lead rows to the Sitbo Google Sheet from Cloudflare Workers.
 *
 * Priority:
 * 1) SHEETS_WEBHOOK_URL — Google Apps Script web app (see scripts/leads-apps-script.gs)
 * 2) GOOGLE_SERVICE_ACCOUNT_JSON — Sheets API via service-account JWT
 * 3) localhost sheets-worker (Runable / local only)
 */

export const SHEETS_SPREADSHEET_ID =
  "1NO4m01el_qhPqWvr45Mk-T9bluUcrLoKMupVdhXuXnk";
export const SHEETS_SHEET_GID = 1664909573;
export const SHEETS_SHEET_NAME = "Leads";
export const SHEETS_BRIDGE_SECRET = "sitbo-sheets-secret";

const LOCAL_SHEETS_WORKER = "http://localhost:6475";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export type SheetsEnv = {
  SHEETS_WEBHOOK_URL?: string;
  GOOGLE_SERVICE_ACCOUNT_JSON?: string;
  SHEETS_SPREADSHEET_ID?: string;
  SHEETS_SHEET_NAME?: string;
  SHEETS_SHEET_GID?: string;
};

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

function sanitizeCell(cell: string): string {
  if (
    typeof cell === "string" &&
    (cell.startsWith("+") || cell.startsWith("=") || cell.startsWith("-"))
  ) {
    return `'${cell}`;
  }
  return cell;
}

function sanitizeRow(row: string[]): string[] {
  return row.map(sanitizeCell);
}

function b64url(data: ArrayBuffer | string): string {
  const bytes =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : new Uint8Array(data);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToBinary(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const raw = atob(b64);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

async function getGoogleAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SHEETS_SCOPE,
      aud: sa.token_uri || "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBinary(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${b64url(signature)}`;

  const tokenRes = await fetch(
    sa.token_uri || "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    },
  );
  if (!tokenRes.ok) {
    throw new Error(`google-token ${tokenRes.status}: ${await tokenRes.text()}`);
  }
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  if (!tokenJson.access_token) throw new Error("google-token: missing access_token");
  return tokenJson.access_token;
}

async function resolveSheetTitle(
  spreadsheetId: string,
  sheetGid: number,
  fallbackName: string,
  accessToken: string,
): Promise<string> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) return fallbackName;
  const json = (await res.json()) as {
    sheets?: { properties?: { sheetId?: number; title?: string } }[];
  };
  const match = json.sheets?.find((s) => s.properties?.sheetId === sheetGid);
  return match?.properties?.title || fallbackName;
}

async function appendViaSheetsApi(
  row: string[],
  env: SheetsEnv,
): Promise<void> {
  const raw = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");

  const sa = JSON.parse(raw) as ServiceAccount;
  if (!sa.client_email || !sa.private_key) {
    throw new Error("invalid GOOGLE_SERVICE_ACCOUNT_JSON");
  }

  const spreadsheetId = env.SHEETS_SPREADSHEET_ID || SHEETS_SPREADSHEET_ID;
  const sheetGid = Number(env.SHEETS_SHEET_GID || SHEETS_SHEET_GID);
  const fallbackName = env.SHEETS_SHEET_NAME || SHEETS_SHEET_NAME;
  const accessToken = await getGoogleAccessToken(sa);
  const title = await resolveSheetTitle(
    spreadsheetId,
    sheetGid,
    fallbackName,
    accessToken,
  );

  const range = `'${title.replace(/'/g, "''")}'!A:E`;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/` +
    `${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [sanitizeRow(row)] }),
  });
  if (!res.ok) {
    throw new Error(`sheets-api ${res.status}: ${await res.text()}`);
  }
}

async function appendViaWebhook(row: string[], webhookUrl: string): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      secret: SHEETS_BRIDGE_SECRET,
      spreadsheetId: SHEETS_SPREADSHEET_ID,
      sheetGid: SHEETS_SHEET_GID,
      row: sanitizeRow(row),
    }),
  });
  if (!res.ok) {
    throw new Error(`sheets-webhook ${res.status}: ${await res.text()}`);
  }
}

async function appendViaLocalWorker(row: string[]): Promise<void> {
  const res = await fetch(LOCAL_SHEETS_WORKER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret": SHEETS_BRIDGE_SECRET,
    },
    body: JSON.stringify({ row: sanitizeRow(row) }),
  });
  if (!res.ok) throw new Error(`sheets-worker ${res.status}`);
}

/** Append one lead row. Throws if every configured backend fails. */
export async function appendLeadRow(
  row: string[],
  env: SheetsEnv = {},
): Promise<{ via: string }> {
  const errors: string[] = [];

  if (env.SHEETS_WEBHOOK_URL) {
    try {
      await appendViaWebhook(row, env.SHEETS_WEBHOOK_URL);
      return { via: "webhook" };
    } catch (err) {
      errors.push(`webhook: ${String(err)}`);
    }
  }

  if (env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      await appendViaSheetsApi(row, env);
      return { via: "sheets-api" };
    } catch (err) {
      errors.push(`sheets-api: ${String(err)}`);
    }
  }

  try {
    await appendViaLocalWorker(row);
    return { via: "local-worker" };
  } catch (err) {
    errors.push(`local-worker: ${String(err)}`);
  }

  throw new Error(`All sheet backends failed: ${errors.join(" | ")}`);
}
