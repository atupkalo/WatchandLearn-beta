import styles from "./ui.module.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { Circle, CircleSolid } from "../Icons/icons";

interface DropWordProps {
  word: string;
  status?: "default" | "success" | "error";
  onClick?: (word: string) => void;
  disabled?: boolean;
}

export default function DropWord({
  word,
  status = "default",
  onClick,
  disabled = false,
}: DropWordProps) {
  const statusClassName =
    status === "success"
      ? styles.dropWordSuccess
      : status === "error"
        ? styles.dropWordError
        : styles.dropWordDefault;
  const iconClassName =
    status === "success"
      ? styles.dropWordIconSuccess
      : status === "error"
        ? styles.dropWordIconError
        : styles.dropWordIconDefault;

  return (
    <button
      type="button"
      onClick={() => onClick?.(word)}
      disabled={disabled}
      className={`${styles.dropWord} ${statusClassName}`.trim()}
    >
      <HugeiconsIcon
        icon={status === "default" ? Circle : CircleSolid}
        className={`${styles.dropWordIcon} ${iconClassName}`.trim()}
        size={14}
        strokeWidth={1.8}
      />
      {word}
    </button>
  );
}
