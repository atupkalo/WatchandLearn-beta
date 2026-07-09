import AccordionSquare from "@/components/ui/accordion-square";
import LessonExercise from "@/components/lesson-exercise/lesson-exercise";
import type { LessonLine, LessonSayItQuote } from "@/lib/lessons";
import { useTranslations } from "next-intl";
import styles from "./lessons.module.css";

interface LessonWorkingAreaSideProps {
  lessonId: string;
  userId: string | null;
  description: string;
  availableModes: string[];
  lines: LessonLine[];
  sayIt?: LessonSayItQuote[];
}

export default function LessonWorkingAreaSide({
  lessonId,
  userId,
  description,
  availableModes,
  lines,
  sayIt = [],
}: LessonWorkingAreaSideProps) {
  const tLessons = useTranslations("Lessons");

  return (
    <div className={styles.lessonWorkingAreaSide}>
      <AccordionSquare title={tLessons("lessonDescriptionTitle")}>
        <div className={styles.lessonDescriptionText}>{description}</div>
      </AccordionSquare>

      <div className={styles.lessonWorkArea}>
        <LessonExercise
          lessonId={lessonId}
          userId={userId}
          availableModes={availableModes}
          lines={lines}
          sayIt={sayIt}
        />
      </div>
    </div>
  );
}
