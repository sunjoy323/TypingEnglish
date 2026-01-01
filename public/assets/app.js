// 初始化应用（按模块拆分后的入口）

function initializeApp() {
  // 检查登录状态
  checkAuthStatus();

  // 初始化事件监听器
  initializeGameEventListeners();
  initializeNavigationEventListeners();
  initializeModalEventListeners();
  initializeUIEventListeners();
}

// 启动应用
document.addEventListener('DOMContentLoaded', initializeApp);

