-- Students can read grade structure for subjects they are enrolled in.
DROP POLICY IF EXISTS "Grade categories: student read enrolled" ON public.grade_categories;
DROP POLICY IF EXISTS "Grade items: student read enrolled" ON public.grade_items;

CREATE POLICY "Grade categories: student read enrolled" ON public.grade_categories
  FOR SELECT USING (
    class_subject_id IN (
      SELECT cs.id FROM public.class_subjects cs
      JOIN public.enrollments e ON e.class_id = cs.class_id
      JOIN public.students s ON s.id = e.student_id
      WHERE s.user_id = auth.uid() AND e.status = 'enrolled'
    )
  );

CREATE POLICY "Grade items: student read enrolled" ON public.grade_items
  FOR SELECT USING (
    category_id IN (
      SELECT gc.id FROM public.grade_categories gc
      JOIN public.class_subjects cs ON cs.id = gc.class_subject_id
      JOIN public.enrollments e ON e.class_id = cs.class_id
      JOIN public.students s ON s.id = e.student_id
      WHERE s.user_id = auth.uid() AND e.status = 'enrolled'
    )
  );
