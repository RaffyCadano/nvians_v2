/** Grade levels supported by the school management system (Junior + Senior High). */
export const ALLOWED_GRADE_LEVELS = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const;

export type AllowedGradeLevel = (typeof ALLOWED_GRADE_LEVELS)[number];

export function isAllowedGradeLevel(value: string): value is AllowedGradeLevel {
  return (ALLOWED_GRADE_LEVELS as readonly string[]).includes(value);
}
