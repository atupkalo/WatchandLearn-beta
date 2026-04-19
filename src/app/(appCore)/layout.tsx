import type { ReactNode } from "react";
import SideMenu from "@/components/sidemenu/sidemenu";
import HeaderApp from "@/components/hedaer-app/header-app";
import "./appstyles.css";

export default function AppCoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="gradient">
      <HeaderApp />
      <main className="grid gradient h-[calc(100vh-72px)] grid-cols-[max-content_1fr] gap-6 overflow-hidden p-4 app-bg">
        <aside className="h-full side-menu">
          <SideMenu />
        </aside>
        <section className="min-w-0 h-full overflow-hidden">
          {children}
        </section>
      </main>
    </div>
  );
}
