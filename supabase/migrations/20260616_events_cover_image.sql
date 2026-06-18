ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Refresh PostgREST schema cache so the API sees the new column immediately
NOTIFY pgrst, 'reload schema';

