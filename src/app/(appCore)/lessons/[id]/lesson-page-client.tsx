"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import LessonMetaBar from "@/components/lesson-meta-bar/lesson-meta-bar";
import InstructionSteps from "@/components/instruction-steps/instruction-steps";
import LessonInstructions from "@/components/lesson-instructions/lesson-instructions";
import SlideOut from "@/components/common/slide-out";
import ButtonIcon from "@/components/ui/button-icon";
import SwitchCustom from "@/components/ui/switch";
import LessonVideoSide from "./lesson-video-side";
import LessonWorkingAreaSide from "./lesson-working-area-side";
import styles from "./lessons.module.css";
import { openSlideOut } from "@/components/Icons/icons";
import type { LessonLine, LessonSayItQuote } from "@/lib/lessons";

const LESSON_INSTRUCTIONS_SEEN_KEY = "watchandlearn:lesson-instructions:seen";
const LESSON_INSTRUCTIONS_DISABLED_KEY = "watchandlearn:lesson-instructions:disabled";

function getInstructionStorageKey(baseKey: string, userId: string | null) {
  return `${baseKey}:${userId ?? "guest"}`;
}

interface LessonPageClientProps {
  lessonId: string;
  lessonSlug: string;
  userId: string | null;
  title: string;
  level: string;
  category: string[];
  duration: string;
  type: string[];
  description: string;
  availableModes: string[];
  videoSrc: string;
  lines: LessonLine[];
  sayIt?: LessonSayItQuote[];
}

export default function LessonPageClient({
  lessonId,
  lessonSlug,
  userId,
  title,
  level,
  category,
  duration,
  type,
  description,
  availableModes,
  videoSrc,
  lines,
  sayIt = [],
}: LessonPageClientProps) {
  const tLessons = useTranslations("Lessons");
  const tButtons = useTranslations("Buttons");
  const tLessonInstructions = useTranslations("LessonInstructions");
  const tSwitches = useTranslations("Switches");
  const [sidebarOnLeft, setSidebarOnLeft] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isLessonIntroOpen, setIsLessonIntroOpen] = useState(false);
  const seenKey = getInstructionStorageKey(LESSON_INSTRUCTIONS_SEEN_KEY, userId);
  const disabledKey = getInstructionStorageKey(
    LESSON_INSTRUCTIONS_DISABLED_KEY,
    userId,
  );

  const lessonInstructionSteps = [
    {
      title: tLessonInstructions("step1Title"),
      body: tLessonInstructions("step1Body"),
      image: "/lesson-steps/step-1.svg",
    },
    {
      title: tLessonInstructions("step2Title"),
      body: tLessonInstructions("step2Body"),
      image: "/lesson-steps/step-2.svg",
    },
    {
      title: tLessonInstructions("step3Title"),
      body: tLessonInstructions("step3Body"),
      image: "/lesson-steps/step-3.svg",
    },
    {
      title: tLessonInstructions("step4Title"),
      body: tLessonInstructions("step4Body"),
      image: "/lesson-steps/step-4.svg",
    },
    {
      title: tLessonInstructions("step5Title"),
      body: tLessonInstructions("step5Body"),
      image: "/lesson-steps/step-5.svg",
    },
    {
      title: tLessonInstructions("step6Title"),
      body: tLessonInstructions("step6Body"),
      image: "/lesson-steps/step-6.svg",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frameId: number | null = null;
    const openLessonInstructions = () => {
      frameId = window.requestAnimationFrame(() => {
        setIsLessonIntroOpen(true);
      });
    };

    try {
      const instructionsDisabled =
        window.localStorage.getItem(disabledKey) === "true";

      if (instructionsDisabled) {
        return;
      }

      const rawSeenLessons = window.localStorage.getItem(seenKey);
      const seenLessons = rawSeenLessons ? JSON.parse(rawSeenLessons) : [];
      const hasSeenLessonInstructions =
        Array.isArray(seenLessons) && seenLessons.includes(lessonId);

      if (!hasSeenLessonInstructions) {
        openLessonInstructions();
      }
    } catch {
      openLessonInstructions();
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [disabledKey, lessonId, seenKey]);

  const markLessonInstructionsSeen = () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawSeenLessons = window.localStorage.getItem(seenKey);
      const seenLessons = rawSeenLessons ? JSON.parse(rawSeenLessons) : [];
      const normalizedSeenLessons = Array.isArray(seenLessons) ? seenLessons : [];

      if (!normalizedSeenLessons.includes(lessonId)) {
        window.localStorage.setItem(
          seenKey,
          JSON.stringify([...normalizedSeenLessons, lessonId]),
        );
      }
    } catch {
      window.localStorage.setItem(seenKey, JSON.stringify([lessonId]));
    }
  };

  const handleStartLesson = () => {
    markLessonInstructionsSeen();
    setIsLessonIntroOpen(false);
  };

  const handleSkipInstructionsForever = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(disabledKey, "true");
    }

    markLessonInstructionsSeen();
    setIsLessonIntroOpen(false);
  };

  const workingAreaSide = (
    <LessonWorkingAreaSide
      lessonId={lessonId}
      userId={userId}
      description={description}
      availableModes={availableModes}
      lines={lines}
      sayIt={sayIt}
    />
  );

  const videoSide = (
    <LessonVideoSide
      lessonId={lessonId}
      lessonSlug={lessonSlug}
      title={title}
      videoSrc={videoSrc}
      lines={lines}
    />
  );

  return (
    <>
      <section className={styles.lessonPage}>
        <LessonMetaBar
          title={title}
          level={level}
          category={category}
          duration={duration}
          type={type}
          rightControls={
            <>
              <SwitchCustom
                label={tSwitches("sLessonLable")}
                isSelected={sidebarOnLeft}
                onChange={setSidebarOnLeft}
              />
              <ButtonIcon
                label={tButtons("butonLessonInstructions")}
                icon={<HugeiconsIcon icon={openSlideOut} size={18} strokeWidth={1.6} />}
                size="lg"
                onClick={() => setIsInstructionsOpen(true)}
              />
            </>
          }
        />

        <div className={styles.lessonLayout}>
          {sidebarOnLeft ? (
            <>
              <div className={styles.lessonColumn}>{videoSide}</div>
              <div className={styles.lessonColumn}>{workingAreaSide}</div>
            </>
          ) : (
            <>
              <div className={styles.lessonColumn}>{workingAreaSide}</div>
              <div className={styles.lessonColumn}>{videoSide}</div>
            </>
          )}
        </div>
      </section>

      <SlideOut
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title={tLessons("slideOutTitle")}
      >
        <LessonInstructions />
      </SlideOut>

      <InstructionSteps
        isOpen={isLessonIntroOpen}
        steps={lessonInstructionSteps}
        onSkip={handleSkipInstructionsForever}
        onStart={handleStartLesson}
      />
    </>
  );
}
