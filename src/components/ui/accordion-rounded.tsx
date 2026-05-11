import { useState, type ReactNode } from "react";
import { ChevronDown } from "@gravity-ui/icons";
import styles from "./ui.module.css";

interface AccordionRoundedProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionRounded({
  title,
  children,
  defaultOpen = false,
}: AccordionRoundedProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${styles.accordionRounded} ${isOpen ? styles.accordionRoundedOpen : ""}`}>
      <button
        type="button"
        className={styles.accordionRoundedSummary}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className={styles.accordionRoundedChevron} aria-hidden="true">
          <ChevronDown />
        </span>
      </button>

      <div className={styles.accordionRoundedPanel}>
        <div className={styles.accordionRoundedBody}>{children}</div>
      </div>
    </div>
  );
}
