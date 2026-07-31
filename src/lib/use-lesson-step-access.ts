"use client";

import { useMemo } from "react";
import {
  isPremiumLessonStep,
  lessonPracticeStepOrder,
  type AccountTier,
  type LessonPracticeStepId,
} from "@/lib/lesson-practice";

interface UseLessonStepAccessProps {
  accountTier?: AccountTier;
  enforcePremiumGate?: boolean;
  hasAdvancedPractice?: boolean;
}

export function useLessonStepAccess({
  accountTier = "free",
  enforcePremiumGate = false,
  hasAdvancedPractice = true,
}: UseLessonStepAccessProps = {}) {
  return useMemo(() => {
    const stepOrder = hasAdvancedPractice
      ? lessonPracticeStepOrder
      : lessonPracticeStepOrder.slice(0, 3);
    const premiumUnlocked =
      !enforcePremiumGate ||
      accountTier === "premium" ||
      accountTier === "vip" ||
      accountTier === "admin";

    return {
      accountTier,
      enforcePremiumGate,
      premiumUnlocked,
      stepOrder,
      showPremiumUpsellAfterHard:
        enforcePremiumGate && accountTier === "free" && hasAdvancedPractice,
      isStepLocked(stepId: LessonPracticeStepId) {
        return isPremiumLessonStep(stepId) && !premiumUnlocked;
      },
      getNextStep(stepId: LessonPracticeStepId) {
        const currentIndex = stepOrder.indexOf(stepId);

        if (currentIndex === -1) {
          return null;
        }

        return stepOrder[currentIndex + 1] ?? null;
      },
    };
  }, [accountTier, enforcePremiumGate, hasAdvancedPractice]);
}
