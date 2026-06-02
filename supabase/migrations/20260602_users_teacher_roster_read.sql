-- Let teachers read names/emails of students in their subject classes or advisory.
DROP POLICY IF EXISTS "Users: teacher read class roster" ON public.users;

CREATE POLICY "Users: teacher read class roster" ON public.users
  FOR SELECT USING (
    id IN (
      SELECT s.user_id
      FROM public.students s
      JOIN public.enrollments e ON e.student_id = s.id
      JOIN public.class_subjects cs ON cs.class_id = e.class_id
      JOIN public.teachers t ON t.id = cs.teacher_id
      WHERE t.user_id = auth.uid() AND e.status = 'enrolled'
    )
    OR id IN (
      SELECT s.user_id
      FROM public.students s
      JOIN public.enrollments e ON e.student_id = s.id
      JOIN public.classes c ON c.id = e.class_id
      JOIN public.teachers t ON t.id = c.advisor_id
      WHERE t.user_id = auth.uid() AND e.status = 'enrolled'
    )
  );
