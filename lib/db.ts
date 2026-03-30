let _sql: any = null;
function getSQL() {
  if (_sql) return _sql;
  if (!process.env.DATABASE_URL) return null;
  try { const { neon } = require("@neondatabase/serverless"); _sql = neon(process.env.DATABASE_URL); return _sql; }
  catch { return null; }
}
export async function db(s: TemplateStringsArray, ...v: any[]): Promise<any[]> {
  const sql = getSQL(); if (!sql) return [];
  try { return await sql(s, ...v); } catch (e: any) { console.error("[DB]", e?.message); return []; }
}
export const hasDB = () => !!process.env.DATABASE_URL;
