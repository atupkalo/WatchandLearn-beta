"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import filtersData from "@/data/filters/filters.json";
import ButtonCustom from "../ui/button";
import CustomSearchField from "../ui/search-field";
import InputMultySelect from "../ui/input-multy-select";
import InputSelect from "../ui/input-select";
import TopBar from "../ui/top-bar";
import styles from "../ui/ui.module.css";

export interface LessonFilterState {
  search: string;
  level: string;
  categories: string[];
  durations: string[];
  types: string[];
}

interface LessonsListFiltersProps {
  value: LessonFilterState;
  onChange: (value: LessonFilterState) => void;
  onApply: () => void;
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

function toOptions(values: string[], translate: (key: string) => string) {
  return values.map((value) => ({
    id: value,
    textValue: value,
    label: translate(value),
  }));
}

export default function LessonsListFilters({
  value,
  onChange,
  onApply,
}: LessonsListFiltersProps) {
  const t = useTranslations("Lessons");

  const levelOptions = useMemo(
    () => [
      {
        id: "",
        textValue: "",
        label: "",
      },
      ...toOptions(filtersData.levels, (filterValue) =>
        translateOptionLabel(t, `options.levels.${filterValue}`, filterValue),
      ),
    ],
    [t],
  );
  const durationOptions = useMemo(
    () =>
      toOptions(filtersData.durations, (filterValue) =>
        translateOptionLabel(t, `options.durations.${filterValue}`, filterValue),
      ),
    [t],
  );
  const categoryOptions = useMemo(
    () =>
      toOptions(filtersData.categories, (filterValue) =>
        translateOptionLabel(t, `options.categories.${filterValue}`, filterValue),
      ),
    [t],
  );
  const typeOptions = useMemo(
    () =>
      toOptions(filtersData.types, (filterValue) =>
        translateOptionLabel(t, `options.types.${filterValue}`, filterValue),
      ),
    [t],
  );

  return (
    <TopBar>
      <CustomSearchField
        width="280px"
        value={value.search}
        onChange={(nextValue) => onChange({ ...value, search: nextValue })}
      />

      <div className={styles.topBarFieldGroup}>
        <span className="text-[var(--textBody)]">{t("labels.level")}:</span>
        <InputSelect
          ariaLabel={t("labels.level")}
          placeholder=""
          width="160px"
          options={levelOptions}
          selectedKey={value.level}
          onSelectionChange={(nextValue) => onChange({ ...value, level: nextValue })}
        />
      </div>

      <div className={styles.topBarFieldGroup}>
        <span className="text-[var(--textBody)]">{t("labels.category")}:</span>
        <InputMultySelect
          ariaLabel={t("labels.category")}
          placeholder=""
          width="200px"
          options={categoryOptions}
          selectedKeys={value.categories}
          onSelectionChange={(nextValue) => onChange({ ...value, categories: nextValue })}
        />
      </div>

      <div className={styles.topBarFieldGroup}>
        <span className="text-[var(--textBody)]">{t("labels.duration")}:</span>
        <InputMultySelect
          ariaLabel={t("labels.duration")}
          placeholder=""
          width="160px"
          options={durationOptions}
          selectedKeys={value.durations}
          onSelectionChange={(nextValue) => onChange({ ...value, durations: nextValue })}
        />
      </div>

      <div className={styles.topBarFieldGroup}>
        <span className="text-[var(--textBody)]">{t("labels.type")}:</span>
        <InputMultySelect
          ariaLabel={t("labels.type")}
          placeholder=""
          width="180px"
          options={typeOptions}
          selectedKeys={value.types}
          onSelectionChange={(nextValue) => onChange({ ...value, types: nextValue })}
        />
      </div>

      <ButtonCustom
        onClick={onApply}
        label={t("setFilters")}
        variant="accent"
        size="sm"
      />
    </TopBar>
  );
}
