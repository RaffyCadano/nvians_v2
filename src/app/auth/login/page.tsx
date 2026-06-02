import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <LoginForm showDevLogin={process.env.NODE_ENV === "development"} />;
}
