import fs from "fs";
import path from "path";

const files = [
  "src/app/admin/attendance/[id]/page.tsx",
  "src/app/admin/cms/page.tsx",
  "src/app/teacher/assignments/page.tsx",
  "src/app/teacher/attendance/page.tsx",
  "src/app/student/assignments/page.tsx",
  "src/app/student/attendance/page.tsx",
  "src/app/admin/grades/page.tsx",
  "src/app/admin/attendance/page.tsx",
  "src/app/student/grades/page.tsx",
  "src/app/teacher/advisory/page.tsx",
  "src/app/admin/classes/[id]/subjects/client.tsx",
  "src/app/admin/enrollment/client.tsx",
];

const root = process.cwd();
const open = '<table className="w-full text-sm">';
const wrappedOpen =
  '<div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">';

for (const f of files) {
  const p = path.join(root, f);
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes(open)) {
    console.log("skip (no table):", f);
    continue;
  }
  if (/overflow-x-auto[\s\S]{0,120}<table/.test(s)) {
    console.log("skip (already wrapped):", f);
    continue;
  }
  s = s.split(open).join(wrappedOpen);
  s = s.replace(/<\/table>/g, "</table></div>");
  fs.writeFileSync(p, s);
  console.log("wrapped:", f);
}
