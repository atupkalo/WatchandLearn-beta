import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface LessonToken {
  id: string;
  text: string;
  normalized: string;
  punctuationAfter: string;
  saveable: boolean;
  translations?: {
    ua: string;
    ru: string;
  };
}

export interface LessonLineModeEasy {
  snaps: Array<{
    snapNumber: number;
    text: string;
    blanks: Array<{
      tokenId: string;
      answer: string;
      options: string[];
    }>;
  }>;
}

export interface LessonLineModeMedium {
  text: string;
  blankedTokenIds: string[];
}

export interface LessonLineModeHard {
  text: string;
  revealOrder: string[];
}

export interface LessonLine {
  lineNumber: number;
  text: string;
  translations: {
    ua: string | null;
    ru: string | null;
  };
  takeaways: {
    ua: string | null;
    ru: string | null;
  };
  tokens: LessonToken[];
  modes: {
    easy: LessonLineModeEasy;
    medium: LessonLineModeMedium;
    hard: LessonLineModeHard;
  };
}

export interface LessonSayItQuote {
  quoteNumber: number;
  startSec: number;
  endSec: number;
  text: string;
}

interface LessonRecord {
  schemaVersion: number;
  id: string;
  slug: string;
  title: string;
  series: string;
  availableModes: string[];
  media: {
    videoFile: string;
    thumbnailFile: string;
  };
  meta: {
    level: string;
    category: string | string[];
    length: string;
    scriptType: string;
    type: string | string[];
  };
  source: {
    originalDocx: string;
    structuredDocx: string;
    sourceFileName: string;
  };
  description: {
    en: string;
    ua: string;
  };
  sourceIssues?: string[];
  lines: LessonLine[];
  sayIt?: LessonSayItQuote[];
}

export interface LessonListItem {
  id: string;
  fileName: string;
  slug: string;
  title: string;
  series: string;
  availableModes: string[];
  media: {
    videoFile: string;
    thumbnailFile: string;
  };
  description: {
    en: string;
    ua: string;
  };
  level: string;
  category: string[];
  duration: string;
  type: string[];
}

export interface LessonData extends LessonRecord {
  id: string;
  fileName: string;
  displayMeta: {
    level: string;
    category: string[];
    duration: string;
    type: string[];
  };
}

const lessonsDirectory = path.join(process.cwd(), "src", "data", "lessons");

const lessonTypeMap: Record<string, string> = {
  movie: "Movie",
  series: "Series",
  documentary: "Documentary",
  animation: "Animation",
  interview: "Interview",
};

const lessonLengthMap: Record<string, string> = {
  short: "Short",
  mid: "Medium",
  medium: "Medium",
  long: "Long",
};

function toDisplayType(value: string) {
  return lessonTypeMap[value.toLowerCase()] ?? value;
}

function toDisplayDuration(value: string) {
  return lessonLengthMap[value.toLowerCase()] ?? value;
}

function toArray(value: string | string[]) {
  return Array.isArray(value) ? value : [value];
}

function toLessonData(fileName: string, record: LessonRecord): LessonData {
  return {
    ...record,
    id: fileName,
    fileName,
    source: {
      ...record.source,
      sourceFileName: fileName,
    },
    displayMeta: {
      level: record.meta.level,
      category: toArray(record.meta.category),
      duration: toDisplayDuration(record.meta.length),
      type: toArray(record.meta.type).map(toDisplayType),
    },
  };
}

function toLessonListItem(lesson: LessonData): LessonListItem {
  return {
    id: lesson.id,
    fileName: lesson.fileName,
    slug: lesson.slug,
    title: lesson.title,
    series: lesson.series,
    availableModes: lesson.availableModes,
    media: lesson.media,
    description: lesson.description,
    level: lesson.displayMeta.level,
    category: lesson.displayMeta.category,
    duration: lesson.displayMeta.duration,
    type: lesson.displayMeta.type,
  };
}

const readLessons = cache(async (): Promise<LessonData[]> => {
  const files = await readdir(lessonsDirectory);
  const lessonFiles = files
    .filter((fileName) => fileName.endsWith(".json"))
    .filter((fileName) => fileName !== "lessons_list.json")
    .filter((fileName) => !fileName.endsWith("_lessons_list.json"))
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(
    lessonFiles.map(async (fileName) => {
      const filePath = path.join(lessonsDirectory, fileName);
      const content = await readFile(filePath, "utf8");
      const record = JSON.parse(content) as LessonRecord;
      const fileId = fileName.replace(/\.json$/u, "");

      return toLessonData(fileId, record);
    }),
  );
});

export async function getAllLessons() {
  return readLessons();
}

export async function getLessonsList() {
  const lessons = await readLessons();
  return lessons.map(toLessonListItem);
}

export async function getLessonById(id: string) {
  const lessons = await readLessons();
  return lessons.find((lesson) => lesson.id === id) ?? null;
}

export async function getLessonListItemById(id: string) {
  const lessons = await readLessons();
  const lesson = lessons.find((item) => item.id === id);

  return lesson ? toLessonListItem(lesson) : null;
}
