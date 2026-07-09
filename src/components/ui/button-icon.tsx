import type { ReactNode } from "react";
import { Button } from "@heroui/react";
import styles from "./ui.module.css";

interface ButtonIconProps {
  icon: ReactNode;
  label: string;
  size: "sm" | "lg";
  iconPosition?: "left" | "right";
  onClick?: () => void;
  disabled?: boolean;
  color?: "secondary" | "accent";
}

export default function ButtonIcon({
  icon,
  label,
  size,
  iconPosition = "right",
  onClick,
  disabled = false,
  color = "secondary",
}: ButtonIconProps) {
  const colorClass =
    color === "accent" ? "text-[var(--accent)]" : "text-[var(--secondary)]";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      isDisabled={disabled}
      className={`${styles.buttonIcon} ${
        size === "sm" ? styles.buttonIconSmall : styles.buttonIconLarge
      }`}
    >
      {iconPosition === "left" ? (
        <>
          <span className={`${styles.buttonIconGlyph} ${colorClass}`} aria-hidden="true">
            {icon}
          </span>
          <span className={`${styles.buttonIconLabel} font-semibold ${colorClass}`}>
            {label}
          </span>
        </>
      ) : (
        <>
          <span className={`${styles.buttonIconLabel} font-semibold ${colorClass}`}>
            {label}
          </span>
          <span className={`${styles.buttonIconGlyph} ${colorClass}`} aria-hidden="true">
            {icon}
          </span>
        </>
      )}
    </Button>
  );
}
