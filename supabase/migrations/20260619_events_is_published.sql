-- Event drafts: is_published flag and optional start_date for incomplete events

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

NOTIFY pgrst, 'reload schema';
