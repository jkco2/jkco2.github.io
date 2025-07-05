/* global NexT */

document.addEventListener('DOMContentLoaded', function() {
  const archiveContainer = document.getElementById('archive-container');
  const toggleButtons = document.querySelectorAll('.view-toggle-btn');
  const postsCollapse = document.querySelector('.posts-collapse');
  const postsGrid = document.querySelector('.posts-grid');
  
  if (!archiveContainer || !toggleButtons.length || !postsCollapse || !postsGrid) {
    return;
  }
  
  // 从localStorage读取用户偏好设置
  const savedMode = localStorage.getItem('nextheme-archive-mode') || 'list';
  let isAnimating = false;
  
  // 显示指定的视图
  function showView(mode) {
    if (mode === 'grid') {
      postsCollapse.style.display = 'none';
      postsGrid.style.display = 'grid';
      archiveContainer.className = 'post-block archive-grid-mode';
    } else {
      postsCollapse.style.display = 'block';
      postsGrid.style.display = 'none';
      archiveContainer.className = 'post-block archive-list-mode';
    }
  }
  
  // 初始化视图模式
  function initializeMode(mode, skipAnimation = false) {
    if (isAnimating && !skipAnimation) return;
    
    // 更新按钮状态
    toggleButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      }
    });
    
    // 显示对应的视图
    showView(mode);
  }
  
  // 切换视图模式
  function toggleMode(mode) {
    if (isAnimating) return;
    
    const currentMode = archiveContainer.classList.contains('archive-grid-mode') ? 'grid' : 'list';
    if (currentMode === mode) return;
    
    isAnimating = true;
    
    // 添加切换动画状态
    archiveContainer.classList.add('archive-switching');
    
    // 开始切换动画
    setTimeout(() => {
      // 更新显示状态
      showView(mode);
      
      // 更新按钮状态
      toggleButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
          btn.classList.add('active');
        }
      });
      
      // 移除切换动画状态
      archiveContainer.classList.remove('archive-switching');
      
      // 保存设置
      localStorage.setItem('nextheme-archive-mode', mode);
      
      // 动画完成后允许下次切换
      setTimeout(() => {
        isAnimating = false;
      }, 600);
      
      // 触发自定义事件
      const event = new CustomEvent('archiveModeChanged', {
        detail: { mode: mode }
      });
      document.dispatchEvent(event);
      
    }, 200);
  }
  
  // 绑定按钮点击事件
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const mode = this.dataset.mode;
      if (!this.classList.contains('active') && !isAnimating) {
        toggleMode(mode);
      }
    });
  });
  
  // 添加键盘快捷键支持
  document.addEventListener('keydown', function(e) {
    // 只在归档页面生效
    if (!archiveContainer || isAnimating) return;
    
    // Alt + L 切换到列表视图
    if (e.altKey && e.key === 'l') {
      e.preventDefault();
      toggleMode('list');
    }
    
    // Alt + G 切换到矩阵视图
    if (e.altKey && e.key === 'g') {
      e.preventDefault();
      toggleMode('grid');
    }
  });
  
  // 响应式处理 - 在小屏幕上自动切换到列表视图
  function handleResponsive() {
    if (isAnimating) return;
    
    const isSmallScreen = window.innerWidth < 768;
    const currentMode = localStorage.getItem('nextheme-archive-mode') || 'list';
    const actualMode = archiveContainer.classList.contains('archive-grid-mode') ? 'grid' : 'list';
    
    if (isSmallScreen && actualMode === 'grid') {
      // 在小屏幕上临时切换到列表视图，但不保存到localStorage
      initializeMode('list', true);
    } else if (!isSmallScreen && actualMode !== currentMode) {
      // 恢复保存的模式
      initializeMode(currentMode, true);
    }
  }
  
  // 优化的窗口大小监听
  let resizeTimer;
  let ticking = false;
  
  function requestResize() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleResponsive();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(requestResize, 150);
  });
  
  // 页面可见性变化时优化动画
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // 页面隐藏时禁用动画
      document.body.style.setProperty('--animation-duration', '0s');
    } else {
      // 页面显示时恢复动画
      document.body.style.removeProperty('--animation-duration');
    }
  });
  
  // 初始化
  initializeMode(savedMode, true);
  
  // 延迟执行响应式检查，避免初始化时的闪烁
  setTimeout(() => {
    handleResponsive();
  }, 100);
  
  // 添加提示信息
  if (window.console && window.console.info) {
    console.info('Archive view shortcuts: Alt+L (List), Alt+G (Grid)');
  }
}); 