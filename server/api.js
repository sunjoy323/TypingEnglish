const SESSION_COOKIE_NAME = 'te_session';
const SESSION_TTL_DAYS = 30;
// Cloudflare Workers WebCrypto currently rejects PBKDF2 iteration counts > 100000.
const PBKDF2_MAX_ITERATIONS = 100_000;
const PBKDF2_ITERATIONS = PBKDF2_MAX_ITERATIONS;

function buildDefaultAchievements() {
  const achievements = [
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

  let nextId = 11;
  const add = (achievement) => {
    achievements.push({ id: nextId, ...achievement });
    nextId += 1;
  };

  // 11-23：局数里程碑（13）
  [
    { v: 3, name: '热身完成', desc: '完成 3 局游戏', icon: 'fa-step-forward', medal: 'bronze', points: 5 },
    { v: 5, name: '上手了', desc: '完成 5 局游戏', icon: 'fa-play', medal: 'bronze', points: 8 },
    { v: 15, name: '坚持者', desc: '完成 15 局游戏', icon: 'fa-check-circle', medal: 'bronze', points: 12 },
    { v: 20, name: '不轻言弃', desc: '完成 20 局游戏', icon: 'fa-repeat', medal: 'bronze', points: 15 },
    { v: 30, name: '常驻选手', desc: '完成 30 局游戏', icon: 'fa-calendar', medal: 'silver', points: 20 },
    { v: 40, name: '键盘熟人', desc: '完成 40 局游戏', icon: 'fa-clock-o', medal: 'silver', points: 25 },
    { v: 50, name: '半百之路', desc: '完成 50 局游戏', icon: 'fa-fire', medal: 'silver', points: 30 },
    { v: 75, name: '七十五次重来', desc: '完成 75 局游戏', icon: 'fa-diamond', medal: 'silver', points: 40 },
    { v: 100, name: '百局老兵', desc: '完成 100 局游戏', icon: 'fa-trophy', medal: 'gold', points: 60 },
    { v: 150, name: '练习狂人', desc: '完成 150 局游戏', icon: 'fa-rocket', medal: 'gold', points: 80 },
    { v: 200, name: '双百达人', desc: '完成 200 局游戏', icon: 'fa-space-shuttle', medal: 'gold', points: 100 },
    { v: 300, name: '三百不止', desc: '完成 300 局游戏', icon: 'fa-flag', medal: 'gold', points: 120 },
    { v: 500, name: '五百局传说', desc: '完成 500 局游戏', icon: 'fa-university', medal: 'gold', points: 150 }
  ].forEach((m) =>
    add({
      name: m.name,
      description: m.desc,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'games_played',
      conditionValue: m.v
    })
  );

  // 24-34：累计单词（11）
  [
    { v: 50, name: '小试牛刀', icon: 'fa-leaf', medal: 'bronze', points: 8 },
    { v: 200, name: '两百词见面礼', icon: 'fa-book', medal: 'bronze', points: 15 },
    { v: 300, name: '三百词上路', icon: 'fa-bookmark', medal: 'bronze', points: 20 },
    { v: 800, name: '单词收割者', icon: 'fa-pencil', medal: 'silver', points: 25 },
    { v: 1000, name: '千词里程碑', icon: 'fa-font', medal: 'silver', points: 30 },
    { v: 2000, name: '两千词蓄力', icon: 'fa-files-o', medal: 'silver', points: 40 },
    { v: 3000, name: '三千词工匠', icon: 'fa-archive', medal: 'silver', points: 50 },
    { v: 5000, name: '五千词达人', icon: 'fa-trophy', medal: 'gold', points: 70 },
    { v: 8000, name: '八千词行者', icon: 'fa-diamond', medal: 'gold', points: 90 },
    { v: 10000, name: '万词成就', icon: 'fa-globe', medal: 'gold', points: 120 },
    { v: 20000, name: '两万词史诗', icon: 'fa-star', medal: 'gold', points: 180 }
  ].forEach((m) =>
    add({
      name: m.name,
      description: `累计完成 ${m.v} 个单词`,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'words_completed',
      conditionValue: m.v
    })
  );

  // 35-47：最高 WPM（13）
  [
    { v: 20, name: '起速', icon: 'fa-tachometer', medal: 'bronze', points: 5 },
    { v: 30, name: '加速', icon: 'fa-bolt', medal: 'bronze', points: 10 },
    { v: 40, name: '顺风局', icon: 'fa-paper-plane-o', medal: 'bronze', points: 15 },
    { v: 60, name: '疾行', icon: 'fa-fighter-jet', medal: 'silver', points: 25 },
    { v: 70, name: '飞驰', icon: 'fa-rocket', medal: 'silver', points: 30 },
    { v: 80, name: '风一样', icon: 'fa-flag', medal: 'silver', points: 40 },
    { v: 90, name: '接近音速', icon: 'fa-bolt', medal: 'silver', points: 50 },
    { v: 110, name: '破百再加速', icon: 'fa-space-shuttle', medal: 'gold', points: 80 },
    { v: 120, name: '一百二十', icon: 'fa-tachometer', medal: 'gold', points: 90 },
    { v: 130, name: '一百三十', icon: 'fa-tachometer', medal: 'gold', points: 110 },
    { v: 140, name: '一百四十', icon: 'fa-tachometer', medal: 'gold', points: 130 },
    { v: 150, name: '一百五十', icon: 'fa-tachometer', medal: 'gold', points: 150 },
    { v: 160, name: '一百六十', icon: 'fa-tachometer', medal: 'gold', points: 180 }
  ].forEach((m) =>
    add({
      name: m.name,
      description: `最高打字速度达到 ${m.v} WPM`,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'wpm',
      conditionValue: m.v
    })
  );

  // 48-55：最高准确率（8）
  [
    { v: 80, name: '瞄准练习', icon: 'fa-dot-circle-o', medal: 'bronze', points: 5 },
    { v: 85, name: '稳一点', icon: 'fa-crosshairs', medal: 'bronze', points: 10 },
    { v: 90, name: '稳定输出', icon: 'fa-bullseye', medal: 'silver', points: 15 },
    { v: 93, name: '很接近了', icon: 'fa-check', medal: 'silver', points: 20 },
    { v: 96, name: '精准进阶', icon: 'fa-check-circle', medal: 'silver', points: 30 },
    { v: 97, name: '准得离谱', icon: 'fa-diamond', medal: 'gold', points: 40 },
    { v: 98, name: '误差极小', icon: 'fa-star', medal: 'gold', points: 50 },
    { v: 99, name: '几乎完美', icon: 'fa-star-o', medal: 'gold', points: 70 }
  ].forEach((m) =>
    add({
      name: m.name,
      description: `最高准确率达到 ${m.v}%`,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'accuracy',
      conditionValue: m.v
    })
  );

  // 56-63：难度相关（8）
  [
    {
      name: '轻松通关',
      description: '在简单难度下完成过一局游戏',
      icon: 'fa-smile-o',
      medal: 'bronze',
      points: 10,
      conditionType: 'difficulty_completion',
      conditionValue: 'easy'
    },
    {
      name: '中级通关',
      description: '在中等难度下完成过一局游戏',
      icon: 'fa-level-up',
      medal: 'bronze',
      points: 15,
      conditionType: 'difficulty_completion',
      conditionValue: 'medium'
    },
    {
      name: '硬核通关',
      description: '在困难难度下完成过一局游戏',
      icon: 'fa-bomb',
      medal: 'silver',
      points: 25,
      conditionType: 'difficulty_completion',
      conditionValue: 'hard'
    },
    {
      name: '双难度挑战',
      description: '完成任意 2 种难度的游戏',
      icon: 'fa-exchange',
      medal: 'bronze',
      points: 20,
      conditionType: 'difficulties_count',
      conditionValue: 2
    },
    {
      name: '三难度挑战',
      description: '完成任意 3 种难度的游戏',
      icon: 'fa-sitemap',
      medal: 'silver',
      points: 35,
      conditionType: 'difficulties_count',
      conditionValue: 3
    },
    {
      name: '基础三连',
      description: '在简单/中等/困难难度下都完成过游戏',
      icon: 'fa-cubes',
      medal: 'silver',
      points: 40,
      conditionType: 'difficulty_combo',
      conditionValue: ['easy', 'medium', 'hard']
    },
    {
      name: '进阶三连',
      description: '在中等/困难/专家难度下都完成过游戏',
      icon: 'fa-line-chart',
      medal: 'gold',
      points: 70,
      conditionType: 'difficulty_combo',
      conditionValue: ['medium', 'hard', 'expert']
    },
    {
      name: '地狱二连',
      description: '在困难和专家难度下都完成过游戏',
      icon: 'fa-fire',
      medal: 'gold',
      points: 60,
      conditionType: 'difficulty_combo',
      conditionValue: ['hard', 'expert']
    }
  ].forEach(add);

  // 64-69：累计积分（6）
  [
    { v: 200, name: '积分入门', icon: 'fa-star-o', medal: 'bronze', points: 10 },
    { v: 500, name: '积分小康', icon: 'fa-star', medal: 'silver', points: 20 },
    { v: 1000, name: '积分富豪', icon: 'fa-diamond', medal: 'silver', points: 40 },
    { v: 2000, name: '积分巨富', icon: 'fa-bank', medal: 'gold', points: 60 },
    { v: 5000, name: '积分王者', icon: 'fa-trophy', medal: 'gold', points: 100 },
    { v: 10000, name: '积分神话', icon: 'fa-globe', medal: 'gold', points: 150 }
  ].forEach((m) =>
    add({
      name: m.name,
      description: `累计积分达到 ${m.v}`,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'points_total',
      conditionValue: m.v
    })
  );

  // 70-75：累计练习时长（6）
  [
    { v: 600, name: '十分钟热身', icon: 'fa-clock-o', medal: 'bronze', points: 10 },
    { v: 1800, name: '半小时沉浸', icon: 'fa-hourglass-2', medal: 'silver', points: 20 },
    { v: 3600, name: '一小时专注', icon: 'fa-hourglass-3', medal: 'silver', points: 30 },
    { v: 7200, name: '两小时耐力', icon: 'fa-hourglass', medal: 'gold', points: 50 },
    { v: 18000, name: '五小时修行', icon: 'fa-coffee', medal: 'gold', points: 80 },
    { v: 36000, name: '十小时老练', icon: 'fa-diamond', medal: 'gold', points: 120 }
  ].forEach((m) =>
    add({
      name: m.name,
      description: `累计练习时长达到 ${Math.round(m.v / 60)} 分钟`,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'time_played',
      conditionValue: m.v
    })
  );

  // 76-80：累计错误（5）
  [
    { v: 50, name: '键盘打滑', icon: 'fa-bug', medal: 'bronze', points: 5 },
    { v: 100, name: '错字收藏家', icon: 'fa-exclamation-triangle', medal: 'bronze', points: 8 },
    { v: 200, name: '失误艺术', icon: 'fa-bolt', medal: 'silver', points: 10 },
    { v: 500, name: '错误工程师', icon: 'fa-cogs', medal: 'silver', points: 15 },
    { v: 1000, name: '失误大师傅', icon: 'fa-wrench', medal: 'gold', points: 20 }
  ].forEach((m) =>
    add({
      name: m.name,
      description: `累计错误达到 ${m.v} 次（别怕，错误也是练习的一部分）`,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'total_errors',
      conditionValue: m.v
    })
  );

  // 81-88：成就收集（8）
  [
    { count: 5, name: '成就收集者 I', icon: 'fa-gift', medal: 'bronze', points: 10 },
    { count: 10, name: '成就收集者 II', icon: 'fa-gift', medal: 'silver', points: 20 },
    { count: 20, name: '成就收集者 III', icon: 'fa-gift', medal: 'silver', points: 35 },
    { count: 30, name: '成就收集者 IV', icon: 'fa-diamond', medal: 'gold', points: 50 },
    { count: 40, name: '成就收集者 V', icon: 'fa-diamond', medal: 'gold', points: 70 },
    { count: 10, conditionMedal: 'gold', name: '金牌收藏家', icon: 'fa-trophy', medal: 'gold', points: 80 },
    { count: 15, conditionMedal: 'silver', name: '银牌收藏家', icon: 'fa-trophy', medal: 'silver', points: 60 },
    { count: 99, name: '全成就', icon: 'fa-star', medal: 'gold', points: 200 }
  ].forEach((m) =>
    add({
      name: m.name,
      description:
        m.conditionMedal && m.name.includes('收藏家')
          ? `解锁 ${m.count} 个${m.conditionMedal === 'gold' ? '金' : '银'}牌成就`
          : `解锁 ${m.count} 个成就`,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'achievement_count',
      conditionValue: m.conditionMedal ? { count: m.count, medal: m.conditionMedal } : { count: m.count }
    })
  );

  // 89-100：单局表现与趣味（12）
  [
    {
      name: '零失误',
      description: '在一局游戏中做到 0 错误',
      icon: 'fa-check',
      medal: 'silver',
      points: 40,
      conditionValue: { maxErrors: 0 }
    },
    {
      name: '误差一格',
      description: '在一局游戏中错误不超过 1 个',
      icon: 'fa-check-circle',
      medal: 'bronze',
      points: 15,
      conditionValue: { maxErrors: 1 }
    },
    {
      name: '稳准狠',
      description: '单局同时达到 60 WPM 且准确率 95%',
      icon: 'fa-crosshairs',
      medal: 'gold',
      points: 80,
      conditionValue: { minWpm: 60, minAccuracy: 95 }
    },
    {
      name: '极速且精准',
      description: '单局同时达到 100 WPM 且准确率 97%',
      icon: 'fa-rocket',
      medal: 'gold',
      points: 120,
      conditionValue: { minWpm: 100, minAccuracy: 97 }
    },
    {
      name: '百发百中',
      description: '单局准确率 100% 且完成 20 个单词',
      icon: 'fa-star',
      medal: 'gold',
      points: 100,
      conditionValue: { minAccuracy: 100, minWords: 20 }
    },
    {
      name: '词海翻涌',
      description: '单局完成 60 个单词',
      icon: 'fa-book',
      medal: 'silver',
      points: 40,
      conditionValue: { minWords: 60 }
    },
    {
      name: '高分局',
      description: '单局分数达到 150',
      icon: 'fa-line-chart',
      medal: 'silver',
      points: 50,
      conditionValue: { minScore: 150 }
    },
    {
      name: '专家稳住',
      description: '专家难度下单局准确率达到 95%',
      icon: 'fa-graduation-cap',
      medal: 'gold',
      points: 90,
      conditionValue: { difficulty: 'expert', minAccuracy: 95 }
    },
    {
      name: '硬核无瑕',
      description: '困难难度下单局做到 0 错误',
      icon: 'fa-fire',
      medal: 'gold',
      points: 90,
      conditionValue: { difficulty: 'hard', maxErrors: 0 }
    },
    {
      name: '夜猫子',
      description: '在深夜练习过一次（UTC 0-5 点）',
      icon: 'fa-moon-o',
      medal: 'bronze',
      points: 10,
      conditionValue: { utcHourRange: { start: 0, end: 5 } }
    },
    {
      name: '早起鸟',
      description: '在清晨练习过一次（UTC 5-9 点）',
      icon: 'fa-sun-o',
      medal: 'bronze',
      points: 10,
      conditionValue: { utcHourRange: { start: 5, end: 9 } }
    },
    {
      name: '周末战士',
      description: '在周末练习过一次（UTC 周六/周日）',
      icon: 'fa-smile-o',
      medal: 'bronze',
      points: 15,
      conditionValue: { weekend: true }
    }
  ].forEach((m) =>
    add({
      name: m.name,
      description: m.description,
      icon: m.icon,
      medal: m.medal,
      points: m.points,
      conditionType: 'last_game',
      conditionValue: m.conditionValue
    })
  );

  return achievements;
}

const DEFAULT_ACHIEVEMENTS = buildDefaultAchievements();

function normalizeAchievementCountCondition(value) {
  if (typeof value === 'number') return { count: value };
  if (value && typeof value === 'object') {
    const count = Number(value.count);
    const medal = value.medal;
    return {
      count: Number.isFinite(count) ? count : 0,
      medal: medal === 'gold' || medal === 'silver' || medal === 'bronze' ? medal : undefined
    };
  }
  return { count: 0 };
}

function countUnlockedAchievements({ achievements, unlockedSet, medal }) {
  let c = 0;
  for (const a of achievements) {
    if (medal && a.medal !== medal) continue;
    if (unlockedSet.has(a.id)) c += 1;
  }
  return c;
}

function parsePlayedAtUtcMs(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const ms = Date.parse(value);
    return Number.isFinite(ms) ? ms : null;
  }
  return null;
}

