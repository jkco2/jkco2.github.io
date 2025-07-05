/**
 * 全局图片模态窗口功能
 * 为所有带有 gallery-img 类的图片添加点击放大功能
 */

document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已经创建过模态窗口
  if (document.getElementById('imageModal')) {
    return;
  }
  
  // 创建模态窗口元素并添加到body
  var modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <img id="modalImage" class="modal-image">
      <div class="modal-caption">
        <p id="modalCaption"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // 获取模态窗口元素
  var modalImg = document.getElementById('modalImage');
  var modalCaption = document.getElementById('modalCaption');
  var closeBtn = modal.querySelector('.close');
  
  // 初始化图片点击事件
  function initImageClickEvents() {
    var images = document.querySelectorAll('.gallery-img');
    
    images.forEach(function(img) {
      // 避免重复绑定事件
      if (!img.hasAttribute('data-modal-bound')) {
        img.setAttribute('data-modal-bound', 'true');
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', function() {
          // 显示模态窗口
          modal.style.display = 'block';
          modalImg.src = this.src;
          modalCaption.textContent = this.alt || '图片';
          
          // 禁止背景滚动
          document.body.style.overflow = 'hidden';
        });
      }
    });
  }
  
  // 关闭模态窗口的函数
  function closeModal() {
    modal.style.display = 'none';
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
  }
  
  // 点击关闭按钮
  closeBtn.addEventListener('click', closeModal);
  
  // 点击模态窗口外部关闭
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // 按ESC键关闭
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
  
  // 初始化当前页面的图片
  initImageClickEvents();
  
  // 监听DOM变化，为动态添加的图片绑定事件（适用于PJAX等异步加载）
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 延迟执行，确保DOM完全加载
        setTimeout(initImageClickEvents, 100);
      }
    });
  });
  
  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 兼容PJAX
  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('pjax:complete', initImageClickEvents);
    window.addEventListener('pjax:success', initImageClickEvents);
  }
}); 