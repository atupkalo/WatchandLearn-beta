import type { ReactNode } from "react";
import SideMenu from "@/components/sidemenu/sidemenu";
import HeaderApp from "@/components/header-app/header-app";
import styles from "./layout.module.css";

export default function AppCoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderApp />
      <main
        className={`${styles.appBackground} grid flex-1 min-h-0 grid-cols-[max-content_1fr] gap-6 overflow-hidden p-4`}
      >
        <aside className="h-full">
          <SideMenu />
        </aside>
        <section className="min-w-0 h-full overflow-hidden">
          <div className="h-full overflow-auto rounded-[28px]">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
