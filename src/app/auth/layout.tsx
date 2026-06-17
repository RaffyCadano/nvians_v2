import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import "./auth-forms.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <div className="hidden sm:block">
        <PublicFooter />
      </div>
    </div>
  );
}
