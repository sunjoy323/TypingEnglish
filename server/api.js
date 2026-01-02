const SESSION_COOKIE_NAME = 'te_session';
const SESSION_TTL_DAYS = 30;
// Cloudflare Workers WebCrypto currently rejects PBKDF2 iteration counts > 100000.
const PBKDF2_MAX_ITERATIONS = 100_000;
const PBKDF2_ITERATIONS = PBKDF2_MAX_ITERATIONS;

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 1,
    name: '打字新手',
    description: '完成第一局游戏',
    icon: 'fa-keyboard-o',
    medal: 'bronze',
    points: 10,
    conditionType: 'games_played',
    conditionValue: 1
  },
  {
    id: 2,
    name: '速度之星',
    description: '打字速度达到50 WPM',
    icon: 'fa-bolt',
    medal: 'silver',
    points: 25,
    conditionType: 'wpm',
    conditionValue: 50
  },
  {
    id: 3,
    name: '精准大师',
    description: '准确率达到95%',
    icon: 'fa-bullseye',
    medal: 'silver',
    points: 25,
    conditionType: 'accuracy',
    conditionValue: 95
  },
  {
    id: 4,
    name: '百词斩',
    description: '累计完成100个单词',
    icon: 'fa-flag-checkered',
    medal: 'bronze',
    points: 15,
    conditionType: 'words_completed',
    conditionValue: 100
  },
  {
    id: 5,
    name: '专家挑战者',
    description: '在专家难度下完成游戏',
    icon: 'fa-graduation-cap',
    medal: 'gold',
    points: 50,
    conditionType: 'expert_completion',
    conditionValue: 1
  },
  {
    id: 6,
    name: '马拉松选手',
    description: '完成10局游戏',
    icon: 'fa-road',
    medal: 'bronze',
    points: 20,
    conditionType: 'games_played',
    conditionValue: 10
  },
  {
    id: 7,
    name: '极速传说',
    description: '打字速度达到100 WPM',
    icon: 'fa-rocket',
    medal: 'gold',
    points: 100,
    conditionType: 'wpm',
    conditionValue: 100
  },
  {
    id: 8,
    name: '完美主义',
    description: '准确率达到100%',
    icon: 'fa-star',
    medal: 'gold',
    points: 50,
    conditionType: 'accuracy',
    conditionValue: 100
  },
  {
    id: 9,
    name: '单词达人',
    description: '累计完成500个单词',
    icon: 'fa-trophy',
    medal: 'silver',
    points: 40,
    conditionType: 'words_completed',
    conditionValue: 500
  },
  {
    id: 10,
    name: '全能玩家',
    description: '在所有难度下都完成游戏',
    icon: 'fa-globe',
    medal: 'gold',
    points: 75,
    conditionType: 'all_difficulties',
    conditionValue: 1
  }
];

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}

function error(message, status = 400, extra = {}) {
  return json({ success: false, message, ...extra }, { status });
}

function ok(data = {}, init = {}) {
  return json({ success: true, ...data }, init);
}

function mapInternalError(err) {
  const raw = err instanceof Error ? err.message : String(err);

  if (raw.includes('Missing D1 binding')) {
    return {
      status: 503,
      code: 'DB_NOT_BOUND',
      message: '服务端未配置数据库（D1）。请在 Cloudflare 中绑定 D1：变量名必须为 DB，并执行数据库迁移后再试。'
    };
  }

  if (raw.includes('no such table')) {
    return {
      status: 503,
      code: 'DB_SCHEMA_MISSING',
      message: '数据库尚未初始化（缺少表）。请先执行 D1 migrations（migrations/0001_init.sql），再重试。'
    };
  }

  if (raw.includes('no such column') || raw.includes('has no column named')) {
    return {
      status: 503,
      code: 'DB_SCHEMA_MISSING',
      message: '数据库表结构不匹配（缺少字段）。请更新并执行最新的 D1 migrations，再重试。'
    };
  }

  if (raw.includes('UNIQUE constraint failed: users.username')) {
    return { status: 409, code: 'USERNAME_TAKEN', message: '用户名已存在' };
  }

  if (raw.includes('UNIQUE constraint failed: users.email')) {
    return { status: 409, code: 'EMAIL_TAKEN', message: '邮箱已被注册' };
  }

  if (
    raw.includes('script exceeded time limit') ||
    raw.includes('CPU time') ||
    raw.includes('exceeded CPU time') ||
    raw.includes('exceeded time limit')
  ) {
    return { status: 503, code: 'TIME_LIMIT', message: '服务器繁忙，请稍后重试' };
  }

  return { status: 500, code: 'INTERNAL_ERROR', message: '服务器内部错误，请稍后重试' };
}

