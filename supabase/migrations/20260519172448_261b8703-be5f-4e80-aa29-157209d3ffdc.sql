-- Restore EXECUTE on current_user_email so RLS policies (called as authenticated role)
-- can call it. Without this, the "Recipients view shared notes" and
-- "Editor recipients update shared notes" policies silently fail.
GRANT EXECUTE ON FUNCTION public.current_user_email() TO authenticated;

-- Restore EXECUTE on handle_new_user. It's only ever invoked by the auth.users
-- trigger, but being SECURITY DEFINER with restricted EXECUTE has historically
-- caused signup hooks to break in some Supabase environments. Safer to allow.
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon, service_role;

-- Ensure the auth.users -> public.profiles trigger actually exists.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();