"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cross } from "@/components/Icons/icons";
import styles from "./slide-out.module.css";

interface SlideOutProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideOut({
  isOpen,
  onClose,
  children,
}: SlideOutProps) {
  return (
    <div className={`${styles.root} ${isOpen ? styles.open : ""}`}>
      <aside
        className={`${styles.panel} ${
          isOpen ? styles.panelOpen : styles.panelClosed
        }`}
        aria-hidden={!isOpen}
        aria-label="User account panel"
      >
        <div className={styles.closeRow}>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close panel"
          >
            <HugeiconsIcon icon={Cross} size={18} strokeWidth={1.6} />
          </button>
        </div>
        {children}
      </aside>
    </div>
  )
} 
