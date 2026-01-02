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

function weekStartUtcMs(nowMs) {
  const d = new Date(nowMs);
  const day = d.getUTCDay(); // 0..6 (Sun..Sat)
  const diffFromMonday = (day + 6) % 7; // Mon=0, Sun=6
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diffFromMonday);
}

class LocalUserStore {
  constructor(soundManager) {
    this.usersKey = 'typingGameUsers';
    this.currentUserKey = 'typingGameCurrentUser';
    this.achievementsKey = 'typingGameAchievements';
    this.soundManager = soundManager;
    this.initDefaultAchievements();
  }

  initDefaultAchievements() {
    const raw = localStorage.getItem(this.achievementsKey);
    if (!raw) {
      localStorage.setItem(this.achievementsKey, JSON.stringify(DEFAULT_ACHIEVEMENTS));
      return;
    }

    let existing;
    try {
      existing = JSON.parse(raw);
    } catch {
      existing = [];
    }

    if (!Array.isArray(existing)) existing = [];

    const byId = new Map();
    for (const item of existing) {
      if (!item || typeof item !== 'object') continue;
      const id = Number(item.id);
      if (!Number.isFinite(id)) continue;
      byId.set(id, item);
    }

    let changed = false;
    for (const def of DEFAULT_ACHIEVEMENTS) {
      if (!byId.has(def.id)) {
        byId.set(def.id, def);
        changed = true;
      }
    }

    if (changed) {
      const merged = Array.from(byId.values()).sort((a, b) => Number(a.id) - Number(b.id));
      localStorage.setItem(this.achievementsKey, JSON.stringify(merged));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(this.usersKey)) || [];
  }

  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.currentUserKey));
  }

  setCurrentUser(user) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  clearCurrentUser() {
    localStorage.removeItem(this.currentUserKey);
  }

  async register(userData) {
    const users = this.getUsers();

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(userData.username)) {
      return { success: false, message: '用户名格式不正确（3-20位字母、数字或下划线）' };
    }

    if (users.find((user) => user.username === userData.username)) {
      return { success: false, message: '用户名已存在' };
    }

    if (users.find((user) => user.email === userData.email)) {
      return { success: false, message: '邮箱已被注册' };
    }

    if (userData.password.length < 6) {
      return { success: false, message: '密码长度至少6个字符' };
    }

    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: this.hashPassword(userData.password),
      createdAt: new Date().toISOString(),
      stats: {
        points: 0,
        bestWPM: 0,
        bestAccuracy: 0,
        gamesPlayed: 0,
        totalWordsCompleted: 0,
        totalErrors: 0,
        totalTimePlayed: 0
      },
      settings: {
        soundEnabled: true,
        highlightEnabled: true,
        gameDuration: 120,
        soundVolume: 0.5
      },
      unlockedAchievements: [],
      gameHistory: [],
      difficultiesCompleted: []
    };

    users.push(newUser);
    this.saveUsers(users);

    this.soundManager.play('correct');

    return {
      success: true,
      message: '注册成功',
      user: this.getUserWithoutPassword(newUser)
    };
  }

  async login(username, password) {
    const users = this.getUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return { success: false, message: '用户名或密码错误' };
    }

    if (user.password !== this.hashPassword(password)) {
      return { success: false, message: '用户名或密码错误' };
    }

    this.setCurrentUser(this.getUserWithoutPassword(user));
    this.soundManager.play('correct');

    return {
      success: true,
      message: '登录成功',
      user: this.getUserWithoutPassword(user)
    };
  }

  updateUser(updatedUser) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);

    if (index !== -1) {
      updatedUser.password = users[index].password;
      users[index] = updatedUser;
      this.saveUsers(users);

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        this.setCurrentUser(this.getUserWithoutPassword(updatedUser));
      }
    }
  }

  saveGameRecord(userId, gameData) {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) return null;

    const record = {
      id: Date.now().toString(),
      difficulty: gameData.difficulty,
      duration: gameData.durationSeconds ?? gameData.duration,
      score: gameData.score,
      wpm: gameData.wpm,
      accuracy: gameData.accuracy,
      wordsCompleted: gameData.wordsCompleted,
      errors: gameData.errors,
      playedAt: new Date().toISOString()
    };

    user.stats.points += gameData.score;
    user.stats.bestWPM = Math.max(user.stats.bestWPM, gameData.wpm);
    user.stats.bestAccuracy = Math.max(user.stats.bestAccuracy, gameData.accuracy);
    user.stats.gamesPlayed += 1;
    user.stats.totalWordsCompleted += gameData.wordsCompleted;
    user.stats.totalErrors += gameData.errors;
    user.stats.totalTimePlayed += record.duration;

    if (!user.difficultiesCompleted.includes(gameData.difficulty)) {
      user.difficultiesCompleted.push(gameData.difficulty);
    }

    user.gameHistory.unshift(record);
    if (user.gameHistory.length > 50) {
      user.gameHistory = user.gameHistory.slice(0, 50);
    }

    this.saveUsers(users);

    const newAchievements = this.checkAchievements(user);
    if (newAchievements.length > 0) {
      user.unlockedAchievements.push(...newAchievements.map((a) => a.id));
      this.saveUsers(users);

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.unlockedAchievements.push(...newAchievements.map((a) => a.id));
        currentUser.stats = user.stats;
        this.setCurrentUser(currentUser);
      }

      return newAchievements;
    }

    return [];
  }

  checkAchievements(user) {
    const achievements = this.getAchievements();
    const newAchievements = [];
    const unlockedSet = new Set((user.unlockedAchievements || []).map((id) => Number(id)));
    const lastRecord =
      user && Array.isArray(user.gameHistory) && user.gameHistory.length > 0 ? user.gameHistory[0] : null;

    for (const achievement of achievements) {
      if (unlockedSet.has(achievement.id)) continue;

      let isUnlocked = false;
      switch (achievement.conditionType) {
        case 'games_played':
          isUnlocked = user.stats.gamesPlayed >= achievement.conditionValue;
          break;
        case 'wpm':
          isUnlocked = user.stats.bestWPM >= achievement.conditionValue;
          break;
        case 'accuracy':
          isUnlocked = user.stats.bestAccuracy >= achievement.conditionValue;
          break;
        case 'words_completed':
          isUnlocked = user.stats.totalWordsCompleted >= achievement.conditionValue;
          break;
        case 'expert_completion':
          isUnlocked = user.difficultiesCompleted.includes('expert');
          break;
        case 'all_difficulties':
          isUnlocked = ['easy', 'medium', 'hard', 'expert'].every((diff) => user.difficultiesCompleted.includes(diff));
          break;
        case 'points_total':
          isUnlocked = user.stats.points >= achievement.conditionValue;
          break;
        case 'time_played':
          isUnlocked = user.stats.totalTimePlayed >= achievement.conditionValue;
          break;
        case 'total_errors':
          isUnlocked = user.stats.totalErrors >= achievement.conditionValue;
          break;
        case 'difficulty_completion':
          isUnlocked = user.difficultiesCompleted.includes(achievement.conditionValue);
          break;
        case 'difficulties_count': {
          const count = Array.isArray(user.difficultiesCompleted) ? user.difficultiesCompleted.length : 0;
          isUnlocked = count >= achievement.conditionValue;
          break;
        }
        case 'difficulty_combo': {
          const required = achievement.conditionValue;
          if (Array.isArray(required)) {
            isUnlocked = required.every((diff) => user.difficultiesCompleted.includes(diff));
          }
          break;
        }
        case 'achievement_count': {
          const { count, medal } = normalizeAchievementCountCondition(achievement.conditionValue);
          const currentCount = countUnlockedAchievements({ achievements, unlockedSet, medal });
          isUnlocked = currentCount >= count;
          break;
        }
        case 'last_game':
          isUnlocked = evaluateLastGameCondition(lastRecord, achievement.conditionValue);
          break;
      }

      if (isUnlocked) {
        newAchievements.push(achievement);
        unlockedSet.add(achievement.id);
        user.stats.points += achievement.points;
      }
    }

    return newAchievements;
  }

  getLeaderboard({ limit = 10, metric = 'score', period = 'all' } = {}) {
    const users = this.getUsers().map((u) => this.getUserWithoutPassword(u));
    const bestScoreById = new Map();
    for (const user of users) {
      let bestScore = 0;
      if (user && Array.isArray(user.gameHistory)) {
        for (const record of user.gameHistory) {
          bestScore = Math.max(bestScore, record && record.score ? record.score : 0);
        }
      }
      bestScoreById.set(user.id, bestScore);
    }

    if (period === 'all') {
      if (metric === 'score') {
        return users
          .sort((a, b) => {
            const bestA = bestScoreById.get(a.id) || 0;
            const bestB = bestScoreById.get(b.id) || 0;
            if (bestB !== bestA) return bestB - bestA;
            if (b.stats.bestWPM !== a.stats.bestWPM) return b.stats.bestWPM - a.stats.bestWPM;
            if (b.stats.bestAccuracy !== a.stats.bestAccuracy) return b.stats.bestAccuracy - a.stats.bestAccuracy;
            return b.stats.points - a.stats.points;
          })
          .slice(0, limit);
      }
      return users.sort((a, b) => b.stats.bestWPM - a.stats.bestWPM).slice(0, limit);
    }

    const weekStart = weekStartUtcMs(Date.now());
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;

    const aggregate = new Map();
    for (const user of users) {
      if (!Array.isArray(user.gameHistory)) continue;
      for (const record of user.gameHistory) {
        const playedAt = Date.parse(record.playedAt);
        if (!Number.isFinite(playedAt)) continue;
        if (playedAt < weekStart || playedAt >= weekEnd) continue;

        const existing = aggregate.get(user.id) || {
          username: user.username,
          points: user.stats.points,
          bestWPM: user.stats.bestWPM,
          bestAccuracy: user.stats.bestAccuracy,
          value: 0
        };

        if (metric === 'score') {
          existing.value = Math.max(existing.value, record.score || 0);
        } else {
          existing.value = Math.max(existing.value, record.wpm || 0);
        }
        aggregate.set(user.id, existing);
      }
    }

    const items = Array.from(aggregate.values());
    items.sort((a, b) => b.value - a.value);
    return items.slice(0, limit);
  }

  getAchievements() {
    return JSON.parse(localStorage.getItem(this.achievementsKey)) || DEFAULT_ACHIEVEMENTS;
  }

  getUserWithoutPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  hashPassword(password) {
    return btoa(password);
  }
}

