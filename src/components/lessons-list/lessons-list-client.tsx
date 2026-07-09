"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import LessonCardItem from "../lesson-card-item/lesson-card-item";
import LessonsListFilters, { type LessonFilterState } from "./lessons-list-filters";
import type { LessonListItem } from "@/lib/lessons";

const defaultFilters: LessonFilterState = {
  search: "",
  level: "",
  categories: [],
  durations: [],
  types: [],
};

function matchesSingle(value: string, filterValue: string) {
  return filterValue.length === 0 || value === filterValue;
}

function matchesMultiple(values: string[], filterValues: string[]) {
  return filterValues.length === 0 || values.some((value) => filterValues.includes(value));
}

interface LessonsListClientProps {
  lessons: LessonListItem[];
  userId: string | null;
}

export default function LessonsListClient({
  lessons,
  userId,
}: LessonsListClientProps) {
  const t = useTranslations("Lessons");
  const [draftFilters, setDraftFilters] = useState<LessonFilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<LessonFilterState>(defaultFilters);

  const filteredLessons = useMemo(() => {
    const search = appliedFilters.search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const searchableText = [
        lesson.title,
        lesson.description.en,
        lesson.description.ua,
        lesson.category.join(" "),
        lesson.type.join(" "),
        lesson.duration,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (search.length === 0 || searchableText.includes(search)) &&
        matchesSingle(lesson.level, appliedFilters.level) &&
        matchesMultiple(lesson.category, appliedFilters.categories) &&
        matchesMultiple([lesson.duration], appliedFilters.durations) &&
        matchesMultiple(lesson.type, appliedFilters.types)
      );
    });
  }, [appliedFilters, lessons]);

  return (
    <section className="flex h-full flex-col gap-6">
      <LessonsListFilters
        value={draftFilters}
        onChange={setDraftFilters}
        onApply={() => setAppliedFilters(draftFilters)}
      />

      <div className="min-h-0 flex-1 w-full overflow-y-auto">
        {filteredLessons.length === 0 ? (
          <div className="rounded-2xl bg-white/60 p-6 text-[var(--textBody)]">
            {t("noResults")}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCardItem
                key={lesson.id}
                id={lesson.id}
                userId={userId}
                title={lesson.title}
                thumbnailUrl={`/thumbnails/${lesson.media.thumbnailFile}`}
                level={lesson.level}
                category={lesson.category}
                duration={lesson.duration}
                type={lesson.type}
                description={lesson.description.en}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
