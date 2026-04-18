const fs = require('fs');
const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split('\n').filter(Boolean).forEach(line => {
  const [k, ...v] = line.split('=');
  if(k) env[k.trim()] = v.join('=').replace(/['"]/g, '').replace(/\\n/g, '').trim();
});

const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/votes`;
console.log('Fetching', url);
fetch(url, {
  method: 'POST',
  headers: {
    'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({ poll_id: "eebcf574-0008-4e08-94a1-b076438479bf", voter_id: "00000000-0000-0000-0000-000000000000", target_id: "5" })
}).then(r => r.json().then(j => ({status: r.status, body: j})).catch(() => ({status: r.status, body: null}))).then(console.dir).catch(console.error);
