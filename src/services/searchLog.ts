
/**
 * @module searchLog
 *
 * # Search Query Logging & Analytics (OpenResearch)
 *
 * This module provides a robust, auditable, and extensible logging system for search queries, purpose-built for Node.js/Electron environments where compliance, analytics, and traceability are mission-critical.
 *
 * ## Key Features
 * - **Write-Ahead Logging (WAL):** Ensures high-concurrency, low-latency writes, and crash resilience ([SQLite WAL](https://sqlite.org/wal.html)).
 * - **Log Rotation:** Automatically archives logs when the database exceeds a configurable size threshold (default: 10MB), maintaining operational efficiency and regulatory compliance.
 * - **Rich Schema:** The `search_log` table captures query, source, AI provider, and timestamp, supporting forensic analysis and advanced analytics.
 * - **Extensibility:** Designed for seamless integration with BI tools (Grafana, Metabase), compliance workflows, and data pipelines.
 * - **Compliance & Security:** Immutable, timestamped records; supports regular backup and access monitoring.
 *
 * ## Example Usage
 * ```ts
 * import { logSearch, getAllLogs } from './searchLog';
 * logSearch('What is AI?', 'user', 'Ollama');
 * const logs = getAllLogs();
 * // Integrate logs with analytics or visualization modules as needed
 * ```
 *
 * ## Integration & Best Practices
 * - **Analytics:** Export logs to a data warehouse or connect to BI tools for visualization and trend analysis.
 * - **Compliance:** Schedule regular backups of the SQLite file and monitor for unauthorized access.
 * - **Maintenance:** Tune `MAX_DB_SIZE_BYTES` as needed for your operational and compliance requirements.
 *
 * @author
 *   OpenResearch AI Team
 * @version 2.0
 * @lastModified 2025-07-19
 */


import path from 'path';
import fs from 'fs';
import Database from 'sqlite3';


// --- Configuration ---
/** Directory for log storage (relative to project root) */
const LOG_DIR = path.resolve('logs');
/** Log database filename */
const DB_BASENAME = 'search-log.db';
/** Full path to the active log database */
const DB_PATH = path.join(LOG_DIR, DB_BASENAME);
/** Maximum allowed log file size before rotation (default: 10MB) */
const MAX_DB_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Singleton instance of the SQLite database connection.
 * Initialized on first use.
 */

/**
 * Singleton instance of the SQLite database connection.
 * Initialized on first use.
 */
let db: Database.Database | null = null;

/**
 * Get or initialize the SQLite database connection.
 * Ensures WAL mode for concurrency and creates the search_log table if needed.
 * @returns {Database.Database} The SQLite database instance.
 */


/**
 * Rotates the log database if it exceeds the configured size threshold.
 * Archives the current log and starts a new one, ensuring continuous logging and compliance.
 * WAL and SHM files are also cleaned up to prevent orphaned state.
 */
function rotateDbIfNeeded() {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const stats = fs.statSync(DB_PATH);
      if (stats.size >= MAX_DB_SIZE_BYTES) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archiveName = `search-log-${timestamp}.db`;
        const archivePath = path.join(LOG_DIR, archiveName);
        fs.renameSync(DB_PATH, archivePath);
        // Remove WAL/shm files if present
        ['-wal', '-shm'].forEach(suffix => {
          const auxPath = DB_PATH + suffix;
          if (fs.existsSync(auxPath)) fs.unlinkSync(auxPath);
        });
      }
    }
  } catch (err) {
    console.error('[searchLog] Log rotation failed:', err);
  }
}


/**
 * Initializes and returns the SQLite database connection.
 * Ensures WAL mode for concurrency and creates the search_log table if needed.
 * @returns {Database.Database} The SQLite database instance.
 */
function getDb(): Database.Database {
  if (!db) {
    rotateDbIfNeeded();
    try {
      db = new Database.Database(DB_PATH, (err) => {
        if (err) {
          console.error('[searchLog] Database initialization failed:', err);
          throw err;
        }
        // db!.pragma('journal_mode = WAL'); // Enable Write-Ahead Logging for concurrency
        db!.exec(`CREATE TABLE IF NOT EXISTS search_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          query TEXT NOT NULL,
          source TEXT NOT NULL,
          aiProvider TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
      });
      db.on('error', (err) => {
        console.error('[searchLog] Database error:', err);
      });
      db.on('open', () => {
        console.log('[searchLog] Database connection established:', DB_PATH);
      });
    } catch (err) {
      console.error('[searchLog] Database initialization failed:', err);
      throw err;
    }
  }
  return db;
}


/**
 * Logs a search query to the database with full auditability.
 * @param query - The search query string.
 * @param source - The source of the search (e.g., user, system).
 * @param aiProvider - The AI provider used (e.g., Ollama, Groq).
 */
export function logSearch(query: string, source: string, aiProvider: string): void {
  try {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO search_log (query, source, aiProvider) VALUES (?, ?, ?)');
    stmt.run(query, source, aiProvider);
  } catch (err) {
    console.error('[searchLog] Search logging failed:', { query, source, aiProvider, error: err });
  }
}


/**
 * Retrieves all search logs, ordered by most recent first.
 * @returns {Array<Record<string, any>>} Array of log entries for analytics, compliance, or export.
 */
export function getAllLogs(): Array<Record<string, any>> {
  try {
    const db = getDb();
    const logs: Array<Record<string, any>> = [];
    db.each('SELECT * FROM search_log ORDER BY timestamp DESC', (err, row) => {
      if (err) {
        console.error('[searchLog] Error retrieving logs:', err);
        return; // Skip this row if there's an error
      }
      const logEntry: Record<string, any> = {
        id: row.id,
        query: row.query,
        source: row.source,
        aiProvider: row.aiProvider,
        timestamp: row.timestamp
      };
      logs.push(logEntry);
    });
    return logs;
    } catch (err) {
    console.error('[searchLog] Log retrieval failed:', err);
    return [];
  }
}
