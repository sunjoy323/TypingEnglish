// 游戏核心逻辑（计时、输入、统计、得分）

// 初始化游戏事件监听器
function initializeGameEventListeners() {
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  typingInput.addEventListener('input', handleTyping);
  difficultySelect.addEventListener('change', function () {
    gameState.currentDifficulty = this.value;
  });
  playAgainBtn.addEventListener('click', function () {
    hideGameOverModal();
    showPage('home-page');
  });

  // 分享按钮
  shareBtn.addEventListener('click', shareResults);

  const reviewBtn = document.getElementById('session-review-btn');
  if (reviewBtn) reviewBtn.addEventListener('click', openSessionReviewScreen);

  const closeBtn = document.getElementById('session-review-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeSessionReviewScreen());

  const backdrop = document.getElementById('session-review-backdrop');
  if (backdrop) backdrop.addEventListener('click', () => closeSessionReviewScreen());

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeSessionReviewScreen();
  });
}

// 开始游戏
async function startGame() {
  const unlockPromise = userManager.soundManager.unlock();

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
  gameState.timeLeft = gameConfig.defaultDurationSeconds;
  gameState.score = 0;
  gameState.wpm = 0;
  gameState.accuracy = 0;
  gameState.wordsCompleted = 0;
  gameState.errors = 0;
  gameState.typedSentence = '';
  gameState.correctChars = 0;
  gameState.totalChars = 0;
  gameState.sessionSentences = [];
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
  await unlockPromise;
  userManager.playSound('gameStart');
}

// 选择随机句子
function selectRandomSentence() {
  const difficulty = gameState.currentDifficulty;
  const sentenceArray = sentences[difficulty];
  const randomIndex = Math.floor(Math.random() * sentenceArray.length);
  gameState.currentSentence = sentenceArray[randomIndex];
  gameState.currentSentenceZh =
    typeof sentenceTranslations !== 'undefined' && sentenceTranslations[difficulty]
      ? sentenceTranslations[difficulty][randomIndex] || ''
      : '';

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
  }, gameConfig.timerTickMs);
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

  const accuracyRatio = gameState.totalChars > 0 ? gameState.correctChars / gameState.totalChars : 0;
  const grossWpm =
    elapsedMinutes > 0 ? (gameState.totalChars / gameConfig.wpmCharsPerWord) / elapsedMinutes : 0;
  const netWpm = grossWpm * accuracyRatio;

  // 计算 WPM (按标准：5 个字符=1 个词)
  gameState.wpm = Math.round(grossWpm);

  // 计算准确率
  gameState.accuracy = gameState.totalChars > 0 ? Math.round(accuracyRatio * 100) : 0;

  // 计算错误数（仅统计输入的字符，不包含删除）
  gameState.errors = Math.max(0, gameState.totalChars - gameState.correctChars);

  // 计算分数
  const multiplier = gameConfig.scoreDifficultyMultipliers[gameState.currentDifficulty] || 1;
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

function recordSentenceForReview({ completed }) {
  if (!gameState.currentSentence) return;
  if (!Array.isArray(gameState.sessionSentences)) gameState.sessionSentences = [];

  const entry = {
    en: gameState.currentSentence,
    zh: gameState.currentSentenceZh || '',
    difficulty: gameState.currentDifficulty,
    completed: Boolean(completed)
  };
  const last = gameState.sessionSentences[gameState.sessionSentences.length - 1];
  if (
    last &&
    last.en === entry.en &&
    last.zh === entry.zh &&
    last.difficulty === entry.difficulty &&
    last.completed === entry.completed
  ) {
    return;
  }
  gameState.sessionSentences.push(entry);
}

function getDifficultyLabel(difficulty) {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    case 'expert':
      return '专家';
    default:
      return '未知';
  }
}

let sessionReviewBodyOverflow = null;

function updateSessionReviewButton() {
  const btn = document.getElementById('session-review-btn');
  const metaEl = document.getElementById('session-review-btn-meta');
  if (!btn || !metaEl) return;

  const items = Array.isArray(gameState.sessionSentences) ? gameState.sessionSentences : [];
  if (items.length === 0) {
    metaEl.textContent = '· 暂无记录';
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    return;
  }

  metaEl.textContent = `· ${items.length} 句`;
  btn.disabled = false;
  btn.classList.remove('opacity-50', 'cursor-not-allowed');
}

