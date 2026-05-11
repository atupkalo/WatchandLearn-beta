"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import TopBar from "../ui/top-bar";
import styles from "./lesson-meta-bar.module.css";

interface LessonMetaBarProps {
  title: string;
  level: string;
  category: string;
  duration: string;
  type: string;
  rightControls?: ReactNode;
}

export default function LessonMetaBar({
  title,
  level,
  category,
  duration,
  type,
  rightControls,
}: LessonMetaBarProps) {
  const t = useTranslations("Lessons");

  const items = [
    { label: t("labels.level"), value: t(`options.levels.${level}`) },
    { label: t("labels.category"), value: t(`options.categories.${category}`) },
    { label: t("labels.duration"), value: t(`options.durations.${duration}`) },
    { label: t("labels.type"), value: t(`options.types.${type}`) },
  ];

  return (
    <TopBar>
      <div className={styles.metaBarLayout}>
        <div className={styles.titleAndMeta}>
          <div className={styles.lessonTitle}>{title}</div>
          <div className={styles.metaItems}>
            {items.map((item) => (
              <div key={item.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{item.label}:</span>
                <span className={styles.metaValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightControls}>
          {rightControls}
        </div>
      </div>
    </TopBar>
  );
}
