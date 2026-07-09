import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HeaderMarketing from "@/components/header-marketing/header-marketing";
import Container from "@/components/common/container";
import { getUserOrNull } from "@/utils/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const user = await getUserOrNull(cookieStore);

  if (user) {
    redirect("/home");
  }

  return (
    <div>
      <HeaderMarketing />
      <main>
        <Container>{children}</Container>
      </main>
    </div>
  );
}
