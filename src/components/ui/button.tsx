import { Button } from "@heroui/react";

interface ButtonCustomProps {
  size?: "sm" | "md" | "lg";
  label: string;
  variant?: "primary" | "secondary" | "ghostIcon" | "accent";
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function ButtonCustom({
  size = "md",
  label,
  variant = "primary",
  className = "",
  icon,
  type = "button",
  onClick,
}: ButtonCustomProps) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--secondary)]",
    secondary: "bg-[var(--background)] text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--gray100)]",
    accent: "bg-[var(--accent)] text-white hover:bg-[var(--accent700)]",
    ghostIcon: "bg-transparent text-[var(--primary)] hover:bg-[var(--gray100)]",
  };

  return (
    <Button
      size={size}
      type={type}
      onClick={onClick}
      className={`${variants[variant]} rounded-full text-base font-medium ${className}`}
    >
      {label}{icon}
    </Button>
  );
}

