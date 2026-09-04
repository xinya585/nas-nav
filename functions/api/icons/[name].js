// Cloudflare Pages Function: /api/icons/:name
// 获取单个图标的 base64 内容

export async function onRequest(context) {
  const { request, env, params } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

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
  const iconsPath = env.GITHUB_ICONS_PATH || 'icons';

  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: 'GITHUB_TOKEN not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const name = params.name;
    if (!name) {
      return new Response(JSON.stringify({ ok: false, error: 'Icon name required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const decodedName = decodeURIComponent(name);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${iconsPath}/${decodedName}?ref=${branch}`;
    const resp = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'nas-nav',
      },
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ ok: false, error: `Icon not found: ${resp.status}` }), {
        status: resp.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    if (!data.content) {
      return new Response(JSON.stringify({ ok: false, error: 'Unable to get icon content' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ext = decodedName.split('.').pop().toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml'
      : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
      : ext === 'gif' ? 'image/gif'
      : ext === 'webp' ? 'image/webp'
      : 'image/png';

    const dataUrl = `data:${mime};base64,${data.content.replace(/\n/g, '')}`;

    return new Response(JSON.stringify({ ok: true, name: decodedName, dataUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
