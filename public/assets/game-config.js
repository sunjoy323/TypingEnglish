// TypingEnglish - 游戏可调参数配置
// 默认情况下不绑定任何域名；部署到任意平台时均可直接使用。
// 如需在不改源码的情况下覆盖配置，可在加载本文件之前先设置 `globalThis.TypingEnglishGameConfig`。

(() => {
  const defaults = {
    defaultDifficulty: 'medium',
    defaultDurationSeconds: 120,
    timerTickMs: 1000,
    sentenceCompleteDelayMs: 500,
    wpmCharsPerWord: 5,
    achievementToastDurationMs: 5000,
    translationToastDurationMs: 2500,
    scoreDifficultyMultipliers: {
      easy: 1,
      medium: 1.5,
      hard: 2,
      expert: 3
    }
  };

  if (!globalThis.TypingEnglishGameConfig) {
    globalThis.TypingEnglishGameConfig = defaults;
    return;
  }

  globalThis.TypingEnglishGameConfig = {
    ...defaults,
    ...globalThis.TypingEnglishGameConfig,
    scoreDifficultyMultipliers: {
      ...defaults.scoreDifficultyMultipliers,
      ...(globalThis.TypingEnglishGameConfig.scoreDifficultyMultipliers || {})
    }
  };
})();
