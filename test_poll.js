const fs = require('fs');
const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if(k) env[k] = v.join('=').replace(/['"]/g, '').trim();
});
const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/polls?id=eq.eebcf574-0008-4e08-94a1-b076438479bf&select=*,questions(*)`;
fetch(url, {
  headers: {
    'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  }
}).then(r => r.json()).then(data => console.dir(data, {depth: null}));