function uuidv4() {
  if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function safe(handler) {
  try {
    return await handler();
  } catch (err) {
    const errorId = uuidv4();
    console.error(`[TypingEnglish API Error] ${errorId}`, err);
    const mapped = mapInternalError(err);
    return error(mapped.message, mapped.status, { code: mapped.code, errorId });
  }
}

function normalizeString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function isValidUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampInt(value, min, max) {
  const num = Number.parseInt(String(value), 10);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, num));
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const parts = header.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

function base64UrlEncode(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(text) {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(text.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(digest);
}

async function pbkdf2Hash(password, saltBytes, iterations) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits'
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await pbkdf2Hash(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${base64UrlEncode(salt)}$${base64UrlEncode(derived)}`;
}

async function verifyPassword(password, stored) {
  const parts = String(stored).split('$');
  if (parts.length !== 4) return false;
  const [algo, iterationsText, saltB64, hashB64] = parts;
  if (algo !== 'pbkdf2_sha256') return false;
  const iterations = Number.parseInt(iterationsText, 10);
  if (!Number.isFinite(iterations) || iterations < 10_000) return false;
  if (iterations > PBKDF2_MAX_ITERATIONS) return false;
  const salt = base64UrlDecode(saltB64);
  const expected = base64UrlDecode(hashB64);
  const derived = await pbkdf2Hash(password, salt, iterations);
  return timingSafeEqual(expected, derived);
}

function buildSessionCookieValue({ token, requestUrl, maxAgeSeconds }) {
  const url = typeof requestUrl === 'string' ? new URL(requestUrl) : requestUrl;
  const secure = url.protocol === 'https:';
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

function buildLogoutCookieValue({ requestUrl }) {
  const url = typeof requestUrl === 'string' ? new URL(requestUrl) : requestUrl;
  const secure = url.protocol === 'https:';
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0'
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

function parseJsonField(text, fallback) {
  if (typeof text !== 'string' || text.length === 0) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function toUserDto(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    createdAt: row.created_at,
    stats: {
      points: row.points,
      bestWPM: row.best_wpm,
      bestAccuracy: row.best_accuracy,
      gamesPlayed: row.games_played,
      totalWordsCompleted: row.total_words_completed,
      totalErrors: row.total_errors,
      totalTimePlayed: row.total_time_played
    },
    settings: {
      soundEnabled: true,
      highlightEnabled: true,
      gameDuration: 120,
      soundVolume: 0.5,
      ...parseJsonField(row.settings_json, {})
    },
    unlockedAchievements: parseJsonField(row.unlocked_achievements_json, []),
    difficultiesCompleted: parseJsonField(row.difficulties_completed_json, [])
  };
}

function weekStartUtcMs(nowMs) {
  const d = new Date(nowMs);
  const day = d.getUTCDay(); // 0..6 (Sun..Sat)
  const diffFromMonday = (day + 6) % 7; // Mon=0, Sun=6
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diffFromMonday);
}

async function requireDb(env) {
  if (!env || !env.DB) {
    throw new Error('Missing D1 binding: env.DB');
  }
  return env.DB;
}

async function cleanupExpiredSessions(db, nowMs) {
  await db.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(nowMs).run();
}

async function getUserBySession(request, env) {
  const token = getCookie(request, SESSION_COOKIE_NAME);
  if (!token) return null;

  const db = await requireDb(env);
  const now = Date.now();
  await cleanupExpiredSessions(db, now);

  const tokenHash = base64UrlEncode(await sha256(new TextEncoder().encode(token)));
  const row = await db
    .prepare(
      `
      SELECT u.*
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ?
      LIMIT 1
    `
    )
    .bind(tokenHash, now)
    .first();

  if (!row) return null;
  return toUserDto(row);
}

async function createSessionForUser(request, env, userId) {
  const db = await requireDb(env);
  const now = Date.now();
  const maxAgeSeconds = SESSION_TTL_DAYS * 24 * 60 * 60;
  const expiresAt = now + maxAgeSeconds * 1000;
  const token = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = base64UrlEncode(await sha256(new TextEncoder().encode(token)));

  const sessionId = uuidv4();
  await db
    .prepare('INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(sessionId, userId, tokenHash, now, expiresAt)
    .run();

  return {
    cookie: buildSessionCookieValue({ token, requestUrl: request.url, maxAgeSeconds }),
    expiresAt
  };
}

async function deleteSession(request, env) {
  const token = getCookie(request, SESSION_COOKIE_NAME);
  if (!token) return;

  const db = await requireDb(env);
  const tokenHash = base64UrlEncode(await sha256(new TextEncoder().encode(token)));
  await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
}

function checkAchievementsAndApply(userDto) {
  const newlyUnlocked = [];
  const unlocked = new Set((userDto.unlockedAchievements || []).map((id) => Number(id)));

  for (const achievement of DEFAULT_ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;

    let isUnlocked = false;
    switch (achievement.conditionType) {
      case 'games_played':
        isUnlocked = userDto.stats.gamesPlayed >= achievement.conditionValue;
        break;
      case 'wpm':
        isUnlocked = userDto.stats.bestWPM >= achievement.conditionValue;
        break;
      case 'accuracy':
        isUnlocked = userDto.stats.bestAccuracy >= achievement.conditionValue;
        break;
      case 'words_completed':
        isUnlocked = userDto.stats.totalWordsCompleted >= achievement.conditionValue;
        break;
      case 'expert_completion':
        isUnlocked = (userDto.difficultiesCompleted || []).includes('expert');
        break;
      case 'all_difficulties':
        isUnlocked = ['easy', 'medium', 'hard', 'expert'].every((d) =>
          (userDto.difficultiesCompleted || []).includes(d)
        );
        break;
    }

    if (isUnlocked) {
      newlyUnlocked.push(achievement);
      unlocked.add(achievement.id);
      userDto.stats.points += achievement.points;
    }
  }

  userDto.unlockedAchievements = Array.from(unlocked);
  return newlyUnlocked;
}

export async function handleHealth(request, env) {
  return safe(async () => {
    if (request.method !== 'GET') return error('Method Not Allowed', 405);

    let db;
    try {
      db = await requireDb(env);
    } catch {
      return ok({ ok: true, db: false, schema: { users: false, sessions: false, gameRecords: false } });
    }

    const tables = await db
      .prepare(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name IN ('users', 'sessions', 'game_records')
      `
      )
      .all();

    const names = new Set((tables.results || []).map((r) => r.name));

    return ok({
      ok: true,
      db: true,
      schema: {
        users: names.has('users'),
        sessions: names.has('sessions'),
        gameRecords: names.has('game_records')
      }
    });
  });
}

