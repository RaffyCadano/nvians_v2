ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

UPDATE public.news
SET published_by = author_id
WHERE is_published = TRUE
  AND published_by IS NULL
  AND author_id IS NOT NULL;
