"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cross } from "@/components/Icons/icons";
import styles from "./common.module.css";

interface SlideOutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlideOut({
  isOpen,
  onClose,
  title,
  children,
}: SlideOutProps) {
  return (
    <aside
      className={`${styles.slideOut} ${isOpen ? styles.slideOutOpen : styles.slideOutClosed}`}
      aria-label={title}
    >
      <div className={styles.slideOutHeader}>
        <div className={styles.slideOutTitle}>{title}</div>
        <button
          type="button"
          onClick={onClose}
          className={styles.slideOutCloseButton}
          aria-label="Close panel"
        >
          <HugeiconsIcon icon={Cross} size={18} strokeWidth={1.6} />
        </button>
      </div>
      <div className={styles.slideOutContent}>{children}</div>
    </aside>
  );
}
