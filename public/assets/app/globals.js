// 全局依赖与共享状态（被其他模块复用）

const gameConfig =
  globalThis.TypingEnglishGameConfig ||
  Object.freeze({
    defaultDifficulty: 'medium',
    defaultDurationSeconds: 120,
    timerTickMs: 1000,
    sentenceCompleteDelayMs: 500,
    wpmCharsPerWord: 5,
    achievementToastDurationMs: 5000,
    scoreDifficultyMultipliers: {
      easy: 1,
      medium: 1.5,
      hard: 2,
      expert: 3
    }
  });

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
  timeLeft: gameConfig.defaultDurationSeconds,
  score: 0,
  wpm: 0,
  accuracy: 0,
  wordsCompleted: 0,
  errors: 0,
  currentDifficulty: gameConfig.defaultDifficulty,
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

