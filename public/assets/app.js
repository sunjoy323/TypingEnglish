// 创建全局用户管理器实例
const userManager = new UserManager();

// 游戏状态
let gameState = {
    isPlaying: false,
    isPaused: false,
    currentSentence: '',
    typedSentence: '',
    startTime: null,
    pausedAt: null,
    pausedDurationMs: 0,
    timer: null,
    timeLeft: 120,
    score: 0,
    wpm: 0,
    accuracy: 0,
    wordsCompleted: 0,
    errors: 0,
    currentDifficulty: 'medium',
    correctChars: 0,
    totalChars: 0
};

// 当前用户
let currentUser = null;

// DOM元素
const typingInput = document.getElementById('typing-input');
const sentenceElement = document.getElementById('sentence');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const wordsCompletedElement = document.getElementById('words-completed');
const errorsElement = document.getElementById('errors');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const difficultySelect = document.getElementById('difficulty');
const gameOverModal = document.getElementById('game-over-modal');
const modalContent = document.getElementById('modal-content');
const playAgainBtn = document.getElementById('play-again-btn');
const shareBtn = document.getElementById('share-btn');
const finalScoreElement = document.getElementById('final-score');
const finalWpmElement = document.getElementById('final-wpm');
const finalAccuracyElement = document.getElementById('final-accuracy');
const finalWordsElement = document.getElementById('final-words');
const achievementNotification = document.getElementById('achievement-notification');
const achievementText = document.getElementById('achievement-text');
const achievementPoints = document.getElementById('achievement-points');

// 初始化应用
function initializeApp() {
    // 检查登录状态
    checkAuthStatus();
    
    // 初始化事件监听器
    initializeGameEventListeners();
    initializeNavigationEventListeners();
    initializeModalEventListeners();
    initializeUIEventListeners();
}

// 检查登录状态
function checkAuthStatus() {
    const user = userManager.getCurrentUser();
    if (user) {
        currentUser = user;
        updateUIForLoggedInUser(user);
        // 应用用户声音设置
        if (user.settings) {
            userManager.setSoundEnabled(user.settings.soundEnabled);
            if (user.settings.soundVolume !== undefined) {
                userManager.setSoundVolume(user.settings.soundVolume);
            }
        }
    }
}

// 初始化游戏事件监听器
function initializeGameEventListeners() {
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    typingInput.addEventListener('input', handleTyping);
    difficultySelect.addEventListener('change', function() {
        gameState.currentDifficulty = this.value;
    });
    playAgainBtn.addEventListener('click', function() {
        hideGameOverModal();
        showPage('home-page');
    });
    
    // 分享按钮
    shareBtn.addEventListener('click', shareResults);
}

// 初始化导航事件监听器
function initializeNavigationEventListeners() {
    // 桌面端导航
    document.getElementById('home-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('home-page');
    });
    
    document.getElementById('practice-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('practice-page');
        loadPracticePage();
    });
    
    document.getElementById('achievements-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('achievements-page');
        loadAchievementsPage();
    });
    
    document.getElementById('leaderboard-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('leaderboard-page');
        loadLeaderboardPage();
    });
    
    document.getElementById('settings-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('settings-page');
        loadSettingsPage();
    });
    
    // 移动端导航
    document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
    
    document.querySelector('.home-mobile-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('home-page');
        hideMobileMenu();
    });
    
    document.querySelector('.practice-mobile-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('practice-page');
        loadPracticePage();
        hideMobileMenu();
    });
    
    document.querySelector('.achievements-mobile-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('achievements-page');
        loadAchievementsPage();
        hideMobileMenu();
    });
    
    document.querySelector('.leaderboard-mobile-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('leaderboard-page');
        loadLeaderboardPage();
        hideMobileMenu();
    });
    
    document.querySelector('.settings-mobile-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('settings-page');
        loadSettingsPage();
        hideMobileMenu();
    });
    
    // 移动端登录按钮
    document.querySelector('#mobile-login-section button').addEventListener('click', function() {
        showAuthModal();
        hideMobileMenu();
    });
    
    // 移动端退出按钮
    document.getElementById('mobile-logout-btn').addEventListener('click', function() {
        logout();
        hideMobileMenu();
    });
}

