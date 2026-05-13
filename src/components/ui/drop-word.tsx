import styles from "./ui.module.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDots } from "../Icons/icons";

interface DropWordProps {
  word: string;
  onDragStart?: (
    e: React.DragEvent<HTMLButtonElement>,
    word: string
  ) => void;
}

export default function DropWord({
  word,
  onDragStart,
}: DropWordProps) {
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => onDragStart?.(e, word)}
      className={styles.dropWord}
    >
      {word}

      <HugeiconsIcon
        icon={DragDots}
        className={styles.dragIcon}
      />
    </button>
  );
}