const fs = require('fs');
const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split('\n').filter(Boolean).forEach(line => {
  const [k, ...v] = line.split('=');
  if(k) env[k.trim()] = v.join('=').replace(/['"]/g, '').replace(/\\n/g, '').trim();
});

fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/votes?limit=1`, {
  headers: {
    'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  }
}).then(r => r.json().then(j => ({status: r.status, body: j}))).then(console.dir).catch(console.error);

