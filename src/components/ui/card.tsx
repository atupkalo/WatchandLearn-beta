import type { ReactNode } from "react";
import styles from "./ui.module.css";

interface CardProps {
  direction?: "row" | "column";
  children?: ReactNode;
  className?: string;
}

export default function Card({
  direction = "column",
  children,
  className = "",
}: CardProps) {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";

  return (
    <div className={`${styles.card} flex ${directionClass} justify-start ${className}`}>
      {children}
    </div>
  );
}
