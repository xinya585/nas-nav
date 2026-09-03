// Cloudflare Pages Functions: 数据代理
// 通过环境变量读取 GitHub Token，前端无需配置 GitHub 即可同步数据

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

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
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const ghHeaders = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  };

  try {
    if (request.method === 'GET') {
      const resp = await fetch(`${apiUrl}?ref=${branch}&_t=${Date.now()}`, {
        headers: ghHeaders,
      });

      if (resp.status === 404) {
        return new Response(
          JSON.stringify({ ok: true, data: null, sha: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!resp.ok) {
        return new Response(
          JSON.stringify({ ok: false, reason: `http_${resp.status}` }),
          { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const json = await resp.json();
      const content = JSON.parse(atob(json.content));
      return new Response(
        JSON.stringify({ ok: true, data: content, sha: json.sha }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
          { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const json = await resp.json();
      return new Response(
        JSON.stringify({ ok: true, sha: json.content?.sha || null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, reason: 'network', message: e.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
