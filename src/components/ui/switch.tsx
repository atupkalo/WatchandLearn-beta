"use client";

import { Switch } from "@heroui/react";
import styles from "./ui.module.css";

interface SwitchCustomProps {
  label: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
}

export default function SwitchCustom({
  label,
  isSelected,
  onChange,
}: SwitchCustomProps) {
  return (
    <Switch
      isSelected={isSelected}
      onChange={onChange}
      className={styles.switchRoot}
    >
      <Switch.Content className={styles.switchLabel}>{label}</Switch.Content>
      <Switch.Control
        className={`${styles.switchTrack} ${isSelected ? styles.switchTrackOn : ""}`}
      >
        <Switch.Thumb
          className={`${styles.switchThumb} ${isSelected ? styles.switchThumbOn : ""}`}
        />
      </Switch.Control>
    </Switch>
  );
}
