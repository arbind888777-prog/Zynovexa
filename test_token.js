const fs = require('fs');
const path = require('path');

function getInstagramToken() {
  if (process.env.INSTAGRAM_GRAPH_API_TOKEN) {
    return process.env.INSTAGRAM_GRAPH_API_TOKEN.trim();
  }

  const envPath = path.join(__dirname, 'apps', 'api', '.env');
  if (!fs.existsSync(envPath)) {
    return '';
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  const match = envFile.match(/^INSTAGRAM_GRAPH_API_TOKEN=(.+)$/m);
  return match?.[1]?.trim() || '';
}

async function fetchJson(url) {
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, payload };
}

async function test() {
  const token = getInstagramToken();

  if (!token) {
    console.error('INSTAGRAM_GRAPH_API_TOKEN not found in env.');
    process.exitCode = 1;
    return;
  }

  try {
    const instagram = await fetchJson(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${encodeURIComponent(token)}`,
    );
    console.log('Instagram Graph API /me:', JSON.stringify(instagram, null, 2));

    const facebook = await fetchJson(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(token)}`,
    );
    console.log('Facebook Graph API /me/accounts:', JSON.stringify(facebook, null, 2));

    if (facebook.ok && Array.isArray(facebook.payload?.data)) {
      for (const page of facebook.payload.data) {
        if (!page.access_token) {
          continue;
        }

        const pageLookup = await fetchJson(
          `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account{id,username,profile_picture_url}&access_token=${encodeURIComponent(page.access_token)}`,
        );
        console.log(`Facebook Page ${page.id} Instagram link:`, JSON.stringify(pageLookup, null, 2));
      }
    }

    if (!instagram.ok && !facebook.ok) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    process.exitCode = 1;
  }
}

test();
