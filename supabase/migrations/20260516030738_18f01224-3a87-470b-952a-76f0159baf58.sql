
-- Make bucket private
UPDATE storage.buckets SET public = false WHERE id = 'note-attachments';

-- update_updated_at_column doesn't need elevated privileges
ALTER FUNCTION public.update_updated_at_column() SECURITY INVOKER;

-- Lock down callable SECURITY DEFINER helpers (still callable by triggers/RLS internally)
REVOKE EXECUTE ON FUNCTION public.current_user_email() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.shared_notes_protect_recipient_updates() FROM anon, authenticated, public;