// 初始化模态框事件监听器
function initializeModalEventListeners() {
    // 登录按钮
    document.getElementById('login-btn').addEventListener('click', showAuthModal);
    
    // 退出按钮
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // 移动端退出按钮
    document.getElementById('mobile-logout-btn').addEventListener('click', logout);
    
    // 关闭模态框按钮
    document.getElementById('close-auth-modal').addEventListener('click', hideAuthModal);
    
    // 登录/注册标签切换
    document.getElementById('login-tab').addEventListener('click', function() {
        showLoginForm();
    });
    
    document.getElementById('register-tab').addEventListener('click', function() {
        showRegisterForm();
    });
    
    // 表单提交
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
    
    // 点击模态框外部关闭
    document.getElementById('auth-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideAuthModal();
        }
    });
    
    document.getElementById('game-over-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideGameOverModal();
        }
    });
}

// 初始化UI事件监听器
function initializeUIEventListeners() {
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter 开始/暂停游戏
        if (e.ctrlKey && e.key === 'Enter') {
            if (gameState.isPlaying) {
                togglePause();
            } else {
                startGame();
            }
        }
        // ESC 暂停游戏
        if (e.key === 'Escape' && gameState.isPlaying) {
            togglePause();
        }
        // Alt+L 打开登录框
        if (e.altKey && e.key.toLowerCase() === 'l') {
            showAuthModal();
        }
        // Alt+H 返回主页
        if (e.altKey && e.key.toLowerCase() === 'h') {
            showPage('home-page');
        }
        // Alt+P 打开练习模式
        if (e.altKey && e.key.toLowerCase() === 'p') {
            showPage('practice-page');
            loadPracticePage();
        }
        // Alt+A 打开成就页面
        if (e.altKey && e.key.toLowerCase() === 'a') {
            showPage('achievements-page');
            loadAchievementsPage();
        }
        // Alt+B 打开排行榜页面
        if (e.altKey && e.key.toLowerCase() === 'b') {
            showPage('leaderboard-page');
            loadLeaderboardPage();
        }
        // Alt+S 打开设置页面
        if (e.altKey && e.key.toLowerCase() === 's') {
            showPage('settings-page');
            loadSettingsPage();
        }
    });
}

// 显示页面
function showPage(pageId) {
    // 隐藏所有页面
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('practice-page').classList.add('hidden');
    document.getElementById('achievements-page').classList.add('hidden');
    document.getElementById('leaderboard-page').classList.add('hidden');
    document.getElementById('settings-page').classList.add('hidden');
    
    // 显示目标页面
    document.getElementById(pageId).classList.remove('hidden');
}

// 切换移动端菜单
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
    } else {
        mobileMenu.classList.add('hidden');
    }
}

// 隐藏移动端菜单
function hideMobileMenu() {
    document.getElementById('mobile-menu').classList.add('hidden');
}

// 显示认证模态框
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    const modalContent = document.getElementById('auth-modal-content');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // 默认显示登录表单
    showLoginForm();
}

// 隐藏认证模态框
function hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    const modalContent = document.getElementById('auth-modal-content');
    
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    
    // 清除表单和消息
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    hideAuthMessage();
}

// 显示登录表单
function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-tab').classList.add('text-primary', 'border-primary');
    document.getElementById('login-tab').classList.remove('text-gray-500');
    document.getElementById('register-tab').classList.add('text-gray-500');
    document.getElementById('register-tab').classList.remove('text-primary', 'border-primary');
    document.getElementById('auth-modal-title').textContent = '登录';
    hideAuthMessage();
}

// 显示注册表单
function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('register-tab').classList.add('text-primary', 'border-primary');
    document.getElementById('register-tab').classList.remove('text-gray-500');
    document.getElementById('login-tab').classList.add('text-gray-500');
    document.getElementById('login-tab').classList.remove('text-primary', 'border-primary');
    document.getElementById('auth-modal-title').textContent = '注册';
    hideAuthMessage();
}

// 显示认证消息
function showAuthMessage(message, isSuccess = false) {
    const messageEl = document.getElementById('auth-message');
    messageEl.textContent = message;
    messageEl.classList.remove('hidden');
    
    if (isSuccess) {
        messageEl.classList.remove('bg-red-100', 'text-red-700', 'border-red-300');
        messageEl.classList.add('bg-green-100', 'text-green-700', 'border-green-300');
    } else {
        messageEl.classList.remove('bg-green-100', 'text-green-700', 'border-green-300');
        messageEl.classList.add('bg-red-100', 'text-red-700', 'border-red-300');
    }
}

// 隐藏认证消息
function hideAuthMessage() {
    document.getElementById('auth-message').classList.add('hidden');
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const result = userManager.login(username, password);
    
    if (result.success) {
        showAuthMessage('登录成功！', true);
        currentUser = result.user;
        setTimeout(() => {
            hideAuthModal();
            updateUIForLoggedInUser(result.user);
        }, 1000);
    } else {
        showAuthMessage(result.message, false);
    }
}

