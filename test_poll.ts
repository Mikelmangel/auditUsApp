import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function main() {
  const { data, error } = await supabase.from('polls').select('*, questions(*)').eq('id', 'eebcf574-0008-4e08-94a1-b076438479bf').single();
  console.log(data);
}
main();
