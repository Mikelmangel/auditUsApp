/**
 * Test script: verify-engine.js
 * Run with: node verify-engine.js
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testModes() {
  console.log("🧪 Starting Engine Verification...");

  const testPolls = [
    { mode: 'vs', target: 'any-uuid-string' },
    { mode: 'poll', target: 'any-uuid-string' },
    { mode: 'mc', target: 'Literalmente sí' },
    { mode: 'scale', target: '8' },
    { mode: 'free', target: 'Mi secreto es que no sé cocinar.' },
    { mode: 'ranking', target: 'uuid1,uuid2,uuid3,uuid4' }
  ];

  for (const t of testPolls) {
    console.log(`\nTesting mode: ${t.mode.toUpperCase()}`);
    console.log(`Attempting to vote with target: "${t.target}"`);
    
    // 1. Create a dummy poll if needed or use a known ID
    // For this test, we just try to insert into 'votes' to test the column type
    const { error } = await supabase
      .from('votes')
      .insert([{
        poll_id: '00000000-0000-0000-0000-000000000000', // Dummy ID
        voter_id: '00000000-0000-0000-0000-000000000000', // Dummy ID
        target_id: t.target
      }]);

    if (error && error.code !== '23503') { // Ignore FK violations, we only care about type errors!
      console.error(`❌ FAILED with error code ${error.code}: ${error.message}`);
    } else {
      console.log(`✅ TYPE CHECK PASSED (No 406/Type mismatch error)`);
    }
  }

  console.log("\n🏁 Verification Complete.");
}

testModes();