// 处理注册
function handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // 验证密码确认
    if (password !== confirmPassword) {
        showAuthMessage('两次输入的密码不一致', false);
        return;
    }
    
    const result = userManager.register({ username, email, password });
    
    if (result.success) {
        showAuthMessage('注册成功！请登录', true);
        setTimeout(() => {
            showLoginForm();
            document.getElementById('login-username').value = username;
        }, 1500);
    } else {
        showAuthMessage(result.message, false);
    }
}

// 登出
function logout() {
    userManager.clearCurrentUser();
    currentUser = null;
    updateUIForLoggedOutUser();
}

// 更新UI为已登录状态
function updateUIForLoggedInUser(user) {
    // 更新桌面端UI
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('login-btn').classList.add('hidden');
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('user-points').classList.remove('hidden');
    document.getElementById('user-points').querySelector('span').textContent = user.stats.points;
    
    // 更新移动端UI
    document.getElementById('mobile-user-info').classList.remove('hidden');
    document.getElementById('mobile-login-section').classList.add('hidden');
    document.getElementById('mobile-username').textContent = user.username;
    document.getElementById('mobile-points').textContent = user.stats.points;
}

// 更新UI为未登录状态
function updateUIForLoggedOutUser() {
    // 更新桌面端UI
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('login-btn').classList.remove('hidden');
    document.getElementById('user-points').classList.add('hidden');
    
    // 更新移动端UI
    document.getElementById('mobile-user-info').classList.add('hidden');
    document.getElementById('mobile-login-section').classList.remove('hidden');
}

// 开始游戏
function startGame() {
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    if (gameState.isPlaying) {
        // 重新开始游戏
        resetGameState();
    }
    
    gameState.isPlaying = true;
    gameState.isPaused = false;
    gameState.timeLeft = 120;
    gameState.score = 0;
    gameState.wpm = 0;
    gameState.accuracy = 0;
    gameState.wordsCompleted = 0;
    gameState.errors = 0;
    gameState.typedSentence = '';
    gameState.correctChars = 0;
    gameState.totalChars = 0;
    gameState.pausedAt = null;
    gameState.pausedDurationMs = 0;
    
    // 更新UI
    startBtn.innerHTML = '<i class="fa fa-refresh mr-2"></i> 重新开始';
    pauseBtn.classList.remove('hidden');
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.focus();
    
    // 选择句子
    selectRandomSentence();
    
    // 开始计时器
    startTimer();
    
    // 更新统计显示
    updateStatsDisplay();
    
    // 播放游戏开始音效
    userManager.playSound('gameStart');
}

// 选择随机句子
function selectRandomSentence() {
    const difficulty = gameState.currentDifficulty;
    const sentenceArray = sentences[difficulty];
    const randomIndex = Math.floor(Math.random() * sentenceArray.length);
    gameState.currentSentence = sentenceArray[randomIndex];
    
    // 更新UI
    updateSentenceDisplay();
}

