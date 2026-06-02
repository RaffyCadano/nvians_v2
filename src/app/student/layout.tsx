import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import type { User } from "@/types";
import {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  UserCheck,
  Megaphone,
  BookOpen,
} from "lucide-react";

const studentNav = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/grades", label: "Grades", icon: BarChart3 },
  { href: "/student/attendance", label: "Attendance", icon: UserCheck },
  { href: "/student/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/student/schedule", label: "Schedule", icon: BookOpen },
  { href: "/student/announcements", label: "Announcements", icon: Megaphone },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (profile && profile.role !== "student") {
    redirect("/auth/login");
  }

  const user: User = profile ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    full_name: authUser.user_metadata?.full_name ?? "Student",
    role: "student",
    is_active: true,
    created_at: "",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DashboardSidebar user={user} navItems={studentNav} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
