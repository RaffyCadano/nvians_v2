"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  Megaphone,
  Menu,
} from "lucide-react";
import type { User } from "@/types";

const NAV_ITEMS = {
  admin: [
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
  ],
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/advisory", label: "Advisory Class", icon: School },
    { href: "/teacher/subjects", label: "My Subjects", icon: BookOpen },
    { href: "/teacher/attendance", label: "Attendance", icon: UserCheck },
    { href: "/teacher/grades", label: "Grades", icon: BarChart3 },
    { href: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/teacher/announcements", label: "Announcements", icon: Megaphone },
  ],
  student: [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/grades", label: "Grades", icon: BarChart3 },
    { href: "/student/attendance", label: "Attendance", icon: UserCheck },
    { href: "/student/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/student/schedule", label: "Schedule", icon: BookOpen },
    { href: "/student/announcements", label: "Announcements", icon: Megaphone },
  ],
};

interface DashboardShellProps {
  user: User;
  portal: "admin" | "teacher" | "student";
  children: React.ReactNode;
}

function DashboardSidebarContent({
  user,
  portal,
  onNavigate,
}: {
  user: User;
  portal: "admin" | "teacher" | "student";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[portal];
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <Image src="/school-logo.png" alt="NVIANS Logo" width={32} height={32} className="h-8 w-auto" />
        <span className="font-semibold text-gray-900">NVIANS SMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
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

      <div className="shrink-0 border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>{user.full_name?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium text-gray-900">{user.full_name}</p>
              <p className="text-xs capitalize text-gray-500">{user.role}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { window.location.href = "/profile"; }}>
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => setIsSignOutOpen(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isSignOutOpen} onOpenChange={setIsSignOutOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Sign Out</DialogTitle>
              <DialogDescription>
                Are you sure you want to sign out? You will need to log in again to access the
                dashboard.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSignOutOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  window.location.href = "/auth/signout";
                }}
              >
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function DashboardShell({ user, portal, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 lg:flex-row">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-white px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Image src="/school-logo.png" alt="NVIANS Logo" width={28} height={28} className="h-7 w-auto" />
        <span className="truncate font-semibold text-gray-900">NVIANS SMS</span>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 max-w-[85vw] gap-0 p-0">
          <DashboardSidebarContent
            user={user}
            portal={portal}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <aside className="hidden h-screen w-64 shrink-0 border-r lg:flex">
        <DashboardSidebarContent user={user} portal={portal} />
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

/** @deprecated Use DashboardShell instead */
export function DashboardSidebar({ user, portal }: { user: User; portal: "admin" | "teacher" | "student" }) {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-white lg:flex">
      <DashboardSidebarContent user={user} portal={portal} />
    </aside>
  );
}
