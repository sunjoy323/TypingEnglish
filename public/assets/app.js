// 初始化应用（按模块拆分后的入口）

async function initializeApp() {
  await userManager.init();

  // 检查登录状态
  await checkAuthStatus();

  // 初始化事件监听器
  initializeGameEventListeners();
  initializeNavigationEventListeners();
  initializeModalEventListeners();
  initializeUIEventListeners();
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  void initializeApp();
});
