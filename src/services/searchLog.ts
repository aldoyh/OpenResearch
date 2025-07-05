import path from 'path';
import Database from 'better-sqlite3';

const DB_PATH = path.resolve('search-log.db');
let db: Database.Database | null = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`CREATE TABLE IF NOT EXISTS search_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      source TEXT NOT NULL,
      aiProvider TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
  return db;
}

export function logSearch(query: string, source: string, aiProvider: string) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO search_log (query, source, aiProvider) VALUES (?, ?, ?)');
  stmt.run(query, source, aiProvider);
}

export function getAllLogs() {
  const db = getDb();
  return db.prepare('SELECT * FROM search_log ORDER BY timestamp DESC').all();
}
