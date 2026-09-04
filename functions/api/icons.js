// Cloudflare Pages Function: /api/icons
// 代理 GitHub API，获取 icons 目录列表和单个图标内容
// 支持：
//   GET /api/icons          -> 获取 icons 目录文件列表
//   GET /api/icons/:name    -> 获取单个图标的 base64 内容

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const token = env.GITHUB_TOKEN;
  const owner = env.GITHUB_OWNER || 'xinya585';
  const repo = env.GITHUB_REPO || 'nas-nav-private';
  const branch = env.GITHUB_BRANCH || 'main';
  const path = env.GITHUB_ICONS_PATH || 'icons';

  if (!token || !owner || !repo) {
    return new Response(JSON.stringify({ ok: false, error: 'GitHub 配置不完整' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // 解析路径：/api/icons 或 /api/icons/filename
    const pathname = url.pathname.replace(/^\/api\/icons\/?/, '');

    if (pathname === '' || pathname === '/') {
      // 获取 icons 目录列表
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const resp = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'nas-nav',
        },
      });

      if (resp.status === 404) {
        return new Response(JSON.stringify({ ok: true, files: [] }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!resp.ok) {
        return new Response(JSON.stringify({ ok: false, error: `GitHub API error: ${resp.status}` }), {
          status: resp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await resp.json();
      const files = Array.isArray(data)
        ? data.filter(f => f.type === 'file' && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f.name))
            .map(f => ({ name: f.name, size: f.size, sha: f.sha }))
        : [];

      return new Response(JSON.stringify({ ok: true, files }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // 获取单个图标内容
      const filename = decodeURIComponent(pathname);
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}/${filename}?ref=${branch}`;
      const resp = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'nas-nav',
        },
      });

      if (!resp.ok) {
        return new Response(JSON.stringify({ ok: false, error: `图标不存在: ${resp.status}` }), {
          status: resp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await resp.json();
      if (!data.content) {
        return new Response(JSON.stringify({ ok: false, error: '无法获取图标内容' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const ext = filename.split('.').pop().toLowerCase();
      const mime = ext === 'svg' ? 'image/svg+xml'
        : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
        : ext === 'gif' ? 'image/gif'
        : ext === 'webp' ? 'image/webp'
        : 'image/png';

      const dataUrl = `data:${mime};base64,${data.content.replace(/\n/g, '')}`;

      return new Response(JSON.stringify({ ok: true, name: filename, dataUrl }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
