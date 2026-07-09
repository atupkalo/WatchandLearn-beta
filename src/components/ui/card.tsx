import type { ReactNode } from "react";
import styles from "./ui.module.css";

interface CardProps {
  direction?: "row" | "column";
  children?: ReactNode;
  className?: string;
  variant?: "default" | "noHover";
}

export default function Card({
  direction = "column",
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";
  const surfaceClass =
    variant === "noHover" ? styles.cardNoHover : styles.card;

  return (
    <div className={`${surfaceClass} flex ${directionClass} justify-start ${className}`}>
      {children}
    </div>
  );
}