function renderSessionReviewScreen() {
  const listEl = document.getElementById('session-review-list');
  const emptyEl = document.getElementById('session-review-empty');
  const metaEl = document.getElementById('session-review-meta');
  const statsEl = document.getElementById('session-review-stats');
  if (!listEl || !emptyEl || !metaEl || !statsEl) return;

  listEl.innerHTML = '';
  statsEl.innerHTML = '';

  const rawItems = Array.isArray(gameState.sessionSentences) ? gameState.sessionSentences : [];
  const items = rawItems.filter((item) => item && item.en);
  const completedCount = items.filter((item) => item.completed !== false).length;

  metaEl.textContent =
    items.length === 0 ? '本局暂无记录' : `共 ${items.length} 句 · 已完成 ${completedCount} 句 · 未完成 ${items.length - completedCount} 句`;

  const createStatChip = (iconClass, label, value) => {
    const chip = document.createElement('div');
    chip.className =
      'px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs flex items-center gap-2';

    const icon = document.createElement('i');
    icon.className = `${iconClass} text-white/70`;
    chip.appendChild(icon);

    const text = document.createElement('span');
    text.textContent = `${label}: ${value}`;
    chip.appendChild(text);

    return chip;
  };

  statsEl.appendChild(createStatChip('fa fa-star', '分数', gameState.score));
  statsEl.appendChild(createStatChip('fa fa-tachometer', 'WPM', gameState.wpm));
  statsEl.appendChild(createStatChip('fa fa-bullseye', '正确率', `${gameState.accuracy}%`));
  statsEl.appendChild(createStatChip('fa fa-font', '完成单词', gameState.wordsCompleted));

  if (items.length === 0) {
    emptyEl.classList.remove('hidden');
    return;
  }

  emptyEl.classList.add('hidden');

  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className =
      'relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 ring-1 ring-white/10 backdrop-blur-md p-5 shadow-lg transition-all duration-200 hover:bg-white/20 hover:border-white/30';
    if (item.completed === false) {
      card.classList.add('opacity-90');
    }

    const glow = document.createElement('div');
    glow.className =
      'pointer-events-none absolute -inset-px opacity-40 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20';
    card.appendChild(glow);

    const body = document.createElement('div');
    body.className = 'relative';

    const top = document.createElement('div');
    top.className = 'flex items-center justify-between gap-3';

    const left = document.createElement('div');
    left.className = 'flex items-center gap-3 min-w-0';

    const indexBadge = document.createElement('div');
    indexBadge.className =
      'w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold flex items-center justify-center flex-shrink-0';
    indexBadge.textContent = String(index + 1);
    left.appendChild(indexBadge);

    const diff = document.createElement('div');
    diff.className = 'min-w-0';

    const diffLabel = document.createElement('div');
    diffLabel.className = 'text-xs text-white/60';
    diffLabel.textContent = getDifficultyLabel(item.difficulty);
    diff.appendChild(diffLabel);

    const status = document.createElement('div');
    status.className = 'text-xs text-white/70';
    status.textContent = item.completed === false ? '未完成' : '已完成';
    diff.appendChild(status);

    left.appendChild(diff);
    top.appendChild(left);

    const tags = document.createElement('div');
    tags.className = 'flex items-center gap-2 flex-shrink-0';

    const diffTag = document.createElement('span');
    diffTag.className = 'px-2.5 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/20';
    diffTag.textContent = getDifficultyLabel(item.difficulty);
    tags.appendChild(diffTag);

    const statusTag = document.createElement('span');
    statusTag.className =
      item.completed === false
        ? 'px-2.5 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-200 border border-yellow-200/20'
        : 'px-2.5 py-1 rounded-full text-xs bg-secondary/20 text-white border border-white/10';
    statusTag.textContent = item.completed === false ? '未完成' : '完成';
    tags.appendChild(statusTag);

    top.appendChild(tags);
    body.appendChild(top);

    const grid = document.createElement('div');
    grid.className = 'mt-4 grid grid-cols-1 md:grid-cols-2 gap-4';

    const enBlock = document.createElement('div');
    enBlock.className = 'min-w-0';

    const enLabel = document.createElement('div');
    enLabel.className = 'text-xs tracking-widest text-white/50';
    enLabel.textContent = 'EN';
    enBlock.appendChild(enLabel);

    const enText = document.createElement('div');
    enText.className = 'mt-2 text-white text-base md:text-lg font-semibold leading-snug break-words';
    enText.textContent = item.en;
    enBlock.appendChild(enText);

    const zhBlock = document.createElement('div');
    zhBlock.className = 'min-w-0';

    const zhLabel = document.createElement('div');
    zhLabel.className = 'text-xs tracking-widest text-white/50';
    zhLabel.textContent = '中文';
    zhBlock.appendChild(zhLabel);

    const zhText = document.createElement('div');
    zhText.className = 'mt-2 text-white/80 text-sm md:text-base leading-snug break-words';
    zhText.textContent = item.zh ? item.zh : '（暂无译文）';
    zhBlock.appendChild(zhText);

    grid.appendChild(enBlock);
    grid.appendChild(zhBlock);
    body.appendChild(grid);

    card.appendChild(body);
    fragment.appendChild(card);
  });

  listEl.appendChild(fragment);
}

