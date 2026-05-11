"use client";

import { Label, ListBox, Popover } from "@heroui/react";
import type { Key } from "react";
import styles from "./ui.module.css";

type Selection = "all" | Set<Key>;

interface SelectOption {
  id: string;
  textValue: string;
  label: string;
}

interface InputMultySelectProps {
  label?: string;
  placeholder: string;
  width?: string;
  ariaLabel?: string;
  options: SelectOption[];
  selectedKeys?: string[];
  onSelectionChange?: (value: string[]) => void;
}
export default function InputMultySelect({
  label,
  placeholder,
  width,
  ariaLabel,
  options,
  selectedKeys = [],
  onSelectionChange,
}: InputMultySelectProps) {
  const accessibleLabel = ariaLabel ?? label ?? placeholder ?? "Select";
  const selectedText = options
    .filter((option) => selectedKeys.includes(option.id))
    .map((option) => option.label)
    .join(", ");

  return (
    <Popover>
      <Popover.Trigger>
        <button
          type="button"
          className={`${styles.multiSelectTrigger} ${styles.selectField}`}
          style={width ? { width } : undefined}
          aria-label={accessibleLabel}
        >
          <span>{selectedText.length > 0 ? selectedText : "\u00A0"}</span>
          <svg
            className={styles.multiSelectChevron}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4.5 6.75L9 11.25L13.5 6.75"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Dialog className={styles.multiSelectPopover}>
          {label ? <Label>{label}</Label> : null}
          <ListBox
            selectionMode="multiple"
            selectedKeys={new Set(selectedKeys)}
            aria-label={accessibleLabel}
            onSelectionChange={(keys) => {
              const nextKeys = keys as Selection;

              if (nextKeys === "all") {
                onSelectionChange?.(options.map((option) => option.id));
                return;
              }

              onSelectionChange?.(Array.from(nextKeys).map(String));
            }}
          >
          {options.map((option) => (
            <ListBox.Item key={option.id} id={option.id} textValue={option.textValue}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
          </ListBox>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
