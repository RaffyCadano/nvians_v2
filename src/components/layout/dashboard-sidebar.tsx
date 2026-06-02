"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  BarChart3,
  Settings,
  Newspaper,
  UserCheck,
  School,
  LogOut,
  ChevronRight,
} from "lucide-react";
import type { User } from "@/types";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/school-years", label: "School Years", icon: Calendar },
  { href: "/admin/classes", label: "Classes", icon: School },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { href: "/admin/teachers", label: "Teachers", icon: UserCheck },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
  { href: "/admin/enrollment", label: "Enrollment", icon: ClipboardList },
  { href: "/admin/attendance", label: "Attendance", icon: Users },
  { href: "/admin/grades", label: "Grades", icon: BarChart3 },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/cms", label: "Website CMS", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user: User;
  navItems: typeof adminNav;
}

export function DashboardSidebar({ user, navItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Image src="/school-logo.png" alt="NVIANS Logo" width={32} height={32} className="h-8 w-auto" />
        <span className="font-semibold text-gray-900">NVIANS SMS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-100 text-left w-full rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>{user.full_name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => { window.location.href = "/profile"; }}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onSelect={async () => {
                await logout();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

export { adminNav };
