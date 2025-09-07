// 免责声明处理
function acceptDisclaimer() {
    localStorage.setItem('disclaimerAccepted', 'true');
    document.querySelector('.disclaimer').style.display = 'none';
}

// 页面加载时检查免责声明状态
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('disclaimerAccepted') === 'true') {
        const disclaimer = document.querySelector('.disclaimer');
        if (disclaimer) {
            disclaimer.style.display = 'none';
        }
    }
    
    // 添加页面加载动画
    const cards = document.querySelectorAll('.website-card, .resource-card, .tutorial-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 添加滚动效果
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.decoration');
    
    parallax.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// 下载按钮点击统计
document.querySelectorAll('.download-btn, .start-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // 可以在这里添加下载统计
        console.log('Download/Start clicked:', this.textContent);
        
        // 添加点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// 响应式菜单处理
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// 搜索功能（可扩展）
function searchResources(query) {
    const cards = document.querySelectorAll('.website-card, .resource-card, .tutorial-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = query ? 'none' : 'block';
        }
    });
}

// 添加搜索框（可选）
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里动态添加搜索框
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="搜索资源..." class="search-input">
    `;
    
    // 将搜索框添加到合适的页面
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        if (container.querySelector('.website-grid, .resource-grid, .tutorial-grid')) {
            container.insertBefore(searchContainer, container.firstChild);
        }
    });
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchResources(this.value);
        });
    }
});

/* ------ 本站资源搜索 ------ */
const searchBox = document.getElementById('siteSearch');
if (searchBox) {
  searchBox.addEventListener('input', e => {
    const kw = e.target.value.trim().toLowerCase();
    // 遍历所有卡片
    document.querySelectorAll('.website-card, .resource-card, .tutorial-card').forEach(card => {
      const txt = (card.textContent || '').toLowerCase();
      card.style.display = kw === '' || txt.includes(kw) ? 'block' : 'none';
    });
  });
}

/* ===== 投稿提交脚本 ===== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('submitForm');
  if (!form) return; // 只在 submit.html 生效
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const msg = document.getElementById('msg');
    if (res.ok) {
      msg.textContent = '投稿成功，正在审核…';
      form.reset();
    } else {
      msg.textContent = '投稿失败，请重试';
    }
  });
});

/* ===== 全局实时搜索 ===== */
(function () {
  const box = document.getElementById('siteSearch');
  if (!box) return; // 当前页无搜索框就跳过
  box.addEventListener('input', e => {
    const kw = e.target.value.trim().toLowerCase();
    // 统一类名：所有卡片都用 .searchable
    document.querySelectorAll('.searchable').forEach(card => {
      const txt = (card.textContent || '').toLowerCase();
      card.style.display = kw === '' || txt.includes(kw) ? 'block' : 'none';
    });
  });
})();

<script>
/* 实时搜索：只要有 searchable 类的卡片都会被扫描 */
(function(){
  const input = document.getElementById('siteSearch');
  if (!input) return;               // 没搜索框就跳过
  input.addEventListener('input', () => {
    const kw = input.value.trim().toLowerCase();
    document.querySelectorAll('.searchable').forEach(card => {
      const txt = card.textContent.toLowerCase();
      card.style.display = txt.includes(kw) ? '' : 'none';
    });
  });
})();
</script>
