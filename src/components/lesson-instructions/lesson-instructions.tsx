"use client";

import { useTranslations } from "next-intl";
import styles from "./lesson-instructions.module.css";

export default function LessonInstructions() {
  const tLessons = useTranslations("Lessons");

  return (
    <div className={styles.lessonInstructions}>
      <div className={styles.lessonInstructionsSection}>
        <div className={styles.lessonInstructionsTitle}>
          {tLessons("levelLow")}
        </div>
        <div>{tLessons("levelLowDesc")}</div>
      </div>

      <div className={styles.lessonInstructionsSection}>
        <div className={styles.lessonInstructionsTitle}>
          {tLessons("levelMedium")}
        </div>
        <div>{tLessons("levelMediumDesc")}</div>
      </div>

      <div className={styles.lessonInstructionsSection}>
        <div className={styles.lessonInstructionsTitle}>
          {tLessons("levelHigh")}
        </div>
        <div>{tLessons("levelHighDesc")}</div>
      </div>

      <div className={styles.lessonInstructionsSection}>
        <div className={styles.lessonInstructionsTitle}>
          {tLessons("stepsTitle")}
        </div>
        <ul className={styles.stepsList}>
          <li>{tLessons("step1")}</li>
          <li>{tLessons("step2")}</li>
          <li>{tLessons("step3")}</li>
          <li>{tLessons("step4")}</li>
        </ul>
      </div>

      <div className={styles.lessonInstructionsSection}>
        <div className={styles.lessonInstructionsTitle}>
          {tLessons("note")}
        </div>
        <div>{tLessons("noteDesc")}</div>
      </div>
    </div>
  );
}