function isUtcHourInRange(hour, range) {
  if (!range || typeof range !== 'object') return true;
  const start = Number(range.start);
  const end = Number(range.end);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return true;
  const h = ((hour % 24) + 24) % 24;
  const s = ((start % 24) + 24) % 24;
  const e = ((end % 24) + 24) % 24;
  if (s === e) return true;
  if (s < e) return h >= s && h < e;
  return h >= s || h < e;
}

function evaluateLastGameCondition(record, condition) {
  if (!record || !condition || typeof condition !== 'object') return false;

  if (condition.difficulty && record.difficulty !== condition.difficulty) return false;

  if (condition.minWpm !== undefined) {
    const minWpm = Number(condition.minWpm);
    if (Number.isFinite(minWpm) && Number(record.wpm) < minWpm) return false;
  }

  if (condition.minAccuracy !== undefined) {
    const minAccuracy = Number(condition.minAccuracy);
    if (Number.isFinite(minAccuracy) && Number(record.accuracy) < minAccuracy) return false;
  }

  if (condition.maxErrors !== undefined) {
    const maxErrors = Number(condition.maxErrors);
    if (Number.isFinite(maxErrors) && Number(record.errors) > maxErrors) return false;
  }

  if (condition.minWords !== undefined) {
    const minWords = Number(condition.minWords);
    if (Number.isFinite(minWords) && Number(record.wordsCompleted) < minWords) return false;
  }

  if (condition.minScore !== undefined) {
    const minScore = Number(condition.minScore);
    if (Number.isFinite(minScore) && Number(record.score) < minScore) return false;
  }

  if (condition.utcHourRange || condition.weekend) {
    const playedAtMs = parsePlayedAtUtcMs(record.playedAt);
    if (playedAtMs === null) return false;
    const d = new Date(playedAtMs);
    if (condition.utcHourRange && !isUtcHourInRange(d.getUTCHours(), condition.utcHourRange)) return false;
    if (condition.weekend) {
      const day = d.getUTCDay();
      if (day !== 0 && day !== 6) return false;
    }
  }

  return true;
}

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

