// Cloudflare Pages Functions: 数据代理
// 通过环境变量读取 GitHub Token，前端无需配置 GitHub 即可同步数据

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' };

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const token = env.GITHUB_TOKEN;
  const owner = env.GITHUB_OWNER || 'xinya585';
  const repo = env.GITHUB_REPO || 'nas-nav-private';
  const branch = env.GITHUB_BRANCH || 'main';
  const path = env.GITHUB_PATH || 'data.json';

  if (!token) {
    return new Response(
      JSON.stringify({ ok: false, reason: 'not_configured', message: 'GITHUB_TOKEN not set' }),
      { status: 500, headers: jsonHeaders }
    );
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const ghHeaders = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'nas-nav-cloudflare-function',
  };

  try {
    if (request.method === 'GET') {
      const resp = await fetch(`${apiUrl}?ref=${branch}&_t=${Date.now()}`, {
        headers: ghHeaders,
      });

      if (resp.status === 404) {
        return new Response(
          JSON.stringify({ ok: true, data: null, sha: null }),
          { headers: jsonHeaders }
        );
      }

      if (!resp.ok) {
        return new Response(
          JSON.stringify({ ok: false, reason: `http_${resp.status}` }),
          { status: resp.status, headers: jsonHeaders }
        );
      }

      const json = await resp.json();
      
      // 处理大文件（超过1MB时 GitHub Contents API 不返回 content，需要用 Git Blob API）
      let contentB64 = json.content;
      if (!contentB64 && json.git_url) {
        const blobResp = await fetch(json.git_url, { headers: ghHeaders });
        if (!blobResp.ok) {
          return new Response(
            JSON.stringify({ ok: false, reason: `blob_http_${blobResp.status}` }),
            { status: blobResp.status, headers: jsonHeaders }
          );
        }
        const blobJson = await blobResp.json();
        contentB64 = blobJson.content;
      }
      
      if (!contentB64) {
        return new Response(
          JSON.stringify({ ok: false, reason: 'no_content', message: 'GitHub 返回无内容' }),
          { status: 502, headers: jsonHeaders }
        );
      }
      
      // GitHub 返回的 base64 可能包含换行符，先清理
      const cleanB64 = contentB64.replace(/\s/g, '');
      const bytes = Uint8Array.from(atob(cleanB64), c => c.charCodeAt(0));
      const content = JSON.parse(new TextDecoder('utf-8').decode(bytes));
      return new Response(
        JSON.stringify({ ok: true, data: content, sha: json.sha }),
        { headers: jsonHeaders }
      );
    }

    if (request.method === 'PUT') {
      const body = await request.json();
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(body.data, null, 2))));
      const payload = {
        message: `update nav data at ${new Date().toISOString()}`,
        content,
        branch,
      };
      if (body.sha) payload.sha = body.sha;

      const resp = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        return new Response(
          JSON.stringify({ ok: false, reason: `http_${resp.status}`, message: err.message }),
          { status: resp.status, headers: jsonHeaders }
        );
      }

      const json = await resp.json();
      return new Response(
        JSON.stringify({ ok: true, sha: json.content?.sha || null }),
        { headers: jsonHeaders }
      );
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, reason: 'network', message: e.message }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
