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
}

// 开始游戏
async function startGame() {
  const unlockPromise = userManager.soundManager.unlock();

  if (!currentUser) {
    showAuthModal();
    return;
  }

  hideSentenceTranslationToast();

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

let translationToastTimer = null;
let translationToastCleanupTimer = null;

function hideSentenceTranslationToast() {
  const toast = document.getElementById('sentence-translation-toast');
  if (!toast) return;

  toast.classList.add('hidden', 'opacity-0', 'translate-y-2');
  toast.classList.remove('opacity-100', 'translate-y-0');
}

function showSentenceTranslationToast(translation) {
  if (!translation || gameState.currentDifficulty === 'easy') return;

  const toast = document.getElementById('sentence-translation-toast');
  const textEl = document.getElementById('sentence-translation-text');
  if (!toast || !textEl) return;

  textEl.textContent = `上一句释义：${translation}`;

  if (translationToastTimer) clearTimeout(translationToastTimer);
  if (translationToastCleanupTimer) clearTimeout(translationToastCleanupTimer);

  toast.classList.remove('hidden');
  // 下一帧触发过渡动画
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  translationToastTimer = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2');

    translationToastCleanupTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 320);
  }, gameConfig.translationToastDurationMs || 2500);
}

// 完成句子
function completeSentence() {
  const wordsInSentence = gameState.currentSentence.trim().split(/\s+/).length;
  gameState.wordsCompleted += wordsInSentence;

  // 播放完成音效
  userManager.playSound('complete');

  // 展示中文释义（不会阻止继续打字）
  if (gameState.currentSentenceZh) {
    showSentenceTranslationToast(gameState.currentSentenceZh);
  }

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

  gameOverModal.classList.remove('hidden');
  setTimeout(() => {
    modalContent.style.opacity = '1';
    modalContent.style.transform = 'scale(1)';
  }, 10);
}

// 隐藏游戏结束模态框
function hideGameOverModal() {
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
