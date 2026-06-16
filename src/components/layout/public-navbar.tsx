"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/student-life", label: "Student Life" },
  { href: "/facilities", label: "Facilities" },
  { href: "/news", label: "News & Events" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/forgot-password";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/school-logo.png" alt="NVIANS Logo" width={36} height={36} className="h-9 w-auto" />
          <span className="font-bold text-gray-900">NVIANS</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {!isAuthPage && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/admissions">Apply Now</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex h-full w-full max-w-xs flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-b px-4 py-4 text-left">
            <div className="flex items-center gap-2 pr-8">
              <Image src="/school-logo.png" alt="NVIANS Logo" width={32} height={32} className="h-8 w-auto" />
              <SheetTitle className="text-base font-bold text-gray-900">NVIANS</SheetTitle>
            </div>
          </SheetHeader>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t px-4 py-4">
            <div className="flex flex-col gap-2">
              {!isAuthPage && (
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" className="w-full">
                <Link href="/admissions" onClick={() => setOpen(false)}>
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
