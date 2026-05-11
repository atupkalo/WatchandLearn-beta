"use client";

import { FieldError, Label, SearchField } from "@heroui/react";
import { useTranslations } from "next-intl";
import styles from "./ui.module.css";

interface CustomSearchFieldProps {
  label?: string;
  width?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function CustomSearchField({
  label,
  width,
  value,
  onChange,
}: CustomSearchFieldProps) {
  const t = useTranslations("Generic");
  const accessibleLabel = label ?? `${t("search")} field`;

  return (
    <SearchField
      className={styles.searchField}
      name="search"
      value={value}
      onChange={onChange}
      style={width ? { width } : undefined}
      aria-label={accessibleLabel}
    >
      {label ? <Label>{label}</Label> : null}
      <SearchField.Group className={styles.searchFieldGroup}>
        <SearchField.SearchIcon className={styles.searchFieldIcon} />
        <SearchField.Input
          className={styles.searchFieldInput}
          placeholder={`${t("search")}...`}
        />
        <SearchField.ClearButton />
      </SearchField.Group>
      <FieldError />
    </SearchField>
  );
}
