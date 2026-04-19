import { Avatar } from "@heroui/react";

interface AvatarProps {
  alt: string;
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
}

export default function AvatarCustom({ alt, src, initials }: AvatarProps) {
  return (
    <Avatar>
      {src && <Avatar.Image alt={alt} src={src} />}
      <Avatar.Fallback>
        {initials || alt?.slice(0, 2).toUpperCase()}
      </Avatar.Fallback>
    </Avatar>
  );
}