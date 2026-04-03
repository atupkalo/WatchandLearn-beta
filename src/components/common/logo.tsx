import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

export default function Logo({ size = "md" }: { size?: LogoSize }) {
  const sizes = {
    sm: "h-5",
    md: "h-7",
    lg: "h-10",
  };

  return (
    <Image
      src="/Logo2.svg"
      alt="Watch and Learn Logo"
      width={200}
      height={50}
      className={`${sizes[size]} w-auto`}
      loading="eager"
    />
  );
}