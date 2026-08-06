import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Cached on globalThis so Next.js dev-mode hot reload doesn't open a new
// SQLite connection (and file handle) on every module re-evaluation.
const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database;
};

const dbPath = process.env.DATABASE_URL ?? "./data/app.db";

const sqlite = globalForDb.sqlite ?? new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
