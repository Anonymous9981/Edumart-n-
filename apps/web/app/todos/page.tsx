import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

interface TodoRow {
  id: string
  name: string
  is_completed: boolean
  created_at: string
}

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select('*').returns<TodoRow[]>()

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  )
}
