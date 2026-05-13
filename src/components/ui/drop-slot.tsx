import styles from "./ui.module.css";

interface DropSlotProps {
  width?: string;
  onElementDrop: (word: string) => void;
  value?: string;
  status?: "default" | "success" | "error";
}

export default function DropSlot({
  width = "80",
  onElementDrop,
  value = "",
  status = "default",
}: DropSlotProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const word = e.dataTransfer.getData("word");

    onElementDrop(word);
  };

  const statusClassName =
    status === "success"
      ? styles.dropSlorSuccess
      : status === "error"
        ? styles.dropSlorError
        : "";

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`${styles.dropSlot} ${statusClassName}`.trim()}
      style={{ width: `${width}px` }}
    >
      {value}
    </div>
  );
}
