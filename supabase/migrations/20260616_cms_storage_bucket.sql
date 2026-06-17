-- Public CMS media bucket for news cover images and similar assets.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms',
  'cms',
  TRUE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "CMS media: public read" ON storage.objects;
CREATE POLICY "CMS media: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms');

DROP POLICY IF EXISTS "CMS media: admin insert" ON storage.objects;
CREATE POLICY "CMS media: admin insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cms'
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'staff')
    )
  );

DROP POLICY IF EXISTS "CMS media: admin update" ON storage.objects;
CREATE POLICY "CMS media: admin update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cms'
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'staff')
    )
  );

DROP POLICY IF EXISTS "CMS media: admin delete" ON storage.objects;
CREATE POLICY "CMS media: admin delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cms'
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'staff')
    )
  );
