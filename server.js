const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// 压缩中间件
app.use(compression());

// 日志中间件
app.use(morgan('combined'));

// CORS中间件
app.use(cors());

// 解析JSON和URL编码
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'max-age=31536000');
        }
        if (path.endsWith('.js')) {
            res.setHeader('Cache-Control', 'max-age=31536000');
        }
    }
}));

// API路由
app.get('/api/resources', (req, res) => {
    const resources = [
        { id: 1, name: '软件合集1', category: 'software', downloads: 1200 },
        { id: 2, name: 'GTA游戏合集', category: 'game', downloads: 3500 },
        { id: 3, name: '编程工具', category: 'tool', downloads: 800 },
        { id: 4, name: '壁纸资源', category: 'media', downloads: 2100 },
    ];
    res.json(resources);
});

app.get('/api/websites', (req, res) => {
    const websites = [
        { id: 1, name: '咖喱君资源库', url: 'http://galiji.ysepan.com/', category: 'resource' },
        { id: 2, name: 'GitHub', url: 'https://github.com', category: 'development' },
        { id: 3, name: '哔哩哔哩', url: 'https://www.bilibili.com', category: 'learning' },
    ];
    res.json(websites);
});

// 统计API
app.post('/api/stats/download', (req, res) => {
    const { resourceId } = req.body;
    console.log(`Resource ${resourceId} downloaded`);
    res.json({ success: true });
});

// 处理所有HTML页面的路由
app.get(['/', '/p1', '/p2', '/p3', '/p4', '/p5'], (req, res) => {
    let page = req.path === '/' ? 'index' : req.path.substring(1);
    res.sendFile(path.join(__dirname, `${page}.html`));
});

// 404处理
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - 页面未找到</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #6a11cb; }
                a { color: #2575fc; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>🤔 页面未找到</h1>
            <p>您访问的页面不存在</p>
            <p><a href="/">返回首页</a></p>
        </body>
        </html>
    `);
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器内部错误');
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    console.log(`🌍 Network: http://0.0.0.0:${PORT}`);
});

module.exports = app;

const fs = require('fs');
const path = require('path');

// 投稿 API
app.post('/api/submit', express.json(), (req, res) => {
  const { title, url, code = '', desc } = req.body;
  if (!title || !url || !desc) return res.status(400).send('字段不完整');

  const file = path.join(__dirname, 'submissions.json');
  let list = [];
  if (fs.existsSync(file)) list = JSON.parse(fs.readFileSync(file, 'utf8'));
  list.push({ title, url, code, desc, date: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(list, null, 2));

  res.json({ success: true });
});
