export interface VocabularyEntry {
  id: string;
  user_id?: string;
  lesson_id: string;
  lesson_slug: string;
  line_number: number;
  token_id: string;
  word: string;
  normalized: string;
  translation_ua: string;
  translation_ru: string;
  created_at: string;
}

const vocabularyStorageKey = "watch-and-learn:vocabulary";

export function getVocabularyEntryId(lessonId: string, tokenId: string) {
  return `${lessonId}:${tokenId}`;
}

export function readVocabularyCache() {
  if (typeof window === "undefined") {
    return [] as VocabularyEntry[];
  }

  try {
    const raw = window.localStorage.getItem(vocabularyStorageKey);

    if (!raw) {
      return [] as VocabularyEntry[];
    }

    const parsed = JSON.parse(raw) as VocabularyEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as VocabularyEntry[];
  }
}

export function writeVocabularyCache(entries: VocabularyEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(vocabularyStorageKey, JSON.stringify(entries));
}

export function sortVocabularyEntries(entries: VocabularyEntry[]) {
  return [...entries].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );
}

export function upsertVocabularyCache(entry: VocabularyEntry) {
  const current = readVocabularyCache();
  const next = current.filter((item) => item.id !== entry.id);
  next.unshift(entry);
  const sorted = sortVocabularyEntries(next);
  writeVocabularyCache(sorted);
  return sorted;
}

export function mergeVocabularyEntries(
  primary: VocabularyEntry[],
  secondary: VocabularyEntry[],
) {
  const merged = new Map<string, VocabularyEntry>();

  for (const entry of secondary) {
    merged.set(entry.id, entry);
  }

  for (const entry of primary) {
    merged.set(entry.id, entry);
  }

  return sortVocabularyEntries([...merged.values()]);
}
