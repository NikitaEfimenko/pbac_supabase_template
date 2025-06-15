-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT USAGE ON SCHEMA auth TO postgres, supabase_auth_admin;

GRANT EXECUTE ON FUNCTION auth.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION auth.custom_access_token_hook FROM authenticated, anon, public;

GRANT ALL ON TABLE public.user_roles TO supabase_auth_admin;
GRANT ALL ON TABLE public.role_permissions TO supabase_auth_admin;

REVOKE ALL ON TABLE public.user_roles FROM authenticated, anon, public;
REVOKE ALL ON TABLE public.role_permissions FROM authenticated, anon, public;

-- Policies for auth admin
DROP POLICY IF EXISTS "Allow auth admin to read user roles" ON public.user_roles;
CREATE POLICY "Allow auth admin to read user roles" 
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO supabase_auth_admin
USING (true);

DROP POLICY IF EXISTS "Allow auth admin to read role permissions" ON public.role_permissions;
CREATE POLICY "Allow auth admin to read role permissions" 
ON public.role_permissions
AS PERMISSIVE
FOR SELECT
TO supabase_auth_admin
USING (true); 