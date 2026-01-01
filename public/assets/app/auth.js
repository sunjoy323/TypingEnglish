// 认证与用户状态

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
  document.getElementById('login-tab').addEventListener('click', function () {
    showLoginForm();
  });

  document.getElementById('register-tab').addEventListener('click', function () {
    showRegisterForm();
  });

  // 表单提交
  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    handleLogin();
  });

  document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    handleRegister();
  });

  // 点击模态框外部关闭
  document.getElementById('auth-modal').addEventListener('click', function (e) {
    if (e.target === this) {
      hideAuthModal();
    }
  });

  document.getElementById('game-over-modal').addEventListener('click', function (e) {
    if (e.target === this) {
      hideGameOverModal();
    }
  });
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

