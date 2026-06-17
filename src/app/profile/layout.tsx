import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-sidebar";
import type { User } from "@/types";

function getPortal(role: string): "admin" | "teacher" | "student" {
  if (role === "teacher") return "teacher";
  if (role === "student") return "student";
  return "admin";
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const user: User = profile ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    full_name: authUser.user_metadata?.full_name ?? "User",
    role: (authUser.user_metadata?.role as User["role"]) ?? "student",
    is_active: true,
    created_at: authUser.created_at ?? "",
  };

  return (
    <DashboardShell user={user} portal={getPortal(user.role)}>
      {children}
    </DashboardShell>
  );
}
