import { Avatar } from "@heroui/react";

interface AvatarProps {
  alt: string;
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
}

export default function AvatarCustom({
  alt,
  src,
  initials,
  size = "md",
}: AvatarProps) {
  return (
    <Avatar
      size={size}
      className="border border-[var(--secondary)] bg-white text-[var(--accent)]"
    >
      {src && <Avatar.Image alt={alt} src={src} />}
      <Avatar.Fallback>
        {initials || alt?.slice(0, 2).toUpperCase()}
      </Avatar.Fallback>
    </Avatar>
  );
}
