// lib/auth.ts — NextAuth config. Works without any env vars set.
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbQuery, hasDB } from "./db";
import bcrypt from "bcryptjs";

const providers: any[] = [];

// Google — only if keys exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const Google = require("next-auth/providers/google").default;
  providers.push(Google({
    clientId:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }));
}

// Credentials — always available (demo mode if no DB)
providers.push(CredentialsProvider({
  name: "Email & Password",
  credentials: {
    email:    { label: "Email",    type: "email"    },
    password: { label: "Password", type: "password" },
  },
  async authorize(creds) {
    if (!creds?.email || !creds?.password) return null;

    // No DB → demo login only
    if (!hasDB()) {
      if (creds.email === "demo@streamvault.com" && creds.password === "demo1234") {
        return { id: "1", name: "Demo User", email: "demo@streamvault.com" };
      }
      return null;
    }

    const [user] = await dbQuery`SELECT * FROM users WHERE email = ${creds.email}`;
    if (!user?.password) return null;
    const ok = await bcrypt.compare(creds.password, user.password);
    if (!ok) return null;
    return { id: String(user.id), name: user.name, email: user.email };
  },
}));

// DB adapter — only wired up when DATABASE_URL exists
function buildAdapter() {
  if (!hasDB()) return undefined;
  return {
    async createUser(u: any) {
      const [r] = await dbQuery`INSERT INTO users(name,email,image,email_verified) VALUES(${u.name},${u.email},${u.image},${u.emailVerified}) ON CONFLICT(email) DO UPDATE SET name=EXCLUDED.name RETURNING *`;
      return r ?? u;
    },
    async getUser(id: string) {
      const [r] = await dbQuery`SELECT * FROM users WHERE id=${parseInt(id)}`;
      return r ?? null;
    },
    async getUserByEmail(email: string) {
      const [r] = await dbQuery`SELECT * FROM users WHERE email=${email}`;
      return r ?? null;
    },
    async getUserByAccount({ provider, providerAccountId }: any) {
      const [r] = await dbQuery`SELECT u.* FROM users u JOIN accounts a ON a.user_id=u.id WHERE a.provider=${provider} AND a.provider_account_id=${providerAccountId}`;
      return r ?? null;
    },
    async updateUser(u: any) {
      const [r] = await dbQuery`UPDATE users SET name=${u.name},image=${u.image} WHERE id=${parseInt(u.id)} RETURNING *`;
      return r ?? u;
    },
    async linkAccount(a: any) {
      await dbQuery`INSERT INTO accounts(user_id,type,provider,provider_account_id,access_token,refresh_token,expires_at,token_type,scope,id_token) VALUES(${a.userId},${a.type},${a.provider},${a.providerAccountId},${a.access_token??null},${a.refresh_token??null},${a.expires_at??null},${a.token_type??null},${a.scope??null},${a.id_token??null}) ON CONFLICT DO NOTHING`;
    },
    async createSession(s: any) {
      const [r] = await dbQuery`INSERT INTO sessions(session_token,user_id,expires) VALUES(${s.sessionToken},${s.userId},${s.expires}) ON CONFLICT(session_token) DO UPDATE SET expires=EXCLUDED.expires RETURNING *`;
      return r ?? s;
    },
    async getSessionAndUser(token: string) {
      const [r] = await dbQuery`SELECT s.*,u.id as uid,u.name,u.email,u.image FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.session_token=${token} AND s.expires>NOW()`;
      if (!r) return null;
      return { session: { sessionToken: token, userId: r.uid, expires: r.expires }, user: { id: String(r.uid), name: r.name, email: r.email, image: r.image } };
    },
    async updateSession(s: any) {
      const [r] = await dbQuery`UPDATE sessions SET expires=${s.expires} WHERE session_token=${s.sessionToken} RETURNING *`;
      return r ?? null;
    },
    async deleteSession(token: string) {
      await dbQuery`DELETE FROM sessions WHERE session_token=${token}`;
    },
    async createVerificationToken(t: any) {
      const [r] = await dbQuery`INSERT INTO verification_tokens(identifier,token,expires) VALUES(${t.identifier},${t.token},${t.expires}) ON CONFLICT DO NOTHING RETURNING *`;
      return r ?? t;
    },
    async useVerificationToken({ identifier, token }: any) {
      const [r] = await dbQuery`DELETE FROM verification_tokens WHERE identifier=${identifier} AND token=${token} RETURNING *`;
      return r ?? null;
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter:   buildAdapter() as any,
  providers,
  session:   { strategy: hasDB() ? "database" : "jwt" },
  secret:    process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) (session.user as any).id = user?.id ?? token?.sub ?? "1";
      return session;
    },
  },
  pages: { signIn: "/auth/signin", error: "/auth/error" },
};
