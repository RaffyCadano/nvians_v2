export type UserRole = "admin" | "teacher" | "student" | "staff";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface SchoolYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: "active" | "archived" | "upcoming";
  created_at: string;
}

export interface Term {
  id: string;
  name: string;
  school_year_id: string;
  school_year?: SchoolYear;
  start_date: string;
  end_date: string;
  status: "active" | "archived" | "upcoming";
  created_at: string;
}

export interface Class {
  id: string;
  grade_level: string;
  section: string;
  school_year_id: string;
  school_year?: SchoolYear;
  advisor_id?: string;
  advisor?: Teacher;
  status: "active" | "archived";
  created_at: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: "active" | "archived";
  created_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  user?: User;
  employee_number: string;
  department: string;
  contact_number?: string;
  address?: string;
  status: "active" | "disabled";
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  user?: User;
  student_number: string;
  parent_name?: string;
  parent_contact?: string;
  address?: string;
  date_of_birth?: string;
  status: "active" | "disabled";
  created_at: string;
}

export interface ClassSubject {
  id: string;
  class_id: string;
  class?: Class;
  subject_id: string;
  subject?: Subject;
  teacher_id?: string;
  teacher?: Teacher;
  term_id: string;
  term?: Term;
  schedule?: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  student?: Student;
  class_id: string;
  class?: Class;
  school_year_id: string;
  school_year?: SchoolYear;
  status: "enrolled" | "transferred" | "dropped";
  enrolled_at: string;
}

export interface AttendanceSession {
  id: string;
  class_subject_id: string;
  class_subject?: ClassSubject;
  date: string;
  created_by: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  student?: Student;
  status: "present" | "absent" | "excused";
  remarks?: string;
  created_at: string;
}

export interface GradeCategory {
  id: string;
  class_subject_id: string;
  name: string;
  weight: number;
  created_at: string;
}

export interface GradeItem {
  id: string;
  category_id: string;
  category?: GradeCategory;
  name: string;
  max_score: number;
  created_at: string;
}

export interface GradeScore {
  id: string;
  grade_item_id: string;
  student_id: string;
  student?: Student;
  score: number;
  created_at: string;
}

export interface Assignment {
  id: string;
  class_subject_id: string;
  class_subject?: ClassSubject;
  title: string;
  description?: string;
  due_date: string;
  max_score: number;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  student?: Student;
  file_url?: string;
  submitted_at: string;
  score?: number;
  feedback?: string;
}

export interface Announcement {
  id: string;
  author_id: string;
  class_subject_id?: string;
  class_id?: string;
  title: string;
  content: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id: string;
  published_at?: string;
  status: "draft" | "published";
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  status: "upcoming" | "ongoing" | "past";
  created_at: string;
}

export interface GalleryPhoto {
  id: string;
  album_id: string;
  url: string;
  caption?: string;
  created_at: string;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  cover_photo?: string;
  created_at: string;
}
