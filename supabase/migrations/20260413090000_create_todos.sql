-- Minimal todos table for the Supabase sample page

CREATE TABLE IF NOT EXISTS public.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'todos'
      AND policyname = 'todos_select_all'
  ) THEN
    CREATE POLICY todos_select_all
    ON public.todos
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'todos'
      AND policyname = 'todos_write_all'
  ) THEN
    CREATE POLICY todos_write_all
    ON public.todos
    FOR INSERT
    WITH CHECK (true);
  END IF;
END
$$;