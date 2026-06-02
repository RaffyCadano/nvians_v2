-- Teachers can read enrollments for subject classes AND advisory classes.
DROP POLICY IF EXISTS "Enrollments: teacher read class" ON public.enrollments;

CREATE POLICY "Enrollments: teacher read class" ON public.enrollments
  FOR SELECT USING (
    class_id IN (
      SELECT cs.class_id FROM public.class_subjects cs
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid()
    )
    OR class_id IN (
      SELECT c.id FROM public.classes c
      JOIN public.teachers t ON t.id = c.advisor_id
      WHERE t.user_id = auth.uid()
    )
  );
