import { Eye } from "@gravity-ui/icons";
import LessonKeyPopover from "@/components/lesson-key-popover/lesson-key-popover";
import ButtonTrigger from "@/components/ui/button-trigger";
import Iframe from "@/components/ui/iframe";
import PopoverCustom from "@/components/ui/popover";
import type { LessonLine } from "@/lib/lessons";
import styles from "./lessons.module.css";

interface LessonVideoSideProps {
  title: string;
  videoSrc: string;
  lines: LessonLine[];
}

export default function LessonVideoSide({
  title,
  videoSrc,
  lines,
}: LessonVideoSideProps) {
  return (
    <div className={styles.lessonVideoSide}>
      <div className={styles.video}>
        <Iframe src={videoSrc} title={title} />
      </div>

      <div className={styles.lessonKeysSection}>
        <div className={styles.lessonKeysTitle}>Lessons Key</div>
        <div className={styles.lessonKeysList}>
          {lines.map((line) => (
            <PopoverCustom 
              key={line.lineNumber}
              trigger={
                <ButtonTrigger
                  label={`Line ${line.lineNumber}`}
                  icon={<Eye />}
                  size="md"
                />
              }
              content={
                <LessonKeyPopover
                  script={line.text}
                  translation={line.translations.ua ?? "-"}
                  takeaways={line.takeaways.ua}
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
