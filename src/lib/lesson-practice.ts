export type LessonPracticeStepId =
  | "easy"
  | "medium"
  | "hard"
  | "say-it"
  | "translate-it";

export type AccountTier = "free" | "premium" | "vip" | "admin";

export const lessonPracticeStepOrder: LessonPracticeStepId[] = [
  "easy",
  "medium",
  "hard",
  "say-it",
  "translate-it",
];

export function isPremiumLessonStep(stepId: LessonPracticeStepId) {
  return stepId === "say-it" || stepId === "translate-it";
}