export async function handleRegister(request, env) {
  return safe(async () => {
    if (request.method !== 'POST') return error('Method Not Allowed', 405);

    let body;
    try {
      body = await request.json();
    } catch {
      return error('请求体必须为 JSON');
    }

    const username = normalizeString(body.username);
    const email = normalizeString(body.email);
    const password = typeof body.password === 'string' ? body.password : '';

    if (!isValidUsername(username)) {
      return error('用户名格式不正确（3-20位字母、数字或下划线）');
    }
    if (!isValidEmail(email)) {
      return error('邮箱格式不正确');
    }
    if (password.length < 6) {
      return error('密码长度至少6个字符');
    }

    const db = await requireDb(env);

    const existingUsername = await db.prepare('SELECT 1 FROM users WHERE username = ? LIMIT 1').bind(username).first();
    if (existingUsername) return error('用户名已存在');

    const existingEmail = await db.prepare('SELECT 1 FROM users WHERE email = ? LIMIT 1').bind(email).first();
    if (existingEmail) return error('邮箱已被注册');

    const now = Date.now();
    const userId = uuidv4();
    const passwordHash = await hashPassword(password);
    const settings = JSON.stringify({
      soundEnabled: true,
      highlightEnabled: true,
      gameDuration: 120,
      soundVolume: 0.5
    });

    await db
      .prepare(
        `
        INSERT INTO users (
          id, username, email, password_hash,
          created_at, updated_at,
          settings_json, unlocked_achievements_json, difficulties_completed_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, '[]', '[]')
      `
      )
      .bind(userId, username, email, passwordHash, now, now, settings)
      .run();

    return ok({ message: '注册成功' }, { status: 201 });
  });
}

