-- Shared notes table
CREATE TABLE public.shared_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  shared_with_email TEXT NOT NULL,
  permission TEXT NOT NULL DEFAULT 'view' CHECK (permission IN ('view','edit')),
  accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (note_id, shared_with_email)
);

CREATE INDEX idx_shared_notes_note_id ON public.shared_notes(note_id);
CREATE INDEX idx_shared_notes_email ON public.shared_notes(lower(shared_with_email));

ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's email
CREATE OR REPLACE FUNCTION public.current_user_email()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(email) FROM auth.users WHERE id = auth.uid()
$$;

-- Owner manages their shares
CREATE POLICY "Owners select own shares"
ON public.shared_notes FOR SELECT TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Owners insert own shares"
ON public.shared_notes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners update own shares"
ON public.shared_notes FOR UPDATE TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Owners delete own shares"
ON public.shared_notes FOR DELETE TO authenticated
USING (auth.uid() = owner_id);

-- Recipient can view their invites
CREATE POLICY "Recipient views invites"
ON public.shared_notes FOR SELECT TO authenticated
USING (lower(shared_with_email) = public.current_user_email());

-- Recipient can mark as accepted
CREATE POLICY "Recipient accepts invite"
ON public.shared_notes FOR UPDATE TO authenticated
USING (lower(shared_with_email) = public.current_user_email());

-- Allow recipients to view shared notes
CREATE POLICY "Recipients view shared notes"
ON public.notes FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shared_notes sn
    WHERE sn.note_id = notes.id
      AND lower(sn.shared_with_email) = public.current_user_email()
  )
);

-- Allow editor recipients to update shared notes
CREATE POLICY "Editor recipients update shared notes"
ON public.notes FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shared_notes sn
    WHERE sn.note_id = notes.id
      AND lower(sn.shared_with_email) = public.current_user_email()
      AND sn.permission = 'edit'
  )
);
