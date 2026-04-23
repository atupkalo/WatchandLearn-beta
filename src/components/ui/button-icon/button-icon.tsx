import type { ReactNode } from "react";
import { Button } from "@heroui/react";
import styles from "./button-icon.module.css";

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
        size === "sm" ? styles.small : styles.large
      }`}
    >
      <span
        className={`${styles.label} font-semibold text-[var(--secondary)]`}
      >
        {label}
      </span>
      <span
        className={`${styles.icon} text-[var(--secondary)]`}
        aria-hidden="true"
      >
        {icon}
      </span>
    </Button>
  );
}
