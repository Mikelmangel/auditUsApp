
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey!)

async function sampleQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .limit(20)

  if (error) {
    console.error(error)
    return
  }

  console.log(JSON.stringify(data, null, 2))
}

sampleQuestions()
