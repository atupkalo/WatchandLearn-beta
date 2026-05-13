"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import LessonMetaBar from "@/components/lesson-meta-bar/lesson-meta-bar";
import LessonInstructions from "@/components/lesson-instructions/lesson-instructions";
import SlideOut from "@/components/common/slide-out";
import ButtonIcon from "@/components/ui/button-icon";
import SwitchCustom from "@/components/ui/switch";
import LessonVideoSide from "./lesson-video-side";
import LessonWorkingAreaSide from "./lesson-working-area-side";
import styles from "./lessons.module.css";
import { openSlideOut } from "@/components/Icons/icons";
import type { LessonLine } from "@/lib/lessons";
interface LessonPageClientProps {
  lessonId: string;
  lessonSlug: string;
  title: string;
  level: string;
  category: string;
  duration: string;
  type: string;
  description: string;
  availableModes: string[];
  videoSrc: string;
  lines: LessonLine[];
}

export default function LessonPageClient({
  lessonId,
  lessonSlug,
  title,
  level,
  category,
  duration,
  type,
  description,
  availableModes,
  videoSrc,
  lines,
}: LessonPageClientProps) {
  const tLessons = useTranslations("Lessons");
  const tButtons = useTranslations("Buttons");
  const tSwitches = useTranslations("Switches");
  const [sidebarOnLeft, setSidebarOnLeft] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const workingAreaSide = (
    <LessonWorkingAreaSide
      description={description}
      availableModes={availableModes}
      lines={lines}
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
    </>
  );
}
