import { useState, type ReactNode } from "react";
import { ChevronDown } from "@gravity-ui/icons";
import styles from "./ui.module.css";

interface AccordionSquareProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export default function AccordionSquare({
  title,
  children,
  defaultOpen = false,
  disabled = false,
}: AccordionSquareProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`${styles.accordionSquare} ${
        isOpen ? styles.accordionSquareOpen : ""
      } ${disabled ? styles.accordionSquareDisabled : ""}`}
    >
      <button
        type="button"
        className={styles.accordionSquareSummary}
        onClick={() => {
          if (!disabled) {
            setIsOpen((current) => !current);
          }
        }}
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span>{title}</span>
        <span className={styles.accordionSquareChevron} aria-hidden="true">
          <ChevronDown />
        </span>
      </button>
      <div className={styles.accordionSquarePanel}>
        <div className={styles.accordionSquareBody}>{children}</div>
      </div>
    </div>
  );
}
