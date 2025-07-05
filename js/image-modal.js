// 全局图片模态窗口功能
document.addEventListener('DOMContentLoaded', function() {
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
  function initializeImageModal() {
    // 获取所有可点击的图片（包括gallery-img和post-body中的图片）
    var images = document.querySelectorAll('.gallery-img, .post-body img, .post-content img, article img');
    
    // 为每个图片添加点击事件
    images.forEach(function(img) {
      // 避免重复添加事件监听器
      if (!img.hasAttribute('data-modal-initialized')) {
        img.setAttribute('data-modal-initialized', 'true');
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 显示模态窗口
          modal.style.display = 'block';
          modalImg.src = this.src;
          modalCaption.textContent = this.alt || this.title || '图片';
          
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
  modal.addEventListener('click', function(event) {
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
  
  // 初始化
  initializeImageModal();
  
  // 监听DOM变化，处理动态加载的图片
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 检查是否有新的图片被添加
        var hasNewImages = false;
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // 元素节点
            if (node.tagName === 'IMG' || node.querySelector('img')) {
              hasNewImages = true;
            }
          }
        });
        
        if (hasNewImages) {
          // 重新初始化图片模态窗口
          setTimeout(initializeImageModal, 100);
        }
      }
    });
  });
  
  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}); 