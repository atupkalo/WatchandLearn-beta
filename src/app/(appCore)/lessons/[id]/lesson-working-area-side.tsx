import AccordionSquare from "@/components/ui/accordion-square";
import LessonExercise from "@/components/lesson-exercise/lesson-exercise";
import type { LessonLine } from "@/lib/lessons";
import { useTranslations } from "next-intl";
import styles from "./lessons.module.css";

interface LessonWorkingAreaSideProps {
  description: string;
  availableModes: string[];
  lines: LessonLine[];
}

export default function LessonWorkingAreaSide({
  description,
  availableModes,
  lines,
}: LessonWorkingAreaSideProps) {
  const tLessons = useTranslations("Lessons");

  return (
    <div className={styles.lessonWorkingAreaSide}>
      <AccordionSquare title={tLessons("lessonDescriptionTitle")}>
        <div className={styles.lessonDescriptionText}>{description}</div>
      </AccordionSquare>

      <div className={styles.lessonWorkArea}>
        <LessonExercise availableModes={availableModes} lines={lines} />
      </div>
    </div>
  );
}
