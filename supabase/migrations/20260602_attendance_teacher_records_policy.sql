-- Allow teachers to manage attendance records for sessions they created.
-- Run in Supabase SQL Editor if not applied via full schema.sql.

CREATE POLICY "Attendance records: teacher session" ON public.attendance_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.created_by = auth.uid()
    )
  );
