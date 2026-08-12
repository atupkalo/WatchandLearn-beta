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

export interface LessonTranslateItQuote extends LessonSayItQuote {
  translations: {
    ua: string;
    ru: string;
  };
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
  script?: Array<{
    lineNumber: number;
    text: string;
  }>;
  lines: LessonLine[];
  sayIt?: LessonSayItQuote[];
  translateIt?: LessonTranslateItQuote[];
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

const translateItOverrides: Record<
  string,
  Record<number, { ua: string; ru: string }>
> = {
  invincible_long_001: {
    1: {
      ua: "Дякую, що тоді врятувала мені дупу.",
      ru: "Спасибо, что тогда спасла мою задницу.",
    },
    2: {
      ua: "Боже, як безглуздо це звучить, коли я сам так кажу.",
      ru: "Боже, как глупо это звучит, когда я сам это произношу.",
    },
    3: {
      ua: "Але решта команди просто називає мене Ів. І всі інші теж.",
      ru: "Но остальная команда просто зовёт меня Ив. И все остальные тоже.",
    },
    4: {
      ua: "Ти хочеш поговорити про вчорашнє?",
      ru: "Ты хочешь поговорить о вчерашнем?",
    },
  },
  invincible_mid_001: {
    1: {
      ua: "На мого тата напали.",
      ru: "На моего папу напали.",
    },
    2: {
      ua: "Що? Ти жартуєш? О Боже, ти не жартуєш.",
      ru: "Что? Ты шутишь? О Боже, ты не шутишь.",
    },
    3: {
      ua: "Вони роблять усе можливе, але це... це жахливо.",
      ru: "Они делают всё возможное, но это... это ужасно.",
    },
  },
  invincible_short_001: {
    1: {
      ua: "Я знаю, ти не дуже любиш команди, але вони всі були доволі класні.",
      ru: "Я знаю, ты не очень любишь команды, но они все были довольно классные.",
    },
  },
  "the-morning-show_long_001": {
    1: {
      ua: "Ти сама все зіпсувала. Вчинила порушення, за яке можуть звільнити, і до того ж явно порушила контракт.",
      ru: "Ты сама всё испортила. Совершила нарушение, за которое могут уволить, и к тому же явно нарушила контракт.",
    },
    2: {
      ua: "Тобі треба піти, знайти Фреда і вибачитися вже сьогодні.",
      ru: "Тебе нужно пойти, найти Фреда и извиниться уже сегодня.",
    },
    4: {
      ua: "Іноді жінки не можуть просто попросити контроль. Тому їм доводиться його брати, гаразд?",
      ru: "Иногда женщины не могут просто попросить контроль. Поэтому им приходится его брать, хорошо?",
    },
  },
  "the-morning-show_mid_001": {
    1: {
      ua: "Я тебе люблю. Тобто, ти ж знаєш, що це правда. Ти неймовірно талановитий.",
      ru: "Я тебя люблю. То есть ты же знаешь, что это правда. Ты невероятно талантлив.",
    },
    2: {
      ua: "Але правда в тому, що робочі стосунки будуються на роботі.",
      ru: "Но правда в том, что рабочие отношения строятся на работе.",
    },
  },
  wednesday_long_001: {
    2: {
      ua: "Виглядає так, ніби на твою половину вирвало веселку.",
      ru: "Выглядит так, будто на твою сторону вырвало радугу.",
    },
    3: {
      ua: "Я присвячую годину на день своєму роману. Можливо, якби ти робила так само, твій влог був би зв’язним.",
      ru: "Я посвящаю час в день своему роману. Возможно, если бы ты делала то же самое, твой влог был бы связным.",
    },
    5: {
      ua: "Вони відповідають на твої сторіз безглуздими картинками.",
      ru: "Они отвечают на твои сториз бессмысленными картинками.",
    },
    6: {
      ua: "Так люди виражають свої почуття. Розумію, що для тебе це чуже поняття.",
      ru: "Так люди выражают свои чувства. Понимаю, что для тебя это чуждое понятие.",
    },
    7: {
      ua: "Коли я дивлюся на тебе, мені на думку спадають такі емодзі: мотузка, лопата, яма.",
      ru: "Когда я смотрю на тебя, мне на ум приходят следующие эмодзи: веревка, лопата, яма.",
    },
  },
  wednesday_mid_001: {
    1: {
      ua: "Стежка може виглядати гарно, але вона проходить прямо повз Невермор.",
      ru: "Тропа может выглядеть красивой, но она проходит прямо мимо Невермора.",
    },
    3: {
      ua: "Мій вожатий у літньому таборі був перевертнем.",
      ru: "Мой вожатый в летнем лагере был оборотнем.",
    },
  },
  wednesday_short_001: {
    1: {
      ua: "Паґзлі, ти м'який і слабкий. Ти ніколи не виживеш без мене.",
      ru: "Пагзли, ты мягкий и слабый. Ты никогда не выживешь без меня.",
    },
    2: {
      ua: "Даю тобі максимум два місяці.",
      ru: "Даю тебе максимум два месяца.",
    },
  },
};

function normalizePracticeText(text: string) {
  return text
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", "\"")
    .replaceAll("”", "\"")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("…", "...")
    .replaceAll("\u00a0", " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function splitIntoSentences(text: string) {
  return text
    .replaceAll("\u00a0", " ")
    .trim()
    .split(/(?<=[.!?])\s+/u)
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveTranslateItTranslations(
  lessonId: string,
  quote: LessonSayItQuote,
  quoteIndex: number,
  lines: LessonLine[],
) {
  const override = translateItOverrides[lessonId]?.[quoteIndex];

  if (override) {
    return override;
  }

  const normalizedQuote = normalizePracticeText(quote.text);
  const exactLine = lines.find(
    (line) => normalizePracticeText(line.text) === normalizedQuote,
  );

  if (exactLine?.translations.ua && exactLine.translations.ru) {
    return {
      ua: exactLine.translations.ua,
      ru: exactLine.translations.ru,
    };
  }

  for (const line of lines) {
    if (!line.translations.ua || !line.translations.ru) {
      continue;
    }

    const englishSentences = splitIntoSentences(line.text);
    const ukrainianSentences = splitIntoSentences(line.translations.ua);
    const russianSentences = splitIntoSentences(line.translations.ru);

    if (
      englishSentences.length !== ukrainianSentences.length ||
      englishSentences.length !== russianSentences.length
    ) {
      continue;
    }

    for (let start = 0; start < englishSentences.length; start += 1) {
      for (let end = start + 1; end <= englishSentences.length; end += 1) {
        const joinedEnglish = englishSentences.slice(start, end).join(" ");

        if (normalizePracticeText(joinedEnglish) !== normalizedQuote) {
          continue;
        }

        return {
          ua: ukrainianSentences.slice(start, end).join(" "),
          ru: russianSentences.slice(start, end).join(" "),
        };
      }
    }
  }

  return {
    ua: quote.text,
    ru: quote.text,
  };
}

function buildTranslateItQuotes(
  lessonId: string,
  sayIt: LessonSayItQuote[] | undefined,
  lines: LessonLine[],
) {
  return (sayIt ?? []).map<LessonTranslateItQuote>((quote, index) => ({
    ...quote,
    translations: resolveTranslateItTranslations(lessonId, quote, index + 1, lines),
  }));
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
    translateIt:
      record.translateIt ?? buildTranslateItQuotes(fileName, record.sayIt, record.lines),
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
