/**
 * E2E: admin UI creates mock teacher, then logs in as teacher.
 * Run: node --env-file=.env.local scripts/ui-add-mock-teacher.mjs
 *
 * Optional env:
 *   E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD (defaults below for local dev)
 */

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";

const ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL,
  password: process.env.E2E_ADMIN_PASSWORD,
};

const MOCK_TEACHER = {
  full_name: "Maria Santos",
  email: "teacher.mock@nvians.edu",
  password: "TeacherMock00!",
  employee_number: "EMP-MOCK-001",
  department: "Mathematics",
  specialization: "Algebra, Geometry",
};

async function removeExistingMockTeacher() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data } = await admin.auth.admin.listUsers();
  const user = data?.users?.find((u) => u.email === MOCK_TEACHER.email);
  if (!user) return;

  await admin.from("teachers").delete().eq("user_id", user.id);
  await admin.from("users").delete().eq("id", user.id);
  await admin.auth.admin.deleteUser(user.id);
  console.log("Removed existing mock teacher so UI can create a fresh account.");
}

async function login(page, { email, password }) {
  await page.goto(`${BASE}/auth/login`);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.getByRole("button", { name: "Sign In" }).click();
}

async function main() {
  if (!ADMIN.email || !ADMIN.password) {
    console.error("Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD (or pass via shell env).");
    process.exit(1);
  }

  await removeExistingMockTeacher();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("1. Admin login…");
    await login(page, ADMIN);
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 30_000 });
    console.log("   →", page.url());

    console.log("2. Add teacher via UI…");
    await page.goto(`${BASE}/admin/teachers/new`);
    await page.fill("#full_name", MOCK_TEACHER.full_name);
    await page.fill("#email", MOCK_TEACHER.email);
    await page.fill("#password", MOCK_TEACHER.password);
    await page.fill("#employee_number", MOCK_TEACHER.employee_number);
    await page.fill("#department", MOCK_TEACHER.department);
    await page.fill("#specialization", MOCK_TEACHER.specialization);
    await page.getByRole("button", { name: "Create Teacher" }).click();
    await page.waitForURL(/\/admin\/teachers\/?$/, { timeout: 30_000 });
    console.log("   → Teacher list:", page.url());

    console.log("3. Sign out…");
    await page.goto(`${BASE}/auth/signout`);
    await page.waitForURL(/\/auth\/login/, { timeout: 15_000 });

    console.log("4. Teacher login…");
    await login(page, {
      email: MOCK_TEACHER.email,
      password: MOCK_TEACHER.password,
    });
    await page.waitForTimeout(3000);
    const finalUrl = page.url();
    const loginError = await page.locator(".text-red-600").first().textContent().catch(() => null);
    if (loginError) {
      throw new Error(`Login error on page: ${loginError.trim()}`);
    }
    if (/\/student\/dashboard/.test(finalUrl)) {
      throw new Error(
        "Landed on student dashboard — users.role is likely still 'student'. Check createTeacher / DB trigger."
      );
    }
    if (!/\/teacher\/dashboard/.test(finalUrl)) {
      throw new Error(`Expected /teacher/dashboard but got: ${finalUrl}`);
    }
    console.log("   →", finalUrl);

    const heading = await page.locator("h1").first().textContent();
    console.log("\nSuccess. Teacher dashboard loaded:", heading?.trim() || "(no h1)");
    console.log("Mock teacher:", MOCK_TEACHER.email, "/", MOCK_TEACHER.password);
  } catch (err) {
    console.error("\nFailed:", err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
