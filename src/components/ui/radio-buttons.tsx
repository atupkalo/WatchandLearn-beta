'use client';

import { Label, Radio, RadioGroup } from "@heroui/react";
import styles from "./ui.module.css";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioButtonsProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  selectedLabelClassName?: string;
  idleLabelClassName?: string;
}

export default function RadioButtons({
  options,
  value,
  onChange,
  name,
  orientation = "horizontal",
  className = "flex gap-3",
  selectedLabelClassName = "font-semibold text-[var(--accent)]",
  idleLabelClassName = "text-[var(--gray150)]",
}: RadioButtonsProps) {
  return (
    <RadioGroup
      orientation={orientation}
      value={value}
      onChange={(nextValue) => onChange(String(nextValue))}
      name={name}
      className={className}
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <Radio key={option.value} value={option.value} className={styles.radio}>
            <Radio.Control className={styles.radioControl}>
              <Radio.Indicator />
            </Radio.Control>
            <Radio.Content>
              <Label
                className={`${styles.radioLabel} ${
                  isSelected ? selectedLabelClassName : idleLabelClassName
                }`}
              >
                {option.label}
              </Label>
            </Radio.Content>
          </Radio>
        );
      })}
    </RadioGroup>
  );
}
