#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(fileURLToPath(import.meta.url), '..', '..');
const publicDir = join(rootDir, 'public');
const port = Number(process.env.PORT ?? 3000);

const now = new Date().toISOString();
const state = {
  users: [
    { id: '1', nickname: '测试用户', avatar: '', phone: '13800138000', phoneVerified: true, status: 1, createdAt: now },
  ],
  posts: [
    {
      id: '1',
      userId: '1',
      content: '欢迎来到社交广告平台本地预览模式。这里不需要安装依赖，也不需要连接 MySQL。',
      images: [],
      likeCount: 12,
      commentCount: 2,
      viewCount: 88,
      isTop: true,
      createdAt: now,
      user: { id: '1', nickname: '平台助手', avatar: '' },
    },
  ],
  comments: [
    { id: '1', postId: '1', userId: '1', content: '评论功能预览正常。', createdAt: now },
  ],
  announcements: [
    { id: '1', title: '本地预览已启动', content: '当前是零依赖预览模式，正式开发请启动 NestJS 后端。', position: 'home_top', isTop: true, status: 1 },
  ],
  ads: [
    {
      id: '1',
      title: '首页 Banner 广告位预览',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="900" height="280"%3E%3Crect width="900" height="280" fill="%232563eb"/%3E%3Ctext x="450" y="150" text-anchor="middle" font-size="42" fill="white" font-family="Arial"%3ESocial Ad Platform%3C/text%3E%3C/svg%3E',
      positionId: '1',
      status: 2,
      viewCount: 0,
      clickCount: 0,
    },
  ],
  adPositions: [
    { id: '1', name: '首页顶部 Banner', code: 'home_banner', pricePerDay: '99.00', status: 1 },
    { id: '2', name: '信息流广告', code: 'feed_insert', pricePerDay: '49.00', status: 1 },
  ],
  adPackages: [
    { id: '1', positionId: '1', name: 'Banner 7 天套餐', days: 7, price: '599.00', status: 1 },
    { id: '2', positionId: '2', name: '信息流 7 天套餐', days: 7, price: '299.00', status: 1 },
  ],
  adOrders: [],
};

function sendJson(response, data, status = 200) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

async function sendFile(response, filename) {
  const filepath = join(publicDir, filename);
  const content = await readFile(filepath);
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
  response.writeHead(200, { 'content-type': types[extname(filepath)] ?? 'application/octet-stream' });
  response.end(content);
}

async function handleApi(request, response, pathname) {
  if (request.method === 'POST' && pathname === '/api/auth/wx-login') {
    const body = await readBody(request);
    const user = { ...state.users[0], nickname: body.nickname || state.users[0].nickname };
    state.users[0] = user;
    return sendJson(response, { token: 'local-preview-token', user });
  }

  if (request.method === 'POST' && pathname === '/api/auth/wx-phone') {
    const body = await readBody(request);
    state.users[0].phone = body.phone || body.code || state.users[0].phone;
    state.users[0].phoneVerified = true;
    return sendJson(response, { phone: state.users[0].phone, phoneVerified: true });
  }

  if (request.method === 'POST' && pathname === '/api/admin/auth/login') {
    return sendJson(response, { token: 'local-admin-token', admin: { id: '1', username: 'admin', nickname: '本地管理员' } });
  }

  if (request.method === 'GET' && pathname === '/api/posts') {
    return sendJson(response, { list: state.posts, total: state.posts.length });
  }

  if (request.method === 'POST' && pathname === '/api/posts') {
    const body = await readBody(request);
    const post = {
      id: String(state.posts.length + 1),
      userId: '1',
      content: body.content || '',
      images: body.images || [],
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      isTop: false,
      createdAt: new Date().toISOString(),
      user: state.users[0],
    };
    state.posts.unshift(post);
    return sendJson(response, post, 201);
  }

  const postLikeMatch = pathname.match(/^\/api\/posts\/(\w+)\/like$/);
  if (request.method === 'POST' && postLikeMatch) {
    const post = state.posts.find((item) => item.id === postLikeMatch[1]);
    if (!post) return sendJson(response, { message: 'Post not found' }, 404);
    post.likeCount += 1;
    return sendJson(response, { liked: true, likeCount: post.likeCount });
  }

  const commentsMatch = pathname.match(/^\/api\/posts\/(\w+)\/comments$/);
  if (request.method === 'GET' && commentsMatch) {
    return sendJson(response, state.comments.filter((item) => item.postId === commentsMatch[1]));
  }
  if (request.method === 'POST' && commentsMatch) {
    const body = await readBody(request);
    const comment = { id: String(state.comments.length + 1), postId: commentsMatch[1], userId: '1', content: body.content, createdAt: new Date().toISOString() };
    state.comments.unshift(comment);
    const post = state.posts.find((item) => item.id === commentsMatch[1]);
    if (post) post.commentCount += 1;
    return sendJson(response, comment, 201);
  }

  if (request.method === 'GET' && pathname === '/api/announcements') return sendJson(response, state.announcements);
  if (request.method === 'GET' && pathname === '/api/ads') return sendJson(response, state.ads);
  if (request.method === 'GET' && pathname === '/api/ad-positions') return sendJson(response, state.adPositions);
  if (request.method === 'GET' && pathname === '/api/ad-packages') return sendJson(response, state.adPackages);

  if (request.method === 'POST' && pathname === '/api/ad-orders') {
    const body = await readBody(request);
    const adPackage = state.adPackages.find((item) => item.id === body.packageId) ?? state.adPackages[0];
    const order = {
      id: String(state.adOrders.length + 1),
      orderNo: `LOCAL${Date.now()}`,
      userId: '1',
      positionId: body.positionId || adPackage.positionId,
      packageId: adPackage.id,
      title: body.title || '本地广告订单',
      imageUrl: body.imageUrl || state.ads[0].imageUrl,
      payAmount: adPackage.price,
      payStatus: 1,
      orderStatus: 1,
      createdAt: new Date().toISOString(),
    };
    state.adOrders.unshift(order);
    return sendJson(response, { order, payParams: { mock: true, message: '本地预览模式模拟支付成功' } }, 201);
  }

  if (request.method === 'GET' && pathname === '/api/my/ad-orders') return sendJson(response, state.adOrders);

  if (request.method === 'GET' && pathname === '/api/admin/statistics') {
    return sendJson(response, {
      users: state.users.length,
      posts: state.posts.length,
      comments: state.comments.length,
      ads: state.ads.length,
      adOrders: state.adOrders.length,
    });
  }

  return sendJson(response, { message: `Preview API not found: ${pathname}` }, 404);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://localhost:${port}`);
    if (url.pathname.startsWith('/api/')) {
      return await handleApi(request, response, url.pathname);
    }
    if (url.pathname === '/' || url.pathname === '/index.html') return await sendFile(response, 'index.html');
    return await sendFile(response, url.pathname.slice(1));
  } catch (error) {
    sendJson(response, { message: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

server.listen(port, () => {
  console.log(`本地预览已启动: http://localhost:${port}`);
  console.log('该模式无需 npm install、无需 MySQL，仅用于快速访问和验收页面流程。');
});
