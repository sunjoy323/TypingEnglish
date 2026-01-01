// 用户管理类 - 使用localStorage存储数据
class UserManager {
    constructor() {
        this.usersKey = 'typingGameUsers';
        this.currentUserKey = 'typingGameCurrentUser';
        this.achievementsKey = 'typingGameAchievements';
        this.soundManager = new SoundManager();
        this.initDefaultAchievements();
    }

    // 初始化默认成就
    initDefaultAchievements() {
        const defaultAchievements = [
            { id: 1, name: '打字新手', description: '完成第一局游戏', icon: 'fa-keyboard-o', medal: 'bronze', points: 10, conditionType: 'games_played', conditionValue: 1 },
            { id: 2, name: '速度之星', description: '打字速度达到50 WPM', icon: 'fa-bolt', medal: 'silver', points: 25, conditionType: 'wpm', conditionValue: 50 },
            { id: 3, name: '精准大师', description: '准确率达到95%', icon: 'fa-bullseye', medal: 'silver', points: 25, conditionType: 'accuracy', conditionValue: 95 },
            { id: 4, name: '百词斩', description: '累计完成100个单词', icon: 'fa-flag-checkered', medal: 'bronze', points: 15, conditionType: 'words_completed', conditionValue: 100 },
            { id: 5, name: '专家挑战者', description: '在专家难度下完成游戏', icon: 'fa-graduation-cap', medal: 'gold', points: 50, conditionType: 'expert_completion', conditionValue: 1 },
            { id: 6, name: '马拉松选手', description: '完成10局游戏', icon: 'fa-road', medal: 'bronze', points: 20, conditionType: 'games_played', conditionValue: 10 },
            { id: 7, name: '极速传说', description: '打字速度达到100 WPM', icon: 'fa-rocket', medal: 'gold', points: 100, conditionType: 'wpm', conditionValue: 100 },
            { id: 8, name: '完美主义', description: '准确率达到100%', icon: 'fa-star', medal: 'gold', points: 50, conditionType: 'accuracy', conditionValue: 100 },
            { id: 9, name: '单词达人', description: '累计完成500个单词', icon: 'fa-trophy', medal: 'silver', points: 40, conditionType: 'words_completed', conditionValue: 500 },
            { id: 10, name: '全能玩家', description: '在所有难度下都完成游戏', icon: 'fa-globe', medal: 'gold', points: 75, conditionType: 'all_difficulties', conditionValue: 1 }
        ];

        if (!localStorage.getItem(this.achievementsKey)) {
            localStorage.setItem(this.achievementsKey, JSON.stringify(defaultAchievements));
        }
    }

