-- Add icon_name column to notebooks
ALTER TABLE public.notebooks
  ADD COLUMN IF NOT EXISTS icon_name text NOT NULL DEFAULT 'BookOpen';

-- Create private bucket for note attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-attachments', 'note-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies: users can only access objects under their own user-id folder
CREATE POLICY "Users read own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'note-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users upload own attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'note-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users update own attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'note-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users delete own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'note-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);