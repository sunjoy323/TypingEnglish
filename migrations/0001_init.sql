-- TypingEnglish D1 schema (users, sessions, game records)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  best_wpm INTEGER NOT NULL DEFAULT 0,
  best_accuracy INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  total_words_completed INTEGER NOT NULL DEFAULT 0,
  total_errors INTEGER NOT NULL DEFAULT 0,
  total_time_played INTEGER NOT NULL DEFAULT 0,
  settings_json TEXT NOT NULL DEFAULT '{}',
  unlocked_achievements_json TEXT NOT NULL DEFAULT '[]',
  difficulties_completed_json TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
CREATE INDEX IF NOT EXISTS idx_users_best_wpm ON users(best_wpm DESC);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS game_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  score INTEGER NOT NULL,
  wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  words_completed INTEGER NOT NULL,
  errors INTEGER NOT NULL,
  played_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_game_records_user_played_at ON game_records(user_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_records_played_at ON game_records(played_at DESC);