class ApiUserStore {
  constructor() {
    this.cachedUser = null;
  }

  async requestJson(path, options = {}) {
    let response;
    try {
      response = await fetch(path, {
        credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
    } catch {
      return { success: false, message: '网络错误，请检查连接或稍后再试' };
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      // ignore
    }

    if (!response.ok) {
      return {
        success: false,
        message: (data && data.message) || `请求失败 (${response.status})`
      };
    }

    return data || { success: true };
  }

  async health() {
    try {
      const data = await this.requestJson('/api/health', { method: 'GET', headers: {} });
      return data.success ? data : null;
    } catch {
      return null;
    }
  }

  async getCurrentUser() {
    if (this.cachedUser) return this.cachedUser;

    const res = await this.requestJson('/api/me', { method: 'GET', headers: {} });
    if (!res.success) return null;
    this.cachedUser = res.user || null;
    return this.cachedUser;
  }

  async register(userData) {
    const res = await this.requestJson('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.success) this.cachedUser = res.user;
    return res;
  }

  async login(username, password) {
    const res = await this.requestJson('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.success) this.cachedUser = res.user;
    return res;
  }

  async logout() {
    const res = await this.requestJson('/api/logout', { method: 'POST', body: '{}' });
    this.cachedUser = null;
    return res;
  }

  async updateSetting(key, value) {
    const res = await this.requestJson('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify({ key, value })
    });
    if (res.success) this.cachedUser = res.user;
    return res;
  }

  async saveGameRecord(gameData) {
    const res = await this.requestJson('/api/scores', {
      method: 'POST',
      body: JSON.stringify(gameData)
    });
    if (res.success) this.cachedUser = res.user;
    return res;
  }

  async getLeaderboard({ metric = 'score', period = 'all', limit = 10 } = {}) {
    const url = new URL('/api/leaderboard', window.location.origin);
    url.searchParams.set('metric', metric);
    url.searchParams.set('period', period);
    url.searchParams.set('limit', String(limit));

    const res = await this.requestJson(url.toString(), { method: 'GET', headers: {} });
    if (!res.success) return res;
    return res;
  }
}

// 用户管理器：自动选择本地存储或 Cloudflare 后端（Worker/Pages Functions + D1）
class UserManager {
  constructor() {
    this.soundManager = new SoundManager();
    this.local = new LocalUserStore(this.soundManager);
    this.api = new ApiUserStore();
    this.backend = 'local';
  }

  async init() {
    const forced = globalThis.TypingEnglishBackend;
    if (forced === 'api' || forced === 'local') {
      this.backend = forced;
      return;
    }

    if (window.location.protocol === 'file:') {
      this.backend = 'local';
      return;
    }

    const health = await this.api.health();
    this.backend = health && health.success && health.ok && health.db ? 'api' : 'local';
  }

  getBackend() {
    return this.backend;
  }

  async getCurrentUser() {
    if (this.backend === 'api') return this.api.getCurrentUser();
    return this.local.getCurrentUser();
  }

  async register(userData) {
    if (this.backend === 'api') return this.api.register(userData);
    return this.local.register(userData);
  }

  async login(username, password) {
    if (this.backend === 'api') return this.api.login(username, password);
    return this.local.login(username, password);
  }

  async clearCurrentUser() {
    if (this.backend === 'api') return this.api.logout();
    this.local.clearCurrentUser();
    return { success: true, message: '已退出登录' };
  }

  async updateSetting(key, value) {
    if (this.backend === 'api') return this.api.updateSetting(key, value);

    const currentUser = this.local.getCurrentUser();
    if (!currentUser) return { success: false, message: '未登录' };
    currentUser.settings = currentUser.settings || {};
    currentUser.settings[key] = value;
    this.local.updateUser(currentUser);
    return { success: true, message: '设置已更新', user: this.local.getCurrentUser() };
  }

  updateUser(updatedUser) {
    if (this.backend === 'api') {
      const settings = (updatedUser && updatedUser.settings) || {};
      const tasks = Object.entries(settings).map(([k, v]) => this.api.updateSetting(k, v));
      return Promise.all(tasks).then(() => undefined);
    }
    return this.local.updateUser(updatedUser);
  }

  async saveGameRecord(userIdOrGameData, maybeGameData) {
    const gameData = typeof userIdOrGameData === 'object' ? userIdOrGameData : maybeGameData;

    if (this.backend === 'api') {
      return this.api.saveGameRecord(gameData);
    }

    const currentUser = this.local.getCurrentUser();
    if (!currentUser) return { success: false, message: '未登录' };

    const newAchievements = this.local.saveGameRecord(currentUser.id, gameData) || [];
    return {
      success: true,
      message: '成绩已保存',
      user: this.local.getCurrentUser(),
      newAchievements
    };
  }

  async getLeaderboard({ limit = 10, metric = 'score', period = 'all' } = {}) {
    if (this.backend === 'api') {
      return this.api.getLeaderboard({ limit, metric, period });
    }

    const list = this.local.getLeaderboard({ limit, metric, period });
    return {
      success: true,
      metric,
      period,
      items: list.map((u, index) => {
        if (period === 'all') {
          let bestScore = 0;
          if (metric === 'score' && u && Array.isArray(u.gameHistory)) {
            for (const record of u.gameHistory) {
              bestScore = Math.max(bestScore, record && record.score ? record.score : 0);
            }
          }
          return {
            rank: index + 1,
            username: u.username,
            value: metric === 'score' ? bestScore : u.stats.bestWPM,
            points: u.stats.points,
            bestWPM: u.stats.bestWPM,
            bestAccuracy: u.stats.bestAccuracy
          };
        }

        return {
          rank: index + 1,
          username: u.username,
          value: u.value,
          points: u.points,
          bestWPM: u.bestWPM,
          bestAccuracy: u.bestAccuracy
        };
      })
    };
  }

  getAchievements() {
    return this.local.getAchievements();
  }

  playSound(soundName) {
    this.soundManager.play(soundName);
  }

  setSoundVolume(volume) {
    this.soundManager.setVolume(volume);
  }

  setSoundEnabled(enabled) {
    this.soundManager.setEnabled(enabled);
  }
}
