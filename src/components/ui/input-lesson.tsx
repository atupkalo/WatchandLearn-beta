import styles from "./ui.module.css";

interface InputSmallProps {
  name?: string;
  value: string;
  width: string;
  height?: string;
  paddingX?: string;
  status?: "default" | "active" | "success" | "error";
  onChange: (value: string) => void;
  className?: string;
  readOnly?: boolean;
  placeholder?: string;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputLesson({
  name,
  value,
  width,
  height = "24",
  paddingX = "4",
  status = "default",
  onChange,
  className = "",
  readOnly = false,
  placeholder = "",
  onBlur,
  onKeyDown,
}: InputSmallProps) {
  const statusClassName =
    status === "success"
      ? styles.inputLessonSuccess
      : status === "error"
        ? styles.inputLessonError
        : status === "active"
          ? styles.inputLessonActive
          : "";

  return (
    <input
      name={name}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={`${styles.inputLesson} ${statusClassName} ${className}`.trim()}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
      }}
    />
  );
}
