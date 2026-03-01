// lib/db.ts — Safe Neon DB wrapper. Never crashes if DATABASE_URL is missing.
let _sql: any = null;

function getSQL() {
  if (_sql) return _sql;
  if (!process.env.DATABASE_URL) return null;
  try {
    const { neon } = require("@neondatabase/serverless");
    _sql = neon(process.env.DATABASE_URL);
    return _sql;
  } catch { return null; }
}

export async function db(strings: TemplateStringsArray, ...vals: any[]): Promise<any[]> {
  const sql = getSQL();
  if (!sql) return [];
  try { return await sql(strings, ...vals); }
  catch (e: any) { console.error("[DB]", e?.message); return []; }
}

export const hasDB = () => !!process.env.DATABASE_URL;