function checkAchievementsAndApply(userDto, gameContext = null) {
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
      case 'points_total':
        isUnlocked = userDto.stats.points >= achievement.conditionValue;
        break;
      case 'time_played':
        isUnlocked = userDto.stats.totalTimePlayed >= achievement.conditionValue;
        break;
      case 'total_errors':
        isUnlocked = userDto.stats.totalErrors >= achievement.conditionValue;
        break;
      case 'difficulty_completion':
        isUnlocked = (userDto.difficultiesCompleted || []).includes(achievement.conditionValue);
        break;
      case 'difficulties_count': {
        const count = Array.isArray(userDto.difficultiesCompleted) ? userDto.difficultiesCompleted.length : 0;
        isUnlocked = count >= achievement.conditionValue;
        break;
      }
      case 'difficulty_combo': {
        const required = achievement.conditionValue;
        if (Array.isArray(required)) {
          isUnlocked = required.every((d) => (userDto.difficultiesCompleted || []).includes(d));
        }
        break;
      }
      case 'achievement_count': {
        const { count, medal } = normalizeAchievementCountCondition(achievement.conditionValue);
        const currentCount = countUnlockedAchievements({ achievements: DEFAULT_ACHIEVEMENTS, unlockedSet: unlocked, medal });
        isUnlocked = currentCount >= count;
        break;
      }
      case 'last_game':
        isUnlocked = evaluateLastGameCondition(gameContext, achievement.conditionValue);
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

    const newAchievements = checkAchievementsAndApply(user, {
      difficulty,
      durationSeconds,
      score,
      wpm,
      accuracy,
      wordsCompleted,
      errors: errorsCount,
      playedAt: now
    });

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
