-- Run once in Supabase Dashboard → SQL Editor → New query → Run
-- Fixes: events cover_image, news published_by

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS cover_image TEXT;

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

UPDATE public.news
SET published_by = author_id
WHERE is_published = TRUE
  AND published_by IS NULL
  AND author_id IS NOT NULL;

NOTIFY pgrst, 'reload schema';
