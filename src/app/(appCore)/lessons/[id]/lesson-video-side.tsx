"use client";

import { Eye } from "@gravity-ui/icons";
import { useTranslations } from "next-intl";
import LessonKeyPopover from "@/components/lesson-key-popover/lesson-key-popover";
import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import ButtonTrigger from "@/components/ui/button-trigger";
import Iframe from "@/components/ui/iframe";
import PopoverCustom from "@/components/ui/popover";
import type { LessonLine } from "@/lib/lessons";
import styles from "./lessons.module.css";

interface LessonVideoSideProps {
  lessonId: string;
  lessonSlug: string;
  title: string;
  videoSrc: string;
  lines: LessonLine[];
}

export default function LessonVideoSide({
  lessonId,
  lessonSlug,
  title,
  videoSrc,
  lines,
}: LessonVideoSideProps) {
  const tLessons = useTranslations("Lessons");
  const { studyLanguage } = useUserPreferences();
  const translationKey = studyLanguage === "en-ru" ? "ru" : "ua";

  return (
    <div className={styles.lessonVideoSide}>
      <div className={styles.video}>
        <Iframe src={videoSrc} title={title} />
      </div>

      <div className={styles.lessonKeysSection}>
        <div className={styles.lessonKeysTitle}>
          {tLessons("lessonKeyTitle")}
        </div>
        <div className={styles.lessonKeysList}>
          {lines.map((line) => (
            <PopoverCustom
              key={line.lineNumber}
              trigger={
                <ButtonTrigger
                  label={`${tLessons("lineLabel")} ${line.lineNumber}`}
                  icon={<Eye />}
                  size="md"
                />
              }
              content={
                <LessonKeyPopover
                  lessonId={lessonId}
                  lessonSlug={lessonSlug}
                  line={line}
                  translation={line.translations[translationKey] ?? "-"}
                  takeaways={line.takeaways[translationKey]}
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
