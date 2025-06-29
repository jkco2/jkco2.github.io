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
  
  // 初始化视图模式
  function initializeMode(mode) {
    // 更新按钮状态
    toggleButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      }
    });
    
    // 更新容器类名和显示状态
    if (mode === 'grid') {
      archiveContainer.className = 'post-block archive-grid-mode';
      postsCollapse.style.display = 'none';
      postsGrid.style.display = 'grid';
    } else {
      archiveContainer.className = 'post-block archive-list-mode';
      postsCollapse.style.display = 'block';
      postsGrid.style.display = 'none';
    }
  }
  
  // 切换视图模式
  function toggleMode(mode) {
    initializeMode(mode);
    localStorage.setItem('nextheme-archive-mode', mode);
    
    // 添加切换动画效果
    archiveContainer.style.opacity = '0.6';
    setTimeout(() => {
      archiveContainer.style.opacity = '1';
    }, 150);
    
    // 触发自定义事件
    const event = new CustomEvent('archiveModeChanged', {
      detail: { mode: mode }
    });
    document.dispatchEvent(event);
  }
  
  // 绑定按钮点击事件
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const mode = this.dataset.mode;
      if (!this.classList.contains('active')) {
        toggleMode(mode);
      }
    });
  });
  
  // 添加键盘快捷键支持
  document.addEventListener('keydown', function(e) {
    // 只在归档页面生效
    if (!archiveContainer) return;
    
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
    const isSmallScreen = window.innerWidth < 768;
    const currentMode = localStorage.getItem('nextheme-archive-mode') || 'list';
    
    if (isSmallScreen && currentMode === 'grid') {
      // 在小屏幕上临时切换到列表视图，但不保存到localStorage
      archiveContainer.className = 'post-block archive-list-mode';
      postsCollapse.style.display = 'block';
      postsGrid.style.display = 'none';
    } else {
      // 恢复保存的模式
      initializeMode(currentMode);
    }
  }
  
  // 监听窗口大小变化
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResponsive, 250);
  });
  
  // 初始化
  initializeMode(savedMode);
  handleResponsive();
  
  // 添加提示信息
  if (window.console && window.console.info) {
    console.info('Archive view shortcuts: Alt+L (List), Alt+G (Grid)');
  }
}); 