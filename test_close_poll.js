const fs = require('fs');
const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split('\n').filter(Boolean).forEach(line => {
  const [k, ...v] = line.split('=');
  if(k) env[k.trim()] = v.join('=').replace(/['"]/g, '').replace(/\\n/g, '').trim();
});

async function run() {
  const loginRes = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: 'admin@audit-us.app', password: 'admin123' })
  });
  const auth = await loginRes.json();
  if(!auth.access_token) return console.error('Login failed');

  const patchRes = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/polls?id=eq.5914a441-ad27-45d3-a2a6-729028c66028`, {
    method: 'PATCH',
    headers: {
      'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${auth.access_token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ is_active: false })
  });
  
  console.log(patchRes.status, await patchRes.text());
}
run();
