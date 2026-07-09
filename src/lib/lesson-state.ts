"use client";

export type LessonListStatus = "not-started" | "started" | "completed";

interface LessonProgressEntry {
  completed?: boolean;
  started?: boolean;
}

interface LessonStateSnapshot {
  likeCount: number;
  liked: boolean;
  status: LessonListStatus;
}

export const LESSON_STATE_UPDATED_EVENT = "watchandlearn:lesson-state-updated";

const LESSON_PROGRESS_KEY_PREFIX = "watchandlearn:lesson-progress";
const LESSON_LIKES_KEY_PREFIX = "watchandlearn:lesson-likes";
const LESSON_LIKE_COUNTS_KEY = "watchandlearn:lesson-like-counts";

export const INITIAL_LESSON_STATE: LessonStateSnapshot = {
  likeCount: 0,
  liked: false,
  status: "not-started",
};

function getViewerKey(userId: string | null) {
  return userId ?? "guest";
}

function getLessonProgressKey(userId: string | null) {
  return `${LESSON_PROGRESS_KEY_PREFIX}:${getViewerKey(userId)}`;
}

function getLessonLikesKey(userId: string | null) {
  return `${LESSON_LIKES_KEY_PREFIX}:${getViewerKey(userId)}`;
}

function readMap<T>(storageKey: string): Record<string, T> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap<T>(storageKey: string, value: Record<string, T>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

function emitLessonStateUpdated(userId: string | null, lessonId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(LESSON_STATE_UPDATED_EVENT, {
      detail: {
        lessonId,
        userId,
      },
    }),
  );
}

function getStatus(progressEntry: LessonProgressEntry | undefined): LessonListStatus {
  if (progressEntry?.completed) {
    return "completed";
  }

  if (progressEntry?.started) {
    return "started";
  }

  return "not-started";
}

function readLocalLessonLikeState(userId: string | null, lessonId: string) {
  const likedMap = readMap<boolean>(getLessonLikesKey(userId));
  const likeCountsMap = readMap<number>(LESSON_LIKE_COUNTS_KEY);
  const liked = likedMap[lessonId] === true;
  const likeCount = Math.max(likeCountsMap[lessonId] ?? 0, liked ? 1 : 0);

  return {
    likeCount,
    liked,
  };
}

export function getLocalLessonLikeSnapshot(
  userId: string | null,
  lessonId: string,
) {
  return readLocalLessonLikeState(userId, lessonId);
}

export function storeLocalLessonLikeSnapshot(
  userId: string | null,
  lessonId: string,
  snapshot: Pick<LessonStateSnapshot, "likeCount" | "liked">,
) {
  const likedMap = readMap<boolean>(getLessonLikesKey(userId));
  const likeCountsMap = readMap<number>(LESSON_LIKE_COUNTS_KEY);

  if (snapshot.liked) {
    likedMap[lessonId] = true;
  } else {
    delete likedMap[lessonId];
  }

  likeCountsMap[lessonId] = Math.max(snapshot.likeCount, 0);

  writeMap(getLessonLikesKey(userId), likedMap);
  writeMap(LESSON_LIKE_COUNTS_KEY, likeCountsMap);
}

export function toggleLocalLessonLike(
  userId: string | null,
  lessonId: string,
) {
  const likedMap = readMap<boolean>(getLessonLikesKey(userId));
  const likeCountsMap = readMap<number>(LESSON_LIKE_COUNTS_KEY);
  const currentlyLiked = likedMap[lessonId] === true;
  const currentCount = Math.max(likeCountsMap[lessonId] ?? 0, currentlyLiked ? 1 : 0);

  if (currentlyLiked) {
    delete likedMap[lessonId];
    likeCountsMap[lessonId] = Math.max(currentCount - 1, 0);
  } else {
    likedMap[lessonId] = true;
    likeCountsMap[lessonId] = currentCount + 1;
  }

  writeMap(getLessonLikesKey(userId), likedMap);
  writeMap(LESSON_LIKE_COUNTS_KEY, likeCountsMap);
  emitLessonStateUpdated(userId, lessonId);

  return readLocalLessonLikeState(userId, lessonId);
}

export function getLessonStateSnapshot(
  userId: string | null,
  lessonId: string,
): LessonStateSnapshot {
  const progressMap = readMap<LessonProgressEntry>(getLessonProgressKey(userId));
  const likeSnapshot = readLocalLessonLikeState(userId, lessonId);

  return {
    ...likeSnapshot,
    status: getStatus(progressMap[lessonId]),
  };
}

export function markLessonStarted(userId: string | null, lessonId: string) {
  const progressStorageKey = getLessonProgressKey(userId);
  const progressMap = readMap<LessonProgressEntry>(progressStorageKey);
  const currentEntry = progressMap[lessonId] ?? {};

  if (currentEntry.started || currentEntry.completed) {
    return;
  }

  progressMap[lessonId] = {
    ...currentEntry,
    started: true,
  };

  writeMap(progressStorageKey, progressMap);
  emitLessonStateUpdated(userId, lessonId);
}

export function markLessonCompleted(userId: string | null, lessonId: string) {
  const progressStorageKey = getLessonProgressKey(userId);
  const progressMap = readMap<LessonProgressEntry>(progressStorageKey);
  const currentEntry = progressMap[lessonId] ?? {};

  progressMap[lessonId] = {
    ...currentEntry,
    completed: true,
    started: true,
  };

  writeMap(progressStorageKey, progressMap);
  emitLessonStateUpdated(userId, lessonId);
}
