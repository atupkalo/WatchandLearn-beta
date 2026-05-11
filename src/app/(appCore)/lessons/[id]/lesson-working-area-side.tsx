import AccordionSquare from "@/components/ui/accordion-square";
import { TabsCustom } from "@/components/ui/tabs";
import styles from "./lessons.module.css";

interface LessonWorkingAreaSideProps {
  description: string;
  tabs: Array<{
    label: string;
    content: React.ReactNode;
  }>;
}

export default function LessonWorkingAreaSide({
  description,
  tabs,
}: LessonWorkingAreaSideProps) {
  return (
    <div className={styles.lessonWorkingAreaSide}>
      <AccordionSquare title="Lesson Description">
        <div className={styles.lessonDescriptionText}>{description}</div>
      </AccordionSquare>

      <div className={styles.lessonWorkArea}>
        <TabsCustom tabs={tabs} />
      </div>
    </div>
  );
}
