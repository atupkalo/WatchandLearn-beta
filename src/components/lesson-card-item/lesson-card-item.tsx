"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HeartSolid,
  HeartStroke,
} from "@/components/Icons/icons";
import Card from "@/components/ui/card";
import {
  INITIAL_LESSON_STATE,
  LESSON_STATE_UPDATED_EVENT,
  getLocalLessonLikeSnapshot,
  getLessonStateSnapshot,
  storeLocalLessonLikeSnapshot,
  toggleLocalLessonLike,
  type LessonListStatus,
} from "@/lib/lesson-state";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./lesson-card-item.module.css";

interface LessonCardItemProps {
  id: string;
  userId: string | null;
  title: string;
  thumbnailUrl: string;
  level: string;
  category: string[];
  duration: string;
  type: string[];
  description: string;
}

export default function LessonCardItem({
  id,
  userId,
  title,
  thumbnailUrl,
  level,
  category,
  duration,
  type,
}: LessonCardItemProps) {
  const t = useTranslations("Lessons");
  const [lessonState, setLessonState] = useState(INITIAL_LESSON_STATE);
  const [isLikePending, setIsLikePending] = useState(false);
  const categoryLabel = category.map((item) => t(`options.categories.${item}`)).join(", ");
  const typeLabel = type.map((item) => t(`options.types.${item}`)).join(", ");
  const statusConfigMap: Record<
    LessonListStatus,
    {
      label: string;
      className: string;
    }
  > = {
    completed: {
      label: t("cardStatusCompleted"),
      className: styles.statusCompleted,
    },
    "not-started": {
      label: t("cardStatusNotStarted"),
      className: styles.statusNotStarted,
    },
    started: {
      label: t("cardStatusStarted"),
      className: styles.statusStarted,
    },
  };
  const statusConfig = statusConfigMap[lessonState.status];

  useEffect(() => {
    const syncState = () => {
      setLessonState(getLessonStateSnapshot(userId, id));
    };

    const applyLikeSnapshot = (snapshot: {
      likeCount: number;
      liked: boolean;
    }) => {
      storeLocalLessonLikeSnapshot(userId, id, snapshot);
      setLessonState((current) => ({
        ...current,
        likeCount: snapshot.likeCount,
        liked: snapshot.liked,
      }));
    };

    const syncLikes = async () => {
      try {
        const response = await fetch(
          `/api/lesson-likes?lessonId=${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          applyLikeSnapshot(getLocalLessonLikeSnapshot(userId, id));
          return;
        }

        const payload = (await response.json()) as {
          snapshots?: Record<
            string,
            {
              likeCount: number;
              liked: boolean;
            }
          >;
        };
        const snapshot = payload.snapshots?.[id];

        if (!snapshot) {
          return;
        }

        applyLikeSnapshot(snapshot);
      } catch {
        applyLikeSnapshot(getLocalLessonLikeSnapshot(userId, id));
      }
    };

    syncState();
    void syncLikes();

    const handleStateUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ lessonId?: string }>).detail;

      if (detail?.lessonId && detail.lessonId !== id) {
        return;
      }

      syncState();
    };

    window.addEventListener(LESSON_STATE_UPDATED_EVENT, handleStateUpdate);
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener(LESSON_STATE_UPDATED_EVENT, handleStateUpdate);
      window.removeEventListener("storage", syncState);
    };
  }, [id, userId]);

  return (
    <Card variant="noHover" className={styles.lessonCard}>
      <div className={styles.topControls}>
        <div className={styles.statusBar}>
          <span className={styles.statusLabel}>{t("cardStatusLabel")}:</span>
          <span className={`${styles.statusValue} ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className={styles.likesShell}>
          <button
            type="button"
            className={styles.likesButton}
            aria-label={
              lessonState.liked ? t("cardUnlikeLesson") : t("cardLikeLesson")
            }
            aria-pressed={lessonState.liked}
            disabled={isLikePending}
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();

              try {
                setIsLikePending(true);

                const response = await fetch("/api/lesson-likes", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ lessonId: id }),
                });

                if (!response.ok) {
                  const snapshot = toggleLocalLessonLike(userId, id);

                  setLessonState((current) => ({
                    ...current,
                    likeCount: snapshot.likeCount,
                    liked: snapshot.liked,
                  }));
                  return;
                }

                const payload = (await response.json()) as {
                  snapshot?: {
                    likeCount: number;
                    liked: boolean;
                  };
                };

                if (!payload.snapshot) {
                  throw new Error(`Missing updated like snapshot for lesson "${id}".`);
                }

                storeLocalLessonLikeSnapshot(userId, id, payload.snapshot);
                setLessonState((current) => ({
                  ...current,
                  likeCount: payload.snapshot?.likeCount ?? current.likeCount,
                  liked: payload.snapshot?.liked ?? current.liked,
                }));
              } catch {
                const snapshot = toggleLocalLessonLike(userId, id);

                setLessonState((current) => ({
                  ...current,
                  likeCount: snapshot.likeCount,
                  liked: snapshot.liked,
                }));
              } finally {
                setIsLikePending(false);
              }
            }}
          >
            <span className={styles.likesCount}>{lessonState.likeCount}</span>
            <HugeiconsIcon
              icon={lessonState.liked ? HeartSolid : HeartStroke}
              size={16}
              strokeWidth={1.8}
              className={styles.likesIcon}
            />
          </button>
        </div>
      </div>

      <Link href={`/lessons/${id}`} className={styles.itemLink}>
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
            <div className={styles.itemRow}>
              <span className={styles.itemLabel}>{t("labels.level")}:</span>
              <span className={styles.itemValuePill}>{t(`options.levels.${level}`)}</span>
            </div>
            <div className={styles.itemRow}>
              <span className={styles.itemLabel}>{t("labels.category")}:</span>
              <span className={styles.itemValuePill}>{categoryLabel}</span>
            </div>
            <div className={styles.itemRow}>
              <span className={styles.itemLabel}>{t("labels.type")}:</span>
              <span className={styles.itemValuePill}>{typeLabel}</span>
            </div>
            <div className={styles.itemRow}>
              <span className={styles.itemLabel}>{t("labels.duration")}:</span>
              <span className={styles.itemValuePill}>
                {t(`options.durations.${duration}`)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
