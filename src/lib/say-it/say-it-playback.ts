import {
  LESSON_SEGMENT_PLAY_EVENT,
  type LessonSegmentPlayDetail,
} from "@/lib/lesson-media-events";

const SEGMENT_PRE_ROLL_SEC = 0.35;
const SEGMENT_POST_ROLL_SEC = 0.45;
const MIN_SEGMENT_DURATION_SEC = 2;

export function normalizeLessonSegment(detail: LessonSegmentPlayDetail) {
  const startSec = Math.max(0, detail.startSec - SEGMENT_PRE_ROLL_SEC);
  const endWithPadding = detail.endSec + SEGMENT_POST_ROLL_SEC;
  const minEndSec = startSec + MIN_SEGMENT_DURATION_SEC;
  const endSec = Math.max(endWithPadding, minEndSec);

  return {
    startSec,
    endSec,
  };
}

export function getLessonSegmentDurationMs(detail: LessonSegmentPlayDetail) {
  const normalized = normalizeLessonSegment(detail);
  return Math.max(500, (normalized.endSec - normalized.startSec) * 1000);
}

export function playLessonSegment(detail: LessonSegmentPlayDetail) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeLessonSegment(detail);

  window.dispatchEvent(
    new CustomEvent(LESSON_SEGMENT_PLAY_EVENT, {
      detail: normalized,
    }),
  );
}