// 开始计时器
function startTimer() {
    gameState.startTime = Date.now();
    gameState.pausedAt = null;
    gameState.pausedDurationMs = 0;
    
    gameState.timer = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.timeLeft--;
            timerElement.textContent = `${gameState.timeLeft}sec`;
            
            // 计算实时WPM
            calculateStats();
            updateStatsDisplay();
            
            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

// 处理输入
function handleTyping(e) {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    const newTypedSentence = e.target.value;
    const oldTypedSentence = gameState.typedSentence;
    gameState.typedSentence = newTypedSentence;

    // 统计本次输入的新增字符（兼容粘贴/中间编辑），用于更准确的 WPM/得分计算
    const getTextDiff = (beforeText, afterText) => {
        let prefixLength = 0;
        const minLength = Math.min(beforeText.length, afterText.length);
        while (prefixLength < minLength && beforeText[prefixLength] === afterText[prefixLength]) {
            prefixLength++;
        }

        let beforeEnd = beforeText.length - 1;
        let afterEnd = afterText.length - 1;
        while (
            beforeEnd >= prefixLength &&
            afterEnd >= prefixLength &&
            beforeText[beforeEnd] === afterText[afterEnd]
        ) {
            beforeEnd--;
            afterEnd--;
        }

        return {
            index: prefixLength,
            inserted: afterText.slice(prefixLength, afterEnd + 1),
            removed: beforeText.slice(prefixLength, beforeEnd + 1)
        };
    };

    const diff = getTextDiff(oldTypedSentence, newTypedSentence);
    const insertedText = diff.inserted || '';

    if (insertedText.length > 0) {
        // 播放打字音效
        userManager.playSound('typing');

        let correctInserted = 0;
        let incorrectInserted = 0;
        for (let i = 0; i < insertedText.length; i++) {
            const targetIndex = diff.index + i;
            const expectedChar = gameState.currentSentence[targetIndex];
            if (expectedChar !== undefined && insertedText[i] === expectedChar) {
                correctInserted++;
            } else {
                incorrectInserted++;
            }
        }

        gameState.totalChars += insertedText.length;
        gameState.correctChars += correctInserted;

        // 播放正确/错误音效（避免粘贴时连播）
        if (insertedText.length === 1) {
            userManager.playSound(incorrectInserted > 0 ? 'error' : 'correct');
        } else if (incorrectInserted > 0) {
            userManager.playSound('error');
        } else {
            userManager.playSound('correct');
        }
    }
    
    // 计算打字速度和准确率
    calculateStats();
    
    // 更新UI
    updateStatsDisplay();
    updateSentenceDisplay();
    
    // 检查是否完成句子
    if (gameState.typedSentence === gameState.currentSentence) {
        completeSentence();
    }
}

// 计算统计信息
function calculateStats() {
    if (!gameState.startTime) {
        gameState.wpm = 0;
        gameState.accuracy = 0;
        gameState.errors = 0;
        gameState.score = 0;
        return;
    }

    const now = Date.now();
    const pausedDurationMs =
        gameState.pausedDurationMs + (gameState.pausedAt ? now - gameState.pausedAt : 0);
    const elapsedMs = Math.max(0, now - gameState.startTime - pausedDurationMs);
    const elapsedMinutes = elapsedMs / 1000 / 60;

    const accuracyRatio =
        gameState.totalChars > 0 ? gameState.correctChars / gameState.totalChars : 0;
    const grossWpm = elapsedMinutes > 0 ? (gameState.totalChars / 5) / elapsedMinutes : 0;
    const netWpm = grossWpm * accuracyRatio;

    // 计算 WPM (按标准：5 个字符=1 个词)
    gameState.wpm = Math.round(grossWpm);

    // 计算准确率
    gameState.accuracy = gameState.totalChars > 0 ? Math.round(accuracyRatio * 100) : 0;

    // 计算错误数（仅统计输入的字符，不包含删除）
    gameState.errors = Math.max(0, gameState.totalChars - gameState.correctChars);
    
    // 计算分数
    const difficultyMultipliers = {
        easy: 1,
        medium: 1.5,
        hard: 2,
        expert: 3
    };
    
    const multiplier = difficultyMultipliers[gameState.currentDifficulty] || 1;
    gameState.score = Math.round(netWpm * multiplier);
}

// 更新统计显示
function updateStatsDisplay() {
    scoreElement.textContent = gameState.score;
    wpmElement.textContent = `${gameState.wpm} WPM`;
    accuracyElement.textContent = `${gameState.accuracy}%`;
    wordsCompletedElement.textContent = gameState.wordsCompleted;
    errorsElement.textContent = gameState.errors;
}

// 更新句子显示
function updateSentenceDisplay() {
    let html = '';
    const chars = gameState.currentSentence.split('');
    
    for (let i = 0; i < chars.length; i++) {
        if (i < gameState.typedSentence.length) {
            if (gameState.typedSentence[i] === chars[i]) {
                html += `<span class="char-correct">${chars[i]}</span>`;
            } else {
                html += `<span class="char-incorrect">${chars[i]}</span>`;
            }
        } else if (i === gameState.typedSentence.length) {
            html += `<span class="typing-active">${chars[i]}</span>`;
        } else {
            html += chars[i];
        }
    }
    
    sentenceElement.innerHTML = html;
}

// 完成句子
function completeSentence() {
    const wordsInSentence = gameState.currentSentence.trim().split(/\s+/).length;
    gameState.wordsCompleted += wordsInSentence;
    
    // 播放完成音效
    userManager.playSound('complete');
    
    // 短暂延迟后选择新句子
    setTimeout(() => {
        selectRandomSentence();
        typingInput.value = '';
        gameState.typedSentence = '';
        updateSentenceDisplay();
    }, 500);
}

// 切换暂停状态
function togglePause() {
    if (!gameState.isPlaying) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        gameState.pausedAt = Date.now();
        pauseBtn.innerHTML = '<i class="fa fa-play mr-2"></i> 继续';
        typingInput.disabled = true;
        // 播放暂停音效
        userManager.playSound('error');
    } else {
        if (gameState.pausedAt) {
            gameState.pausedDurationMs += Date.now() - gameState.pausedAt;
            gameState.pausedAt = null;
        }
        pauseBtn.innerHTML = '<i class="fa fa-pause mr-2"></i> 暂停';
        typingInput.disabled = false;
        typingInput.focus();
        // 播放继续音效
        userManager.playSound('correct');
    }
}

