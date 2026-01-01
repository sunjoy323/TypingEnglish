// 页面渲染（练习/成就/排行榜/设置）

function loadPracticePage() {
    const practicePage = document.getElementById('practice-page');
    
    // 清空内容
    practicePage.innerHTML = '';
    
    // 创建内容容器
    const contentDiv = document.createElement('div');
    contentDiv.className = 'bg-white rounded-2xl shadow-xl overflow-hidden';
    contentDiv.innerHTML = `
        <div class="bg-primary text-white p-6">
            <h2 class="text-2xl font-bold">练习模式</h2>
            <p class="opacity-90">专注于特定类型的练习</p>
        </div>
        
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <i class="fa fa-keyboard-o text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">基础打字</h3>
                            <p class="text-gray-600 text-sm">练习基本键位</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <i class="fa fa-globe text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">英文文章</h3>
                            <p class="text-gray-600 text-sm">练习完整文章输入</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                            <i class="fa fa-code text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">代码练习</h3>
                            <p class="text-gray-600 text-sm">练习编程代码输入</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-full bg-neutral/10 flex items-center justify-center text-neutral">
                            <i class="fa fa-trophy text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">挑战模式</h3>
                            <p class="text-gray-600 text-sm">限时挑战</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4">自定义练习</h3>
                <div class="space-y-4">
                    <div>
                        <label for="custom-text" class="block text-sm font-medium text-gray-700 mb-1">练习文本</label>
                        <textarea id="custom-text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" rows="4" placeholder="输入自定义练习内容..."></textarea>
                    </div>
                    <button id="start-custom-practice" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200">
                        开始练习
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    practicePage.appendChild(contentDiv);
    
    // 绑定自定义练习事件
    document.getElementById('start-custom-practice').addEventListener('click', () => {
        const textarea = document.getElementById('custom-text');
        const customText = textarea.value.trim();
        
        if (customText) {
            // 切换到主页
            document.getElementById('home-page').classList.remove('hidden');
            practicePage.classList.add('hidden');
            
            // 重置游戏状态
            resetGameState();
            
            // 设置自定义文本
            gameState.currentSentence = customText;
            
            // 开始游戏
            typingInput.disabled = false;
            typingInput.focus();
            startBtn.innerHTML = '<i class="fa fa-refresh mr-2"></i> 重新开始';
            startBtn.classList.remove('bg-secondary');
            startBtn.classList.add('bg-primary');
            pauseBtn.classList.add('hidden');
            
            // 修改计时器显示
            timerElement.textContent = "无时间限制";
            
            // 显示句子
            sentenceElement.textContent = customText;
            
            // 设置游戏状态
            gameState.startTime = Date.now();
            gameState.pausedAt = null;
            gameState.pausedDurationMs = 0;
            gameState.isPlaying = true;
            gameState.isPaused = false;
            
            // 播放游戏开始音效
            userManager.playSound('gameStart');
        } else {
            alert('请输入练习文本');
        }
    });
}

// 加载成就页面
function loadAchievementsPage() {
    const achievementsPage = document.getElementById('achievements-page');
    
    if (!currentUser) {
        achievementsPage.innerHTML = `
            <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa fa-lock text-gray-400 text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-neutral mb-4">请先登录</h2>
                <p class="text-gray-600 mb-6">登录后查看您的成就和进度</p>
                <button class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200" id="login-from-achievements">
                    立即登录
                </button>
            </div>
        `;
        
        document.getElementById('login-from-achievements').addEventListener('click', showAuthModal);
        return;
    }
    
    const achievements = userManager.getAchievements();
    
    let achievementsHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = currentUser.unlockedAchievements.includes(achievement.id);
        const achievementClass = isUnlocked ? 'achievement-unlocked' : 'achievement-locked';
        const medalClass = isUnlocked ? `medal-${achievement.medal}` : 'text-gray-400';
        
        achievementsHTML += `
            <div class="achievement-card ${achievementClass}">
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <i class="fa ${achievement.icon} text-2xl ${medalClass}"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold ${isUnlocked ? 'text-neutral' : 'text-gray-500'}">${achievement.name}</h3>
                        <p class="text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}">${achievement.description}</p>
                        <div class="mt-2 flex justify-between items-center">
                            <span class="text-xs px-2 py-1 rounded-full ${isUnlocked ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-500'}">
                                ${isUnlocked ? '已解锁' : '未解锁'}
                            </span>
                            <span class="text-sm font-medium ${isUnlocked ? medalClass : 'text-gray-400'}">
                                <i class="fa fa-star mr-1"></i>${achievement.points}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    const unlockedCount = currentUser.unlockedAchievements.length;
    const totalCount = achievements.length;
    const progress = Math.round((unlockedCount / totalCount) * 100);
    
    achievementsPage.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-primary text-white p-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">成就系统</h2>
                        <p class="opacity-90">完成挑战,解锁成就</p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold">${unlockedCount}/${totalCount}</div>
                        <div class="text-sm opacity-80">成就进度</div>
                    </div>
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center bg-primary/10 px-4 py-2 rounded-lg">
                        <i class="fa fa-star text-yellow-500 mr-2"></i>
                        <span class="font-medium">${currentUser.stats.points}</span>
                        <span class="ml-1">积分</span>
                    </div>
                    <div class="text-sm text-gray-500">
                        进度: ${progress}%
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${achievementsHTML}
                </div>
            </div>
        </div>
    `;
}

// 加载排行榜页面
function loadLeaderboardPage() {
    const leaderboardPage = document.getElementById('leaderboard-page');
    
    const leaderboard = userManager.getLeaderboard(10, 'points');
    
    let leaderboardHTML = '';
    
    leaderboard.forEach((user, index) => {
        let medalClass = '';
        let medalIcon = '';
        
        if (index === 0) {
            medalClass = 'medal-gold';
            medalIcon = '<i class="fa fa-trophy mr-1"></i>';
        } else if (index === 1) {
            medalClass = 'medal-silver';
            medalIcon = '<i class="fa fa-trophy mr-1"></i>';
        } else if (index === 2) {
            medalClass = 'medal-bronze';
            medalIcon = '<i class="fa fa-trophy mr-1"></i>';
        }
        
        leaderboardHTML += `
            <div class="flex items-center py-4 px-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div class="w-8 text-center font-bold ${medalClass}">
                    ${medalIcon}${index + 1}
                </div>
                <div class="flex-1 ml-4">
                    <div class="font-medium">${user.username}</div>
                    <div class="text-sm text-gray-500">最佳速度: ${user.stats.bestWPM} WPM | 准确率: ${user.stats.bestAccuracy}%</div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-primary">${user.stats.points}</div>
                    <div class="text-sm text-gray-500">积分</div>
                </div>
            </div>
        `;
    });
    
    if (leaderboard.length === 0) {
        leaderboardHTML = `
            <div class="text-center py-12">
                <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa fa-users text-gray-400 text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-neutral mb-2">暂无排行榜数据</h3>
                <p class="text-gray-600">成为第一个登榜的用户！</p>
            </div>
        `;
    }
    
    leaderboardPage.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-primary text-white p-6">
                <h2 class="text-2xl font-bold">排行榜</h2>
                <p class="mt-2 opacity-90">看看谁是最快的打字高手</p>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 gap-4">
                    ${leaderboardHTML}
                </div>
            </div>
        </div>
    `;
}

