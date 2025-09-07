<script>
/* ===== 审核页拉取投稿 ===== */
fetch('/api/submissions')
  .then(r => r.json())
  .then(data => {
    const box = document.getElementById('list');
    if (!data.length) {
      box.innerHTML = '<p style="text-align:center;color:#fff8;">暂无投稿</p>';
      return;
    }
    data.forEach((item, idx) => {
      box.insertAdjacentHTML('beforeend', `
        <div class="resource-card">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <p>链接：<a href="${item.url}" target="_blank" rel="noopener">${item.url}</a></p>
          ${item.code ? `<p>提取码：<strong>${item.code}</strong></p>` : ''}
          <p><small>投稿时间：${new Date(item.date).toLocaleString()}</small></p>
        </div>
      `);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById('list').innerHTML = '<p style="text-align:center;color:#fffa70;">加载失败，请刷新页面</p>';
  });
</script>