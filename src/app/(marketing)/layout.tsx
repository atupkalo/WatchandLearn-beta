import type { ReactNode } from "react";
import HeaderMarketing from "@/components/header-marketing/header-marketing";
import Container from "@/components/common/container";

export default function AppCoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <HeaderMarketing />
      <main>
        <Container>{children}</Container>
      </main>
    </div>
  );
}