export async function handleLogin(request, env) {
  return safe(async () => {
    if (request.method !== 'POST') return error('Method Not Allowed', 405);

    let body;
    try {
      body = await request.json();
    } catch {
      return error('请求体必须为 JSON');
    }

    const username = normalizeString(body.username);
    const password = typeof body.password === 'string' ? body.password : '';

    const db = await requireDb(env);
    await cleanupExpiredSessions(db, Date.now());

    const row = await db.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').bind(username).first();
    if (!row) return error('用户名或密码错误', 401);

    const isOk = await verifyPassword(password, row.password_hash);
    if (!isOk) return error('用户名或密码错误', 401);

    const session = await createSessionForUser(request, env, row.id);
    const user = toUserDto(row);

    return ok(
      { message: '登录成功', user },
      {
        headers: {
          'Set-Cookie': session.cookie
        }
      }
    );
  });
}

export async function handleLogout(request, env) {
  return safe(async () => {
    if (request.method !== 'POST') return error('Method Not Allowed', 405);

    try {
      await deleteSession(request, env);
    } catch {
      // ignore if DB missing; still clear cookie
    }

    return ok(
      { message: '已退出登录' },
      {
        headers: {
          'Set-Cookie': buildLogoutCookieValue({ requestUrl: request.url })
        }
      }
    );
  });
}

export async function handleMe(request, env) {
  return safe(async () => {
    if (request.method !== 'GET') return error('Method Not Allowed', 405);
    const user = await getUserBySession(request, env);
    if (!user) return error('未登录', 401);
    return ok({ user });
  });
}

export async function handleSettings(request, env) {
  return safe(async () => {
    if (request.method !== 'PATCH') return error('Method Not Allowed', 405);

    const current = await getUserBySession(request, env);
    if (!current) return error('未登录', 401);

    let body;
    try {
      body = await request.json();
    } catch {
      return error('请求体必须为 JSON');
    }

    let patch = {};
    if (body && typeof body === 'object' && body.settings && typeof body.settings === 'object') {
      patch = body.settings;
    } else if (body && typeof body.key === 'string') {
      patch = { [body.key]: body.value };
    } else {
      return error('参数不正确');
    }

    const allowedKeys = new Set(['soundEnabled', 'highlightEnabled', 'gameDuration', 'soundVolume']);
    const sanitizedPatch = {};
    for (const [k, v] of Object.entries(patch)) {
      if (!allowedKeys.has(k)) continue;
      sanitizedPatch[k] = v;
    }

    if (Object.keys(sanitizedPatch).length === 0) {
      return ok({ message: '无可更新项', user: current });
    }

    const db = await requireDb(env);
    const row = await db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').bind(current.id).first();
    if (!row) return error('用户不存在', 404);

    const existing = parseJsonField(row.settings_json, {});
    const merged = { ...existing, ...sanitizedPatch };

    if (merged.gameDuration !== undefined) {
      merged.gameDuration = clampInt(merged.gameDuration, 30, 3600);
    }
    if (merged.soundVolume !== undefined) {
      const n = Number(merged.soundVolume);
      merged.soundVolume = Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0.5;
    }
    if (merged.soundEnabled !== undefined) merged.soundEnabled = Boolean(merged.soundEnabled);
    if (merged.highlightEnabled !== undefined) merged.highlightEnabled = Boolean(merged.highlightEnabled);

    const now = Date.now();
    await db
      .prepare('UPDATE users SET settings_json = ?, updated_at = ? WHERE id = ?')
      .bind(JSON.stringify(merged), now, current.id)
      .run();

    const updated = await db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').bind(current.id).first();
    return ok({ message: '设置已更新', user: toUserDto(updated) });
  });
}

