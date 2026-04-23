import Image from "next/image";

type LogoSize = "sm" | "md" | "lg" | "xl";

export default function Logo({ size = "md" }: { size?: LogoSize }) {
  const sizes = {
    sm: "h-5",
    md: "h-7",
    lg: "h-10",
    xl: "h-16",
  };

  return (
    <Image
      src="/logo.svg"
      alt="Watch and Learn Logo"
      width={100}
      height={100}
      className={`${sizes[size]} w-auto`}
      loading="eager"
    />
  );
}