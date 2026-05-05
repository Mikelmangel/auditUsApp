
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function countQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('category, mode, language')

  if (error) {
    console.error('Error fetching questions:', error)
    return
  }

  const stats: any = {
    total: data.length,
    byCategory: {},
    byMode: {},
    byLanguage: {}
  }

  data.forEach((q: any) => {
    stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1
    stats.byMode[q.mode] = (stats.byMode[q.mode] || 0) + 1
    stats.byLanguage[q.language] = (stats.byLanguage[q.language] || 0) + 1
  })

  console.log(JSON.stringify(stats, null, 2))
}

countQuestions()
