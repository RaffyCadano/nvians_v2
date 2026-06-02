-- Fix teacher INSERT/UPDATE on grade tables (explicit WITH CHECK for new rows).
-- Run in Supabase Dashboard → SQL Editor if grade category inserts fail with RLS.

DROP POLICY IF EXISTS "Grade categories: teacher own" ON public.grade_categories;
DROP POLICY IF EXISTS "Grade categories: teacher read" ON public.grade_categories;
DROP POLICY IF EXISTS "Grade categories: teacher insert" ON public.grade_categories;
DROP POLICY IF EXISTS "Grade categories: teacher update" ON public.grade_categories;
DROP POLICY IF EXISTS "Grade categories: teacher delete" ON public.grade_categories;

CREATE POLICY "Grade categories: teacher read" ON public.grade_categories
  FOR SELECT USING (
    class_subject_id IN (
      SELECT cs.id FROM public.class_subjects cs
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade categories: teacher insert" ON public.grade_categories
  FOR INSERT WITH CHECK (
    class_subject_id IN (
      SELECT cs.id FROM public.class_subjects cs
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade categories: teacher update" ON public.grade_categories
  FOR UPDATE
  USING (
    class_subject_id IN (
      SELECT cs.id FROM public.class_subjects cs
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    class_subject_id IN (
      SELECT cs.id FROM public.class_subjects cs
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade categories: teacher delete" ON public.grade_categories
  FOR DELETE USING (
    class_subject_id IN (
      SELECT cs.id FROM public.class_subjects cs
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Grade items: teacher own" ON public.grade_items;
DROP POLICY IF EXISTS "Grade items: teacher read" ON public.grade_items;
DROP POLICY IF EXISTS "Grade items: teacher insert" ON public.grade_items;
DROP POLICY IF EXISTS "Grade items: teacher update" ON public.grade_items;
DROP POLICY IF EXISTS "Grade items: teacher delete" ON public.grade_items;

CREATE POLICY "Grade items: teacher read" ON public.grade_items
  FOR SELECT USING (
    category_id IN (
      SELECT gc.id FROM public.grade_categories gc
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade items: teacher insert" ON public.grade_items
  FOR INSERT WITH CHECK (
    category_id IN (
      SELECT gc.id FROM public.grade_categories gc
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade items: teacher update" ON public.grade_items
  FOR UPDATE
  USING (
    category_id IN (
      SELECT gc.id FROM public.grade_categories gc
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    category_id IN (
      SELECT gc.id FROM public.grade_categories gc
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade items: teacher delete" ON public.grade_items
  FOR DELETE USING (
    category_id IN (
      SELECT gc.id FROM public.grade_categories gc
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Grade scores: teacher own" ON public.grade_scores;
DROP POLICY IF EXISTS "Grade scores: teacher read" ON public.grade_scores;
DROP POLICY IF EXISTS "Grade scores: teacher insert" ON public.grade_scores;
DROP POLICY IF EXISTS "Grade scores: teacher update" ON public.grade_scores;
DROP POLICY IF EXISTS "Grade scores: teacher delete" ON public.grade_scores;

CREATE POLICY "Grade scores: teacher read" ON public.grade_scores
  FOR SELECT USING (
    grade_item_id IN (
      SELECT gi.id FROM public.grade_items gi
      JOIN public.grade_categories gc ON gc.id = gi.category_id
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade scores: teacher insert" ON public.grade_scores
  FOR INSERT WITH CHECK (
    grade_item_id IN (
      SELECT gi.id FROM public.grade_items gi
      JOIN public.grade_categories gc ON gc.id = gi.category_id
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade scores: teacher update" ON public.grade_scores
  FOR UPDATE
  USING (
    grade_item_id IN (
      SELECT gi.id FROM public.grade_items gi
      JOIN public.grade_categories gc ON gc.id = gi.category_id
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    grade_item_id IN (
      SELECT gi.id FROM public.grade_items gi
      JOIN public.grade_categories gc ON gc.id = gi.category_id
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Grade scores: teacher delete" ON public.grade_scores
  FOR DELETE USING (
    grade_item_id IN (
      SELECT gi.id FROM public.grade_items gi
      JOIN public.grade_categories gc ON gc.id = gi.category_id
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
  );
