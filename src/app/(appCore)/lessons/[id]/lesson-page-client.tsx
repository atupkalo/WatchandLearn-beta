"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import LessonMetaBar from "@/components/lesson-meta-bar/lesson-meta-bar";
import SlideOut from "@/components/common/slide-out";
import ButtonIcon from "@/components/ui/button-icon";
import SwitchCustom from "@/components/ui/switch";
import LessonVideoSide from "./lesson-video-side";
import LessonWorkingAreaSide from "./lesson-working-area-side";
import styles from "./lessons.module.css";
import { openSlideOut } from "@/components/Icons/icons";
import type { LessonLine } from "@/lib/lessons";

interface LessonPageClientProps {
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

function getModeLabel(mode: string) {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

export default function LessonPageClient({
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

  const tabs = useMemo(
    () =>
      availableModes.map((mode) => ({
        label: getModeLabel(mode),
        content: <div className={styles.tabPlaceholder}>{mode} working field</div>,
      })),
    [availableModes],
  );

  const workingAreaSide = (
    <LessonWorkingAreaSide
      description={description}
      tabs={tabs}
    />
  );

  const videoSide = (
    <LessonVideoSide
      title={title}
      videoSrc={videoSrc}
      lines={lines}
    />
  );

  return (
    <>
      <section className="flex h-full min-h-0 flex-col gap-6 overflow-hidden">
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
                size="sm"
                onClick={() => setIsInstructionsOpen(true)}
              />
            </>
          }
        />

        <div className={styles.lessonLayout}>
          {sidebarOnLeft ? (
            <>
              {videoSide}
              {workingAreaSide}
            </>
          ) : (
            <>
              {workingAreaSide}
              {videoSide}
            </>
          )}
        </div>
      </section>

      <SlideOut
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title={tButtons("butonLessonInstructions")}
      >
        <div className={styles.lessonInstructionPanel}>
          <h2 className={styles.lessonInstructionTitle}>
            {tButtons("butonLessonInstructions")}
          </h2>
          <div className={styles.lessonInstructionBody}>
            <p>{tLessons("instructionIntro")}</p>
            <p>{tLessons("instructionToggle")}</p>
            <p>{tLessons("instructionKey")}</p>
            <div>
              <div className={styles.lessonInstructionSubtitle}>Easy</div>
              <p>{tLessons("instructionEasy")}</p>
            </div>
            <div>
              <div className={styles.lessonInstructionSubtitle}>Medium</div>
              <p>{tLessons("instructionMedium")}</p>
            </div>
            <div>
              <div className={styles.lessonInstructionSubtitle}>Hard</div>
              <p>{tLessons("instructionHard")}</p>
            </div>
          </div>
        </div>
      </SlideOut>
    </>
  );
}
