interface TitleProps {
    size?: 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64 | 72;
    color?: string;
    weight?: "font-normal" | "font-semibold" | "font-bold" | "font-extrabold";
    children: React.ReactNode;
    tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p";
    className?: string;
  }
  
  export default function Title({
    size = 24,
    color = "var(--textTitle)",
    weight = "font-bold",
    children,
    tag = "h1",
    className = "",
  }: TitleProps) {
    const Tag = tag;
  
    const sizeClasses = {
      24: "text-[24px]",
      28: "text-[28px]",
      32: "text-[32px]",
      36: "text-[36px]",
      40: "text-[40px]",
      48: "text-[48px]",
      56: "text-[56px]",
      64: "text-[64px]",
      72: "text-[72px]",
    };
  
    return (
      <Tag
        className={`${sizeClasses[size]} ${weight} ${className}`}
        style={{ color, fontFamily: "var(--font-heading)" }}
      >
        {children}
      </Tag>
    );
  }