// 结束游戏
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timer);
    
    // 更新UI
    startBtn.innerHTML = '<i class="fa fa-play mr-2"></i> 开始游戏';
    pauseBtn.classList.add('hidden');
    typingInput.disabled = true;
    
    // 显示游戏结束模态框
    showGameOverModal();
    
    // 保存游戏结果
    saveGameResults();
    
    // 播放游戏结束音效
    userManager.playSound('gameOver');
}

// 显示游戏结束模态框
function showGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    const modalContent = document.getElementById('modal-content');
    
    // 更新最终成绩
    finalScoreElement.textContent = gameState.score;
    finalWpmElement.textContent = `${gameState.wpm} WPM`;
    finalAccuracyElement.textContent = `${gameState.accuracy}%`;
    finalWordsElement.textContent = gameState.wordsCompleted;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

// 隐藏游戏结束模态框
function hideGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// 保存游戏结果
function saveGameResults() {
    if (!currentUser) return;
    
    const gameData = {
        difficulty: gameState.currentDifficulty,
        duration: 120 - gameState.timeLeft,
        score: gameState.score,
        wpm: gameState.wpm,
        accuracy: gameState.accuracy,
        wordsCompleted: gameState.wordsCompleted,
        errors: gameState.errors
    };
    
    const newAchievements = userManager.saveGameRecord(currentUser.id, gameData);
    
    // 更新本地用户数据
    currentUser = userManager.getCurrentUser();
    updateUIForLoggedInUser(currentUser);
    
    // 显示新解锁的成就
    if (newAchievements && newAchievements.length > 0) {
        showAchievementNotification(newAchievements[0]);
    }
}

// 显示成就通知
function showAchievementNotification(achievement) {
    achievementText.textContent = `解锁成就: ${achievement.name}`;
    achievementPoints.textContent = `+${achievement.points}积分`;
    achievementNotification.classList.remove('hidden');
    
    // 播放成就解锁音效
    userManager.playSound('achievement');
    
    setTimeout(() => {
        achievementNotification.classList.add('hidden');
    }, 5000);
}

// 分享成绩
function shareResults() {
    const text = `我在TypingEnglish打字游戏中获得了 ${gameState.score} 分，打字速度 ${gameState.wpm} WPM，正确率 ${gameState.accuracy}%！`;
    
    if (navigator.share) {
        navigator.share({
            title: 'TypingEnglish 成绩分享',
            text: text,
            url: window.location.href
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('成绩已复制到剪贴板！');
        });
    } else {
        alert(text);
    }
}

// 重置游戏状态
function resetGameState() {
    gameState.isPlaying = false;
    gameState.isPaused = false;
    gameState.currentSentence = '';
    gameState.typedSentence = '';
    gameState.startTime = null;
    gameState.pausedAt = null;
    gameState.pausedDurationMs = 0;
    gameState.timeLeft = 120;
    gameState.score = 0;
    gameState.wpm = 0;
    gameState.accuracy = 0;
    gameState.wordsCompleted = 0;
    gameState.errors = 0;
    gameState.correctChars = 0;
    gameState.totalChars = 0;
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }

    if (gameState.pausedAt) {
        gameState.pausedAt = null;
    }
    
    // 更新UI
    timerElement.textContent = '120sec';
    scoreElement.textContent = '0';
    wpmElement.textContent = '0 WPM';
    accuracyElement.textContent = '0%';
    wordsCompletedElement.textContent = '0';
    errorsElement.textContent = '0';
    typingInput.value = '';
    sentenceElement.textContent = '准备好了吗?点击开始按钮,然后输入显示的英文句子.';
}

// 练习模式页面初始化
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

// 启动应用
document.addEventListener('DOMContentLoaded', initializeApp);
    // 页脚快速链接导航
    document.getElementById('footer-home-link').addEventListener('click', function(e) {
e.preventDefault();
showPage('home-page');
    });
    document.getElementById('footer-practice-link').addEventListener('click', function(e) {
e.preventDefault();
showPage('practice-page');
loadPracticePage();
    });
    document.getElementById('footer-achievements-link').addEventListener('click', function(e) {
e.preventDefault();
showPage('achievements-page');
loadAchievementsPage();
    });
    document.getElementById('footer-leaderboard-link').addEventListener('click', function(e) {
e.preventDefault();
showPage('leaderboard-page');
loadLeaderboardPage();
    });
    document.getElementById('footer-settings-link').addEventListener('click', function(e) {
e.preventDefault();
showPage('settings-page');
loadSettingsPage();
    });
