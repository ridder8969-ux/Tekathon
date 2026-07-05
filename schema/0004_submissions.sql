-- ============================================================
--  Player Submissions Table
--  Tracks user-submitted Tekken IDs for data collection
-- ============================================================

CREATE TABLE IF NOT EXISTS submitted_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tekken_id TEXT NOT NULL UNIQUE,
  platform TEXT,
  notes TEXT,
  submitted_at TEXT NOT NULL,
  synced_at TEXT,
  status TEXT DEFAULT 'pending', -- pending, syncing, synced, failed
  sync_attempts INTEGER DEFAULT 0,
  last_sync_error TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_submitted_players_status ON submitted_players(status);
CREATE INDEX IF NOT EXISTS idx_submitted_players_tekken_id ON submitted_players(tekken_id);
CREATE INDEX IF NOT EXISTS idx_submitted_players_submitted_at ON submitted_players(submitted_at DESC);
