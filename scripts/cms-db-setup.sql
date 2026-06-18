-- Run once in Supabase Dashboard → SQL Editor → New query → Run
-- Fixes: events cover_image, news published_by

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS cover_image TEXT;

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

ALTER TABLE public.events
  ALTER COLUMN start_date DROP NOT NULL;

UPDATE public.events
SET is_published = TRUE
WHERE is_published IS DISTINCT FROM TRUE;

DROP POLICY IF EXISTS "Events: public read" ON public.events;
DROP POLICY IF EXISTS "Events: public read published" ON public.events;

CREATE POLICY "Events: public read published" ON public.events
  FOR SELECT USING (is_published = TRUE);

UPDATE public.news
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

UPDATE public.news
SET published_by = author_id
WHERE is_published = TRUE
  AND published_by IS NULL
  AND author_id IS NOT NULL;

NOTIFY pgrst, 'reload schema';