function openSessionReviewScreen() {
  const modal = document.getElementById('session-review-modal');
  const panel = document.getElementById('session-review-panel');
  if (!modal || !panel) return;

  renderSessionReviewScreen();

  if (sessionReviewBodyOverflow === null) {
    sessionReviewBodyOverflow = document.body.style.overflow || '';
  }
  document.body.style.overflow = 'hidden';

  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    panel.classList.remove('opacity-0', 'translate-y-2', 'scale-[0.99]');
    panel.classList.add('opacity-100', 'translate-y-0', 'scale-100');
  });

  const closeBtn = document.getElementById('session-review-close');
  if (closeBtn) closeBtn.focus();
}

function closeSessionReviewScreen({ immediate = false } = {}) {
  const modal = document.getElementById('session-review-modal');
  const panel = document.getElementById('session-review-panel');
  if (!modal || !panel) return;

  const resetBodyOverflow = () => {
    if (sessionReviewBodyOverflow === null) return;
    document.body.style.overflow = sessionReviewBodyOverflow;
    sessionReviewBodyOverflow = null;
  };

  if (immediate) {
    modal.classList.add('hidden');
    panel.classList.add('opacity-0', 'translate-y-2', 'scale-[0.99]');
    panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    resetBodyOverflow();
    return;
  }

  panel.classList.add('opacity-0', 'translate-y-2', 'scale-[0.99]');
  panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');

  setTimeout(() => {
    modal.classList.add('hidden');
    resetBodyOverflow();
  }, 260);
}

// 完成句子
function completeSentence() {
  const wordsInSentence = gameState.currentSentence.trim().split(/\s+/).length;
  gameState.wordsCompleted += wordsInSentence;

  // 播放完成音效
  userManager.playSound('complete');

  recordSentenceForReview({ completed: true });

  // 短暂延迟后选择新句子
  setTimeout(() => {
    selectRandomSentence();
    typingInput.value = '';
    gameState.typedSentence = '';
    updateSentenceDisplay();
  }, gameConfig.sentenceCompleteDelayMs);
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

  if (gameState.typedSentence && gameState.currentSentence) {
    recordSentenceForReview({ completed: gameState.typedSentence === gameState.currentSentence });
  }

  // 更新UI
  startBtn.innerHTML = '<i class="fa fa-play mr-2"></i> 开始游戏';
  pauseBtn.classList.add('hidden');
  typingInput.disabled = true;

  // 显示游戏结束模态框
  showGameOverModal();

  // 保存游戏结果
  void saveGameResults();

  // 播放游戏结束音效
  userManager.playSound('gameOver');
}

// 显示游戏结束模态框
function showGameOverModal() {
  // 更新最终成绩
  finalScoreElement.textContent = gameState.score;
  finalWpmElement.textContent = `${gameState.wpm} WPM`;
  finalAccuracyElement.textContent = `${gameState.accuracy}%`;
  finalWordsElement.textContent = gameState.wordsCompleted;
  updateSessionReviewButton();

  gameOverModal.classList.remove('hidden');
  setTimeout(() => {
    modalContent.style.opacity = '1';
    modalContent.style.transform = 'scale(1)';
  }, 10);
}

// 隐藏游戏结束模态框
function hideGameOverModal() {
  closeSessionReviewScreen({ immediate: true });

  modalContent.style.opacity = '0';
  modalContent.style.transform = 'scale(0.95)';

  setTimeout(() => {
    gameOverModal.classList.add('hidden');
  }, 300);
}

// 保存游戏结果
async function saveGameResults() {
  if (!currentUser) return;

  const durationSeconds = gameConfig.defaultDurationSeconds - gameState.timeLeft;
  const gameData = {
    difficulty: gameState.currentDifficulty,
    durationSeconds,
    score: gameState.score,
    wpm: gameState.wpm,
    accuracy: gameState.accuracy,
    wordsCompleted: gameState.wordsCompleted,
    errors: gameState.errors,
    totalChars: gameState.totalChars,
    correctChars: gameState.correctChars
  };

  const result = await userManager.saveGameRecord(currentUser.id, gameData);
  if (!result || !result.success) return;

  // 显示新解锁的成就
  if (result.user) {
    currentUser = result.user;
    updateUIForLoggedInUser(currentUser);
  }

  const newAchievements = result.newAchievements || [];
  if (newAchievements.length > 0) {
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
  }, gameConfig.achievementToastDurationMs);
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
  gameState.currentSentenceZh = '';
  gameState.sessionSentences = [];
  gameState.typedSentence = '';
  gameState.startTime = null;
  gameState.pausedAt = null;
  gameState.pausedDurationMs = 0;
  gameState.timeLeft = gameConfig.defaultDurationSeconds;
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
  timerElement.textContent = `${gameConfig.defaultDurationSeconds}sec`;
  scoreElement.textContent = '0';
  wpmElement.textContent = '0 WPM';
  accuracyElement.textContent = '0%';
  wordsCompletedElement.textContent = '0';
  errorsElement.textContent = '0';
  typingInput.value = '';
  sentenceElement.textContent = '准备好了吗?点击开始按钮,然后输入显示的英文句子.';
}
