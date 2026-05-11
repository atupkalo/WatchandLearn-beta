"use client";

import Card from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./lesson-card-item.module.css";

interface LessonCardItemProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  level: string;
  category: string;
  duration: string;
  type: string;
  description: string;
}

export default function LessonCardItem({
  id,
  title,
  thumbnailUrl,
  level,
  category,
  duration,
  type,
}: LessonCardItemProps) {
  const t = useTranslations("Lessons");

  return (
    <Link href={`/lessons/${id}`} className="block">
      <Card className={styles.itemCard}>
        <div className={styles.thumbnailWrap}>
          <Image
            src={thumbnailUrl}
            alt={`Thumbnail for ${title}`}
            width={1200}
            height={675}
            className={styles.thumbnailImage}
          />
        </div>

        <div className={styles.contentWrap}>
          <div className={styles.itemTitle}>{title}</div>
          <div className={styles.itemMetaGrid}>
            <div className={styles.itemContent}>
              <span className={styles.itemLabel}>{t("labels.level")}:</span>
              <span>{t(`options.levels.${level}`)}</span>
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemLabel}>{t("labels.category")}:</span>
              <span>{t(`options.categories.${category}`)}</span>
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemLabel}>{t("labels.duration")}:</span>
              <span>{t(`options.durations.${duration}`)}</span>
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemLabel}>{t("labels.type")}:</span>
              <span>{t(`options.types.${type}`)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
