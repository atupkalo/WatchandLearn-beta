import { Input, Label, TextField } from "@heroui/react";
import styles from "./input.module.css";

interface InputCustomProps {
  id: string;
  name?: string;
  type?: "text" | "email" | "password" | "number";
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  size?: "lg" | "md";
  shadow?: boolean;
}

export default function InputCustom({
  id,
  name,
  type = "text",
  label,
  placeholder = "",
  value,
  onChange,
  required = false,
  disabled = false,
  size = "lg",
  shadow = true,
}: InputCustomProps) {
  return (
    <TextField
      className={`${styles.inputCustom} ${
        size === "lg" ? styles.large : styles.medium
      } ${shadow ? styles.shadow : styles.flat} flex w-full flex-col gap-1`}
    >
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name ?? id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      />
    </TextField>
  );
}
