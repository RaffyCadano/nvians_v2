-- Fix news public read policy to match is_published column (not status).
DROP POLICY IF EXISTS "News: public read published" ON public.news;

CREATE POLICY "News: public read published" ON public.news
  FOR SELECT USING (is_published = TRUE);
