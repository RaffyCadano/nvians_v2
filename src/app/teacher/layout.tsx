import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import type { User } from "@/types";

export default async function TeacherLayout({
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

  if (profile && profile.role !== "teacher") {
    redirect("/auth/login");
  }

  const user: User = profile ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    full_name: authUser.user_metadata?.full_name ?? "Teacher",
    role: "teacher",
    is_active: true,
    created_at: "",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DashboardSidebar user={user} portal="teacher" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
