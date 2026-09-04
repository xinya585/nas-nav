// Cloudflare Pages Function: /api/icons
// 支持：
//   GET /api/icons              -> 获取 icons 目录文件列表
//   GET /api/icons?name=xxx.png -> 获取单个图标的 base64 内容
//   DELETE /api/icons?name=xxx.png -> 删除 GitHub 仓库中的图标文件

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (request.method !== 'GET' && request.method !== 'DELETE') {
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
    const iconName = url.searchParams.get('name');

    // DELETE 方法：删除图标文件
    if (request.method === 'DELETE') {
      if (!iconName) {
        return new Response(JSON.stringify({ ok: false, error: 'name parameter required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const decodedName = decodeURIComponent(iconName);
      const filePath = `${iconsPath}/${decodedName}`;

      // 先获取文件 sha
      const getResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'nas-nav',
        },
      });

      if (!getResp.ok) {
        return new Response(JSON.stringify({ ok: false, error: `Icon not found: ${getResp.status}` }), {
          status: getResp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const fileData = await getResp.json();
      const fileSha = fileData.sha;

      // 删除文件
      const deleteResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'nas-nav',
        },
        body: JSON.stringify({
          message: `Delete icon: ${decodedName}`,
          sha: fileSha,
          branch: branch,
        }),
      });

      if (deleteResp.ok) {
        return new Response(JSON.stringify({ ok: true, message: `Deleted: ${decodedName}` }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        const errData = await deleteResp.json().catch(() => ({}));
        return new Response(JSON.stringify({ ok: false, error: `Delete failed: ${deleteResp.status}`, detail: errData.message || '' }), {
          status: deleteResp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (!iconName) {
      // 获取 icons 目录列表
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${iconsPath}?ref=${branch}`;
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
      const decodedName = decodeURIComponent(iconName);
      const returnType = url.searchParams.get('type') || 'base64';
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
      const ext = decodedName.split('.').pop().toLowerCase();
      const mime = ext === 'svg' ? 'image/svg+xml'
        : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
        : ext === 'gif' ? 'image/gif'
        : ext === 'webp' ? 'image/webp'
        : 'image/png';

      // 如果请求 type=image，直接返回图片二进制内容（浏览器可缓存，加载快）
      if (returnType === 'image') {
        let imageBuffer = null;
        if (data.content) {
          imageBuffer = Uint8Array.from(atob(data.content.replace(/\n/g, '')), c => c.charCodeAt(0));
        } else if (data.download_url) {
          const fileResp = await fetch(data.download_url);
          if (!fileResp.ok) {
            return new Response(JSON.stringify({ ok: false, error: 'Failed to download' }), { status: 500 });
          }
          imageBuffer = new Uint8Array(await fileResp.arrayBuffer());
        }
        if (imageBuffer) {
          return new Response(imageBuffer, {
            status: 200,
            headers: {
              'Content-Type': mime,
              'Cache-Control': 'public, max-age=86400',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
        return new Response('Not found', { status: 404 });
      }

      // 默认返回 base64 JSON
      let base64Content = null;
      if (data.content) {
        base64Content = data.content.replace(/\n/g, '');
      } else if (data.download_url) {
        const fileResp = await fetch(data.download_url);
        if (!fileResp.ok) {
          return new Response(JSON.stringify({ ok: false, error: `Failed to download icon: ${fileResp.status}` }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const arrayBuffer = await fileResp.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64Content = btoa(binary);
      } else {
        return new Response(JSON.stringify({ ok: false, error: 'Unable to get icon content' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const dataUrl = `data:${mime};base64,${base64Content}`;

      return new Response(JSON.stringify({ ok: true, name: decodedName, dataUrl }), {
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
