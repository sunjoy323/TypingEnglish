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
    if (!localStorage.getItem(this.achievementsKey)) {
      localStorage.setItem(this.achievementsKey, JSON.stringify(DEFAULT_ACHIEVEMENTS));
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

    for (const achievement of achievements) {
      if (user.unlockedAchievements.includes(achievement.id)) continue;

      let unlocked = false;
      switch (achievement.conditionType) {
        case 'games_played':
          unlocked = user.stats.gamesPlayed >= achievement.conditionValue;
          break;
        case 'wpm':
          unlocked = user.stats.bestWPM >= achievement.conditionValue;
          break;
        case 'accuracy':
          unlocked = user.stats.bestAccuracy >= achievement.conditionValue;
          break;
        case 'words_completed':
          unlocked = user.stats.totalWordsCompleted >= achievement.conditionValue;
          break;
        case 'expert_completion':
          unlocked = user.difficultiesCompleted.includes('expert');
          break;
        case 'all_difficulties':
          unlocked = ['easy', 'medium', 'hard', 'expert'].every((diff) => user.difficultiesCompleted.includes(diff));
          break;
      }

      if (unlocked) {
        newAchievements.push(achievement);
        user.stats.points += achievement.points;
      }
    }

    return newAchievements;
  }

  getLeaderboard({ limit = 10, metric = 'score', period = 'all' } = {}) {
    const users = this.getUsers().map((u) => this.getUserWithoutPassword(u));

    if (period === 'all') {
      if (metric === 'score') {
        return users.sort((a, b) => b.stats.points - a.stats.points).slice(0, limit);
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
          existing.value += record.score || 0;
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
          return {
            rank: index + 1,
            username: u.username,
            value: metric === 'score' ? u.stats.points : u.stats.bestWPM,
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
