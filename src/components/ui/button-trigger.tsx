import type { ReactNode } from "react";
import { Button } from "@heroui/react";
import styles from "./ui.module.css";

interface ButtonTriggerProps {
  label: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export default function ButtonTrigger({
  label,
  icon,
  size = "md",
  onClick,
}: ButtonTriggerProps) {
  const sizeClass =
    size === "sm"
      ? styles.buttonTriggerSmall
      : size === "lg"
        ? styles.buttonTriggerLarge
        : styles.buttonTriggerMedium;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`${styles.buttonTrigger} ${sizeClass}`}
    >
      {icon ? (
        <span className={styles.buttonTriggerIcon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.buttonTriggerLabel}>{label}</span>
    </Button>
  );
}
