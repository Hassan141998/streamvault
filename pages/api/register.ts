import type { NextApiRequest, NextApiResponse } from "next";
import { db, hasDB } from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!hasDB()) return res.status(503).json({ error: "Database not configured. Add DATABASE_URL to ..env.local" });

  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  const existing = await db`SELECT id FROM users WHERE email=${email}`;
  if (existing.length > 0) return res.status(409).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 12);
  const [user] = await db`
    INSERT INTO users(name, email, password)
    VALUES(${name}, ${email}, ${hash})
    RETURNING id, name, email`;

  return res.status(201).json({ user });
}
