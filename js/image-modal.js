/**
 * 全局图片模态窗口功能
 * 为所有带有 gallery-img 类的图片添加点击放大功能
 */

// 处理归档页面的图片封面显示
document.addEventListener('DOMContentLoaded', function() {
  // 处理矩阵视图的图片封面
  function handleImageCovers() {
    const gridItems = document.querySelectorAll('.post-grid-item');
    
    gridItems.forEach(item => {
      const contentRaw = item.querySelector('.post-content-raw');
      const defaultCover = item.querySelector('.post-default-cover');
      
      if (contentRaw && defaultCover) {
        // 检查是否有画廊图片
        const galleryImg = contentRaw.querySelector('.image-gallery .gallery-row:first-child .gallery-img:first-child');
        // 检查是否有任何img标签（包括段落中的）
        const anyImg = contentRaw.querySelector('img:not(.gallery-img)');
        // 检查段落中的图片
        const pImg = contentRaw.querySelector('p img');
        
        // 如果找到任何图片，强制隐藏默认封面
        if (galleryImg || pImg || anyImg) {
          // 强制隐藏默认封面
          defaultCover.style.display = 'none';
          defaultCover.style.visibility = 'hidden';
          defaultCover.style.opacity = '0';
          defaultCover.style.zIndex = '-1';
          
          // 确保图片正确显示，画廊图片优先，然后是段落中的图片
          const targetImg = galleryImg || pImg || anyImg;
          if (targetImg) {
            // 强制显示图片
            targetImg.style.display = 'block';
            targetImg.style.visibility = 'visible';
            targetImg.style.opacity = '1';
            targetImg.style.position = 'absolute';
            targetImg.style.top = '0';
            targetImg.style.left = '0';
            targetImg.style.width = '100%';
            targetImg.style.height = '100%';
            targetImg.style.objectFit = 'cover';
            targetImg.style.zIndex = galleryImg ? '5' : '4';
            
            // 如果是画廊图片，确保其父容器也正确显示
            if (galleryImg && targetImg === galleryImg) {
              const gallery = targetImg.closest('.image-gallery');
              const galleryRow = targetImg.closest('.gallery-row');
              
              if (gallery) {
                gallery.style.display = 'block';
                gallery.style.position = 'absolute';
                gallery.style.top = '0';
                gallery.style.left = '0';
                gallery.style.width = '100%';
                gallery.style.height = '100%';
                gallery.style.zIndex = '5';
              }
              
              if (galleryRow) {
                galleryRow.style.display = 'block';
                galleryRow.style.position = 'absolute';
                galleryRow.style.top = '0';
                galleryRow.style.left = '0';
                galleryRow.style.width = '100%';
                galleryRow.style.height = '100%';
              }
              
              // 隐藏同一行的其他图片
              const siblingImgs = galleryRow.querySelectorAll('.gallery-img:not(:first-child)');
              siblingImgs.forEach(img => {
                img.style.display = 'none';
              });
              
              // 隐藏其他行
              const otherRows = gallery.querySelectorAll('.gallery-row:not(:first-child)');
              otherRows.forEach(row => {
                row.style.display = 'none';
              });
            }
            
            // 如果是段落中的图片，确保段落正确显示
            if (pImg && targetImg === pImg) {
              const paragraph = targetImg.closest('p');
              if (paragraph) {
                paragraph.style.display = 'block';
                paragraph.style.position = 'absolute';
                paragraph.style.top = '0';
                paragraph.style.left = '0';
                paragraph.style.width = '100%';
                paragraph.style.height = '100%';
                paragraph.style.margin = '0';
                paragraph.style.padding = '0';
                paragraph.style.overflow = 'hidden';
                paragraph.style.color = 'transparent';
                paragraph.style.fontSize = '0';
                paragraph.style.lineHeight = '0';
              }
            }
          }
          
          // 隐藏内容中的其他元素
          const allChildren = contentRaw.children;
          for (let child of allChildren) {
            if (!child.classList.contains('image-gallery') && child.tagName !== 'IMG') {
              child.style.display = 'none';
            }
          }
        }
      }
    });
  }
  
  // 立即执行
  handleImageCovers();
  
  // 在视图切换时重新执行
  document.addEventListener('archiveViewChanged', function() {
    setTimeout(handleImageCovers, 100);
  });
});

// 图片模态框功能
function createImageModal() {
  // 创建模态框HTML
  const modalHTML = `
    <div id="image-modal" class="image-modal" style="display: none;">
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <span class="modal-close">&times;</span>
        <img class="modal-image" src="" alt="">
        <div class="modal-nav">
          <button class="modal-prev">&#8249;</button>
          <button class="modal-next">&#8250;</button>
        </div>
        <div class="modal-counter"></div>
      </div>
    </div>
  `;
  
  // 添加到页面
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .image-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      cursor: pointer;
    }
    
    .modal-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .modal-image {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .modal-close {
      position: absolute;
      top: -40px;
      right: 0;
      font-size: 30px;
      color: white;
      cursor: pointer;
      background: none;
      border: none;
      padding: 5px;
      line-height: 1;
    }
    
    .modal-nav button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 30px;
      color: white;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
      transition: background 0.3s;
    }
    
    .modal-nav button:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    
    .modal-prev {
      left: -60px;
    }
    
    .modal-next {
      right: -60px;
    }
    
    .modal-counter {
      margin-top: 10px;
      color: white;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .modal-nav button {
        position: fixed;
        top: 50%;
        font-size: 24px;
        padding: 8px 12px;
      }
      
      .modal-prev {
        left: 20px;
      }
      
      .modal-next {
        right: 20px;
      }
      
      .modal-close {
        top: 20px;
        right: 20px;
        position: fixed;
      }
    }
  `;
  document.head.appendChild(style);
}

// 初始化图片模态框
document.addEventListener('DOMContentLoaded', function() {
  createImageModal();
  
  let currentImages = [];
  let currentIndex = 0;
  
  const modal = document.getElementById('image-modal');
  const modalImg = modal.querySelector('.modal-image');
  const closeBtn = modal.querySelector('.modal-close');
  const prevBtn = modal.querySelector('.modal-prev');
  const nextBtn = modal.querySelector('.modal-next');
  const counter = modal.querySelector('.modal-counter');
  const backdrop = modal.querySelector('.modal-backdrop');
  
  function showModal(images, index) {
    currentImages = images;
    currentIndex = index;
    updateModalImage();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  function updateModalImage() {
    if (currentImages.length > 0) {
      modalImg.src = currentImages[currentIndex];
      counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      
      prevBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
      nextBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
    }
  }
  
  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateModalImage();
  }
  
  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateModalImage();
  }
  
  // 事件监听
  closeBtn.addEventListener('click', hideModal);
  backdrop.addEventListener('click', hideModal);
  nextBtn.addEventListener('click', nextImage);
  prevBtn.addEventListener('click', prevImage);
  
  // 键盘事件
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'flex') {
      switch(e.key) {
        case 'Escape':
          hideModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    }
  });
  
  // 为图片添加点击事件
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG' && !e.target.closest('.modal-content')) {
      // 收集当前文章的所有图片
      const article = e.target.closest('article') || e.target.closest('.post-content');
      if (article) {
        const images = Array.from(article.querySelectorAll('img')).map(img => img.src);
        const clickedIndex = images.indexOf(e.target.src);
        if (clickedIndex !== -1) {
          showModal(images, clickedIndex);
        }
      }
    }
  });
}); 