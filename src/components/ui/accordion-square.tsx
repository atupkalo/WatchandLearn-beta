import { useState, type ReactNode } from "react";
import { ChevronDown } from "@gravity-ui/icons";
import styles from "./ui.module.css";

interface AccordionSquareProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSquare({
  title,
  children,
  defaultOpen = false,
}: AccordionSquareProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${styles.accordionSquare} ${isOpen ? styles.accordionSquareOpen : ""}`}>
      <button
        type="button"
        className={styles.accordionSquareSummary}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
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
