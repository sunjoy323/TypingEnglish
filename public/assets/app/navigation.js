// 页面导航与快捷键

// 初始化导航事件监听器
function initializeNavigationEventListeners() {
  // 桌面端导航
  document.getElementById('home-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('home-page');
  });

  document.getElementById('practice-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('practice-page');
    loadPracticePage();
  });

  document.getElementById('achievements-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('achievements-page');
    loadAchievementsPage();
  });

  document.getElementById('leaderboard-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('leaderboard-page');
    loadLeaderboardPage();
  });

  document.getElementById('settings-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('settings-page');
    loadSettingsPage();
  });

  // 移动端导航
  document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);

  document.querySelector('.home-mobile-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('home-page');
    hideMobileMenu();
  });

  document.querySelector('.practice-mobile-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('practice-page');
    loadPracticePage();
    hideMobileMenu();
  });

  document.querySelector('.achievements-mobile-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('achievements-page');
    loadAchievementsPage();
    hideMobileMenu();
  });

  document.querySelector('.leaderboard-mobile-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('leaderboard-page');
    loadLeaderboardPage();
    hideMobileMenu();
  });

  document.querySelector('.settings-mobile-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('settings-page');
    loadSettingsPage();
    hideMobileMenu();
  });

  // 移动端登录按钮
  document.querySelector('#mobile-login-section button').addEventListener('click', function () {
    showAuthModal();
    hideMobileMenu();
  });

  // 移动端退出按钮
  document.getElementById('mobile-logout-btn').addEventListener('click', function () {
    logout();
    hideMobileMenu();
  });

  // 页脚快速链接导航
  document.getElementById('footer-home-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('home-page');
  });
  document.getElementById('footer-practice-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('practice-page');
    loadPracticePage();
  });
  document.getElementById('footer-achievements-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('achievements-page');
    loadAchievementsPage();
  });
  document.getElementById('footer-leaderboard-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('leaderboard-page');
    loadLeaderboardPage();
  });
  document.getElementById('footer-settings-link').addEventListener('click', function (e) {
    e.preventDefault();
    showPage('settings-page');
    loadSettingsPage();
  });
}

// 初始化UI事件监听器
function initializeUIEventListeners() {
  // 添加键盘快捷键
  document.addEventListener('keydown', function (e) {
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

