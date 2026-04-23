import styles from "./input.module.css";

interface InputSmallProps {
  id: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (value: string) => void;
  width: number;
  height: number;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function InputSmall({
  id,
  type = "text",
  value,
  onChange,
  width,
  height,
  name,
  disabled = false,
  required = false,
}: InputSmallProps) {
  return (
    <input
      id={id}
      name={name ?? id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      required={required}
      className={styles.inputSmall}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
