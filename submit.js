document.getElementById('submitForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  const msg = document.getElementById('msg');
  if(res.ok) { msg.textContent = '投稿成功，正在审核…'; e.target.reset(); }
  else       { msg.textContent = '投稿失败，请重试'; }
});