    // 获取所有用户
    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    }

    // 保存用户数据
    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    // 获取当前用户
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.currentUserKey));
    }

    // 设置当前用户
    setCurrentUser(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    }

    // 清除当前用户
    clearCurrentUser() {
        localStorage.removeItem(this.currentUserKey);
    }

    // 注册用户
    register(userData) {
        const users = this.getUsers();
        
        // 验证用户名格式
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(userData.username)) {
            return { success: false, message: '用户名格式不正确（3-20位字母、数字或下划线）' };
        }

        // 检查用户名是否已存在
        if (users.find(user => user.username === userData.username)) {
            return { success: false, message: '用户名已存在' };
        }

        // 检查邮箱是否已存在
        if (users.find(user => user.email === userData.email)) {
            return { success: false, message: '邮箱已被注册' };
        }

        // 验证密码长度
        if (userData.password.length < 6) {
            return { success: false, message: '密码长度至少6个字符' };
        }

        // 创建新用户
        const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            password: this.hashPassword(userData.password), // 简单哈希，实际项目中应该使用更安全的方法
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

        // 播放注册成功音效
        this.soundManager.play('correct');

        return {
            success: true,
            message: '注册成功',
            user: this.getUserWithoutPassword(newUser)
        };
    }

    // 登录用户
    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return { success: false, message: '用户名或密码错误' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: '用户名或密码错误' };
        }

        this.setCurrentUser(this.getUserWithoutPassword(user));
        
        // 播放登录成功音效
        this.soundManager.play('correct');
        
        return {
            success: true,
            message: '登录成功',
            user: this.getUserWithoutPassword(user)
        };
    }

    // 更新用户数据
    updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        
        if (index !== -1) {
            // 保留密码字段
            updatedUser.password = users[index].password;
            users[index] = updatedUser;
            this.saveUsers(users);
            
            // 如果更新的是当前用户，也更新当前用户数据
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === updatedUser.id) {
                this.setCurrentUser(this.getUserWithoutPassword(updatedUser));
            }
        }
    }

    // 保存游戏记录
    saveGameRecord(userId, gameData) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return null;

        const record = {
            id: Date.now().toString(),
            difficulty: gameData.difficulty,
            duration: gameData.duration,
            score: gameData.score,
            wpm: gameData.wpm,
            accuracy: gameData.accuracy,
            wordsCompleted: gameData.wordsCompleted,
            errors: gameData.errors,
            playedAt: new Date().toISOString()
        };

        // 更新用户统计
        user.stats.points += gameData.score;
        user.stats.bestWPM = Math.max(user.stats.bestWPM, gameData.wpm);
        user.stats.bestAccuracy = Math.max(user.stats.bestAccuracy, gameData.accuracy);
        user.stats.gamesPlayed += 1;
        user.stats.totalWordsCompleted += gameData.wordsCompleted;
        user.stats.totalErrors += gameData.errors;
        user.stats.totalTimePlayed += gameData.duration;

        // 记录完成的难度
        if (!user.difficultiesCompleted.includes(gameData.difficulty)) {
            user.difficultiesCompleted.push(gameData.difficulty);
        }

        // 添加游戏记录
        user.gameHistory.unshift(record);
        if (user.gameHistory.length > 50) {
            user.gameHistory = user.gameHistory.slice(0, 50);
        }

        this.saveUsers(users);

        // 检查成就解锁
        const newAchievements = this.checkAchievements(user);
        if (newAchievements.length > 0) {
            user.unlockedAchievements.push(...newAchievements.map(a => a.id));
            this.saveUsers(users);
            
            // 更新当前用户
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                currentUser.unlockedAchievements.push(...newAchievements.map(a => a.id));
                currentUser.stats = user.stats;
                this.setCurrentUser(currentUser);
            }

            return newAchievements;
        }

        return [];
    }

    // 检查成就解锁
    checkAchievements(user) {
        const achievements = JSON.parse(localStorage.getItem(this.achievementsKey));
        const newAchievements = [];

        for (const achievement of achievements) {
            if (user.unlockedAchievements.includes(achievement.id)) {
                continue;
            }

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
                    unlocked = ['easy', 'medium', 'hard', 'expert'].every(diff => 
                        user.difficultiesCompleted.includes(diff)
                    );
                    break;
            }

            if (unlocked) {
                newAchievements.push(achievement);
                // 添加成就点数
                user.stats.points += achievement.points;
            }
        }

        return newAchievements;
    }

    // 获取排行榜
    getLeaderboard(limit = 10, sortBy = 'points') {
        const users = this.getUsers();
        const sortedUsers = users
            .map(user => this.getUserWithoutPassword(user))
            .sort((a, b) => b.stats[sortBy] - a.stats[sortBy])
            .slice(0, limit);

        return sortedUsers;
    }

    // 获取所有成就
    getAchievements() {
        return JSON.parse(localStorage.getItem(this.achievementsKey));
    }

    // 辅助方法：移除密码字段
    getUserWithoutPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // 简单密码哈希（实际项目中应该使用更安全的方法）
    hashPassword(password) {
        return btoa(password); // 注意：这只是一个简单的示例，不适用于生产环境
    }

    // 播放声音
    playSound(soundName) {
        this.soundManager.play(soundName);
    }

    // 设置声音音量
    setSoundVolume(volume) {
        this.soundManager.setVolume(volume);
    }

    // 启用/禁用声音
    setSoundEnabled(enabled) {
        this.soundManager.setEnabled(enabled);
    }
}
