
-- 1) shared_notes: restrict recipient UPDATE to only the `accepted` field
DROP POLICY IF EXISTS "Recipient accepts invite" ON public.shared_notes;

CREATE OR REPLACE FUNCTION public.shared_notes_protect_recipient_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Owner can change anything; skip enforcement.
  IF auth.uid() = OLD.owner_id THEN
    RETURN NEW;
  END IF;
  -- Recipients can only flip `accepted`. Block any other change.
  IF NEW.note_id IS DISTINCT FROM OLD.note_id
     OR NEW.owner_id IS DISTINCT FROM OLD.owner_id
     OR NEW.shared_with_email IS DISTINCT FROM OLD.shared_with_email
     OR NEW.permission IS DISTINCT FROM OLD.permission
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
     OR NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Recipients can only update the accepted field';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS shared_notes_protect_recipient_updates ON public.shared_notes;
CREATE TRIGGER shared_notes_protect_recipient_updates
BEFORE UPDATE ON public.shared_notes
FOR EACH ROW
EXECUTE FUNCTION public.shared_notes_protect_recipient_updates();

CREATE POLICY "Recipient accepts invite"
ON public.shared_notes
FOR UPDATE
TO authenticated
USING (lower(shared_with_email) = public.current_user_email())
WITH CHECK (lower(shared_with_email) = public.current_user_email());

-- 2) profiles: restrict SELECT
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users view own or shared profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.shared_notes sn
    WHERE sn.owner_id = profiles.user_id
      AND lower(sn.shared_with_email) = public.current_user_email()
  )
  OR EXISTS (
    SELECT 1 FROM public.shared_notes sn
    WHERE sn.owner_id = auth.uid()
      AND lower(sn.shared_with_email) = (SELECT lower(email) FROM auth.users WHERE id = profiles.user_id)
  )
);

-- 3) Storage RLS for note-attachments bucket (private, per-user folder)
DROP POLICY IF EXISTS "note-attachments owner select" ON storage.objects;
DROP POLICY IF EXISTS "note-attachments owner insert" ON storage.objects;
DROP POLICY IF EXISTS "note-attachments owner update" ON storage.objects;
DROP POLICY IF EXISTS "note-attachments owner delete" ON storage.objects;

CREATE POLICY "note-attachments owner select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'note-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "note-attachments owner insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'note-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "note-attachments owner update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'note-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "note-attachments owner delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'note-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
