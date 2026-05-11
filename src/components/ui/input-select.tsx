"use client";

import { Label, ListBox, Select } from "@heroui/react";
import styles from "./ui.module.css";

interface SelectOption {
  id: string;
  textValue: string;
  label: string;
}

interface InputSelectProps {
  label?: string;
  placeholder: string;
  width?: string;
  ariaLabel?: string;
  options: SelectOption[];
  selectedKey?: string;
  onSelectionChange?: (value: string) => void;
}

export default function InputSelect({
  label,
  placeholder,
  width,
  ariaLabel,
  options,
  selectedKey,
  onSelectionChange,
}: InputSelectProps) {
  const accessibleLabel = ariaLabel ?? label ?? placeholder ?? "Select";

  return (
    <Select
      className={`${styles.selectField} flex flex-col justify-start`}
      style={width ? { width } : undefined}
      selectedKey={selectedKey && selectedKey.length > 0 ? selectedKey : undefined}
      placeholder={placeholder}
      aria-label={accessibleLabel}
      onSelectionChange={(key) => {
        if (key !== undefined && key !== null) {
          onSelectionChange?.(String(key));
        }
      }}
    >
      {label ? <Label>{label}</Label> : null}

      <Select.Trigger className={styles.selectTrigger}>
        <Select.Value className={styles.selectValue} />
        <Select.Indicator className={styles.selectIndicator} />
      </Select.Trigger>

      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.textValue}
            >
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
