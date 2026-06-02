-- Explicit teacher UPDATE on attendance_records (WITH CHECK for row changes).
DROP POLICY IF EXISTS "Attendance records: teacher session" ON public.attendance_records;
DROP POLICY IF EXISTS "Attendance records: teacher read" ON public.attendance_records;
DROP POLICY IF EXISTS "Attendance records: teacher update" ON public.attendance_records;

CREATE POLICY "Attendance records: teacher read" ON public.attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.created_by = auth.uid()
    )
  );

CREATE POLICY "Attendance records: teacher update" ON public.attendance_records
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.created_by = auth.uid()
    )
  );
