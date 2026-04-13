-- Fix Supabase auth signup role casing so new-user trigger doesn't fail

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
		COALESCE(NULLIF(lower(NEW.raw_user_meta_data ->> 'role'), '')::public.app_role, 'customer'),
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