export async function handleScores(request, env) {
  return safe(async () => {
    if (request.method !== 'POST') return error('Method Not Allowed', 405);

    const current = await getUserBySession(request, env);
    if (!current) return error('未登录', 401);

    let body;
    try {
      body = await request.json();
    } catch {
      return error('请求体必须为 JSON');
    }

    const difficulty = normalizeString(body.difficulty);
    if (!['easy', 'medium', 'hard', 'expert'].includes(difficulty)) {
      return error('难度不正确');
    }

    const durationSeconds = clampInt(body.durationSeconds ?? body.duration ?? 0, 1, 24 * 60 * 60);
    const totalChars = clampInt(body.totalChars ?? 0, 0, 1_000_000);
    const correctChars = clampInt(body.correctChars ?? 0, 0, totalChars);
    const wordsCompleted = clampInt(body.wordsCompleted ?? 0, 0, 1_000_000);

    const accuracyRatio = totalChars > 0 ? correctChars / totalChars : 0;
    const grossWpm = durationSeconds > 0 ? (totalChars / 5) / (durationSeconds / 60) : 0;
    const wpm = Math.round(grossWpm);
    const accuracy = totalChars > 0 ? Math.round(accuracyRatio * 100) : 0;
    const errorsCount = Math.max(0, totalChars - correctChars);

    const difficultyMultipliers = { easy: 1, medium: 1.5, hard: 2, expert: 3 };
    const score = Math.round(grossWpm * accuracyRatio * (difficultyMultipliers[difficulty] || 1));

    const db = await requireDb(env);
    const now = Date.now();

    // Insert game record
    const recordId = uuidv4();
    await db
      .prepare(
        `
        INSERT INTO game_records (
          id, user_id, difficulty,
          duration_seconds, score, wpm, accuracy,
          words_completed, errors, played_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .bind(recordId, current.id, difficulty, durationSeconds, score, wpm, accuracy, wordsCompleted, errorsCount, now)
      .run();

    // Load fresh user row to update stats safely
    const row = await db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').bind(current.id).first();
    if (!row) return error('用户不存在', 404);
    const user = toUserDto(row);

    // Update stats (keep behavior aligned with previous localStorage logic)
    user.stats.points += score;
    user.stats.bestWPM = Math.max(user.stats.bestWPM, wpm);
    user.stats.bestAccuracy = Math.max(user.stats.bestAccuracy, accuracy);
    user.stats.gamesPlayed += 1;
    user.stats.totalWordsCompleted += wordsCompleted;
    user.stats.totalErrors += errorsCount;
    user.stats.totalTimePlayed += durationSeconds;

    if (!user.difficultiesCompleted.includes(difficulty)) {
      user.difficultiesCompleted.push(difficulty);
    }

    const newAchievements = checkAchievementsAndApply(user);

    // Persist updated user aggregates
    await db
      .prepare(
        `
        UPDATE users SET
          points = ?,
          best_wpm = ?,
          best_accuracy = ?,
          games_played = ?,
          total_words_completed = ?,
          total_errors = ?,
          total_time_played = ?,
          unlocked_achievements_json = ?,
          difficulties_completed_json = ?,
          updated_at = ?
        WHERE id = ?
      `
      )
      .bind(
        user.stats.points,
        user.stats.bestWPM,
        user.stats.bestAccuracy,
        user.stats.gamesPlayed,
        user.stats.totalWordsCompleted,
        user.stats.totalErrors,
        user.stats.totalTimePlayed,
        JSON.stringify(user.unlockedAchievements),
        JSON.stringify(user.difficultiesCompleted),
        now,
        user.id
      )
      .run();

    // Return updated user
    const updatedRow = await db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').bind(user.id).first();

    return ok({
      message: '成绩已保存',
      result: { score, wpm, accuracy, errors: errorsCount },
      user: toUserDto(updatedRow),
      newAchievements
    });
  });
}

export async function handleLeaderboard(request, env) {
  return safe(async () => {
    if (request.method !== 'GET') return error('Method Not Allowed', 405);

    const url = new URL(request.url);
    const metric = normalizeString(url.searchParams.get('metric') || 'score');
    const period = normalizeString(url.searchParams.get('period') || 'all');
    const limit = clampInt(url.searchParams.get('limit') || 10, 1, 100);

    if (!['score', 'wpm'].includes(metric)) return error('metric 不正确');
    if (!['all', 'week'].includes(period)) return error('period 不正确');

    const db = await requireDb(env);
    const now = Date.now();

    if (period === 'all') {
      if (metric === 'score') {
        const result = await db
          .prepare(
            `
            SELECT id, username, points, best_wpm, best_accuracy
            FROM users
            ORDER BY points DESC, best_wpm DESC, best_accuracy DESC
            LIMIT ?
          `
          )
          .bind(limit)
          .all();

        const items = (result.results || []).map((r, index) => ({
          rank: index + 1,
          username: r.username,
          value: r.points,
          points: r.points,
          bestWPM: r.best_wpm,
          bestAccuracy: r.best_accuracy
        }));
        return ok({ metric, period, items });
      }

      const result = await db
        .prepare(
          `
          SELECT id, username, points, best_wpm, best_accuracy
          FROM users
          ORDER BY best_wpm DESC, best_accuracy DESC, points DESC
          LIMIT ?
        `
        )
        .bind(limit)
        .all();

      const items = (result.results || []).map((r, index) => ({
        rank: index + 1,
        username: r.username,
        value: r.best_wpm,
        points: r.points,
        bestWPM: r.best_wpm,
        bestAccuracy: r.best_accuracy
      }));
      return ok({ metric, period, items });
    }

    const weekStart = weekStartUtcMs(now);
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;

    if (metric === 'score') {
      const result = await db
        .prepare(
          `
          SELECT
            u.username AS username,
            u.points AS points,
            u.best_wpm AS best_wpm,
            u.best_accuracy AS best_accuracy,
            SUM(r.score) AS weekly_value
          FROM game_records r
          JOIN users u ON u.id = r.user_id
          WHERE r.played_at >= ? AND r.played_at < ?
          GROUP BY r.user_id
          ORDER BY weekly_value DESC, u.points DESC, u.best_wpm DESC
          LIMIT ?
        `
        )
        .bind(weekStart, weekEnd, limit)
        .all();

      const items = (result.results || []).map((r, index) => ({
        rank: index + 1,
        username: r.username,
        value: r.weekly_value || 0,
        points: r.points,
        bestWPM: r.best_wpm,
        bestAccuracy: r.best_accuracy
      }));
      return ok({ metric, period, weekStart, weekEnd, items });
    }

    const result = await db
      .prepare(
        `
        SELECT
          u.username AS username,
          u.points AS points,
          u.best_wpm AS best_wpm,
          u.best_accuracy AS best_accuracy,
          MAX(r.wpm) AS weekly_value
        FROM game_records r
        JOIN users u ON u.id = r.user_id
        WHERE r.played_at >= ? AND r.played_at < ?
        GROUP BY r.user_id
        ORDER BY weekly_value DESC, u.best_accuracy DESC, u.points DESC
        LIMIT ?
      `
      )
      .bind(weekStart, weekEnd, limit)
      .all();

    const items = (result.results || []).map((r, index) => ({
      rank: index + 1,
      username: r.username,
      value: r.weekly_value || 0,
      points: r.points,
      bestWPM: r.best_wpm,
      bestAccuracy: r.best_accuracy
    }));
    return ok({ metric, period, weekStart, weekEnd, items });
  });
}

export async function handleApiRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === '/api/health') return handleHealth(request, env);
  if (url.pathname === '/api/register') return handleRegister(request, env);
  if (url.pathname === '/api/login') return handleLogin(request, env);
  if (url.pathname === '/api/logout') return handleLogout(request, env);
  if (url.pathname === '/api/me') return handleMe(request, env);
  if (url.pathname === '/api/settings') return handleSettings(request, env);
  if (url.pathname === '/api/scores') return handleScores(request, env);
  if (url.pathname === '/api/leaderboard') return handleLeaderboard(request, env);

  return error('Not Found', 404);
}
