-- EduMart Supabase roles + RLS baseline

-- 1) Role enum for app authorization
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
		CREATE TYPE public.app_role AS ENUM ('customer', 'vendor', 'admin');
	END IF;
END
$$;

-- 2) Profile table mapped 1:1 with Supabase auth user
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
		EXECUTE '
			CREATE TABLE IF NOT EXISTS public.user_profiles (
				id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
				email text UNIQUE NOT NULL,
				role public.app_role NOT NULL DEFAULT ''customer'',
				first_name text,
				last_name text,
				created_at timestamptz NOT NULL DEFAULT now(),
				updated_at timestamptz NOT NULL DEFAULT now()
			)
		';
	ELSE
		EXECUTE '
			CREATE TABLE IF NOT EXISTS public.user_profiles (
				id uuid PRIMARY KEY,
				email text UNIQUE NOT NULL,
				role public.app_role NOT NULL DEFAULT ''customer'',
				first_name text,
				last_name text,
				created_at timestamptz NOT NULL DEFAULT now(),
				updated_at timestamptz NOT NULL DEFAULT now()
			)
		';
	END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 3) Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
	INSERT INTO public.user_profiles (id, email, role, first_name, last_name)
	VALUES (
		NEW.id,
		COALESCE(NEW.email, ''),
		COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'customer'),
		NEW.raw_user_meta_data ->> 'first_name',
		NEW.raw_user_meta_data ->> 'last_name'
	)
	ON CONFLICT (id) DO NOTHING;

	RETURN NEW;
END;
$$;

DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
		DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
		CREATE TRIGGER on_auth_user_created
		AFTER INSERT ON auth.users
		FOR EACH ROW
		EXECUTE FUNCTION public.handle_new_auth_user();
	END IF;
END
$$;

-- 4) Helper for admin checks in RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	current_uid uuid;
BEGIN
	IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
		EXECUTE 'SELECT auth.uid()' INTO current_uid;
		RETURN EXISTS (
			SELECT 1
			FROM public.user_profiles p
			WHERE p.id = current_uid
				AND p.role = 'admin'::public.app_role
		);
	END IF;

	RETURN FALSE;
END;
$$;

-- 5) Enable RLS and create policies for profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
		DROP POLICY IF EXISTS user_profiles_select ON public.user_profiles;
		CREATE POLICY user_profiles_select
		ON public.user_profiles
		FOR SELECT
		USING (id = auth.uid() OR public.is_admin());

		DROP POLICY IF EXISTS user_profiles_insert ON public.user_profiles;
		CREATE POLICY user_profiles_insert
		ON public.user_profiles
		FOR INSERT
		WITH CHECK (id = auth.uid() OR public.is_admin());

		DROP POLICY IF EXISTS user_profiles_update ON public.user_profiles;
		CREATE POLICY user_profiles_update
		ON public.user_profiles
		FOR UPDATE
		USING (id = auth.uid() OR public.is_admin())
		WITH CHECK (id = auth.uid() OR public.is_admin());

		DROP POLICY IF EXISTS user_profiles_delete ON public.user_profiles;
		CREATE POLICY user_profiles_delete
		ON public.user_profiles
		FOR DELETE
		USING (public.is_admin());
	END IF;
END
$$;