// 加载设置页面
function loadSettingsPage() {
    const settingsPage = document.getElementById('settings-page');
    
    if (!currentUser) {
        settingsPage.innerHTML = `
            <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa fa-lock text-gray-400 text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-neutral mb-4">请先登录</h2>
                <p class="text-gray-600 mb-6">登录后访问设置页面</p>
                <button class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200" id="login-from-settings">
                    立即登录
                </button>
            </div>
        `;
        
        document.getElementById('login-from-settings').addEventListener('click', showAuthModal);
        return;
    }
    
    const userSettings = currentUser.settings || {};
    
    settingsPage.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-primary text-white p-6">
                <h2 class="text-2xl font-bold">设置</h2>
                <p class="mt-2 opacity-90">个性化你的打字体验</p>
            </div>
            <div class="p-6">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-lg font-bold text-neutral mb-4">游戏设置</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">游戏时长</div>
                                    <div class="text-sm text-gray-500">每局游戏的持续时间</div>
                                </div>
                                <select id="game-duration" class="bg-gray-100 border-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:bg-white">
                                    <option value="60" ${userSettings.gameDuration === 60 ? 'selected' : ''}>60秒</option>
                                    <option value="120" ${userSettings.gameDuration === 120 ? 'selected' : ''}>120秒</option>
                                    <option value="180" ${userSettings.gameDuration === 180 ? 'selected' : ''}>180秒</option>
                                    <option value="300" ${userSettings.gameDuration === 300 ? 'selected' : ''}>300秒</option>
                                </select>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">声音效果</div>
                                    <div class="text-sm text-gray-500">开启或关闭打字音效</div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="sound-enabled" class="sr-only peer" ${userSettings.soundEnabled ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">音量大小</div>
                                    <div class="text-sm text-gray-500">调整音效音量</div>
                                </div>
                                <input type="range" id="sound-volume" min="0" max="100" value="${(userSettings.soundVolume || 0.5) * 100}" class="w-32 accent-primary">
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">显示实时统计</div>
                                    <div class="text-sm text-gray-500">在游戏中显示实时速度和准确率</div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="highlight-enabled" class="sr-only peer" ${userSettings.highlightEnabled ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-bold text-neutral mb-4">账户设置</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">用户名</div>
                                    <div class="text-sm text-gray-500">${currentUser.username}</div>
                                </div>
                                <button class="px-4 py-2 bg-gray-200 text-neutral rounded-lg hover:bg-gray-300 transition-all duration-200" disabled>
                                    暂不支持更改
                                </button>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">邮箱</div>
                                    <div class="text-sm text-gray-500">${currentUser.email}</div>
                                </div>
                                <button class="px-4 py-2 bg-gray-200 text-neutral rounded-lg hover:bg-gray-300 transition-all duration-200" disabled>
                                    暂不支持更改
                                </button>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">密码</div>
                                    <div class="text-sm text-gray-500">********</div>
                                </div>
                                <button class="px-4 py-2 bg-gray-200 text-neutral rounded-lg hover:bg-gray-300 transition-all duration-200" disabled>
                                    暂不支持更改
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-200">
                        <button class="px-6 py-3 bg-danger text-white rounded-lg hover:bg-danger/90 transition-all duration-200 w-full" id="logout-from-settings">
                            退出登录
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 绑定设置事件
    document.getElementById('sound-enabled').addEventListener('change', function() {
        updateUserSetting('soundEnabled', this.checked);
        userManager.setSoundEnabled(this.checked);
        // 测试音效
        if (this.checked) {
            userManager.playSound('correct');
        }
    });
    
    document.getElementById('sound-volume').addEventListener('input', function() {
        const volume = this.value / 100;
        updateUserSetting('soundVolume', volume);
        userManager.setSoundVolume(volume);
        // 测试音效
        userManager.playSound('typing');
    });
    
    document.getElementById('highlight-enabled').addEventListener('change', function() {
        updateUserSetting('highlightEnabled', this.checked);
    });
    
    document.getElementById('game-duration').addEventListener('change', function() {
        updateUserSetting('gameDuration', parseInt(this.value));
    });
    
    document.getElementById('logout-from-settings').addEventListener('click', logout);
}

// 更新用户设置
function updateUserSetting(key, value) {
    if (!currentUser) return;
    
    currentUser.settings[key] = value;
    userManager.updateUser(currentUser);
}


