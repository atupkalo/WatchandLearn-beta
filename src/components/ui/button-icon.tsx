import type { ReactNode } from "react";
import { Button } from "@heroui/react";
import styles from "./ui.module.css";

interface ButtonIconProps {
  icon: ReactNode;
  label: string;
  size: "sm" | "lg";
  onClick?: () => void;
}

export default function ButtonIcon({
  icon,
  label,
  size,
  onClick,
}: ButtonIconProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`${styles.buttonIcon} ${
        size === "sm" ? styles.buttonIconSmall : styles.buttonIconLarge
      }`}
    >
      <span
        className={`${styles.buttonIconLabel} font-semibold text-[var(--secondary)]`}
      >
        {label}
      </span>
      <span
        className={`${styles.buttonIconGlyph} text-[var(--secondary)]`}
        aria-hidden="true"
      >
        {icon}
      </span>
    </Button>
  );
}
