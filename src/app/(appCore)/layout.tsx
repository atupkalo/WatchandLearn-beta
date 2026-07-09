import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SideMenu from "@/components/sidemenu/sidemenu";
import HeaderApp from "@/components/header-app/header-app";
import { getUserDisplayName, getUserRole } from "@/lib/auth";
import { getUserOrNull } from "@/utils/supabase/server";
import styles from "./layout.module.css";

export default async function AppCoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const user = await getUserOrNull(cookieStore);

  if (!user) {
    redirect("/");
  }

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <HeaderApp
        userName={getUserDisplayName(user)}
        role={getUserRole(user)}
      />
      <main
        className={`${styles.appBackground} grid flex-1 min-h-0 grid-cols-[max-content_1fr] gap-6 overflow-hidden p-4`}
      >
        <aside className="h-full">
          <SideMenu />
        </aside>
        <section className="min-w-0 h-full overflow-hidden">
          <div className="h-full min-h-0 overflow-hidden">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
