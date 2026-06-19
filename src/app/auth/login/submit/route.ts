import { handleLoginPost } from "@/lib/auth/login-handler";

export async function POST(request: Request) {
  return handleLoginPost(request);
}
