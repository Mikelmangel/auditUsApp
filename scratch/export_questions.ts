
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey!)

async function getAllQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('language', 'es')

  if (error) {
    console.error(error)
    return
  }

  // Generate a mapping to help me translate
  const exportData = data.map(q => ({
    id: q.id,
    text: q.text,
    category: q.category,
    mode: q.mode
  }))

  console.log(JSON.stringify(exportData, null, 2))
}

getAllQuestions()
