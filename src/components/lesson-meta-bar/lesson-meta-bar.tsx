"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import TopBar from "../ui/top-bar";
import styles from "./lesson-meta-bar.module.css";

interface LessonMetaBarProps {
  title: string;
  level: string;
  category: string[];
  duration: string;
  type: string[];
  rightControls?: ReactNode;
}

function translateOptionLabel(
  t: ReturnType<typeof useTranslations>,
  key: string,
  fallback: string,
) {
  try {
    return t(key);
  } catch {
    return fallback;
  }
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
  const categoryLabel = category
    .map((item) => translateOptionLabel(t, `options.categories.${item}`, item))
    .join(", ");
  const typeLabel = type
    .map((item) => translateOptionLabel(t, `options.types.${item}`, item))
    .join(", ");

  const items = [
    {
      label: t("labels.level"),
      value: translateOptionLabel(t, `options.levels.${level}`, level),
    },
    { label: t("labels.category"), value: categoryLabel },
    {
      label: t("labels.duration"),
      value: translateOptionLabel(t, `options.durations.${duration}`, duration),
    },
    { label: t("labels.type"), value: typeLabel },
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
