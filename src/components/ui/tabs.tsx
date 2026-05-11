import type { ReactNode } from "react";
import { Tabs } from "@heroui/react";
import styles from "./ui.module.css";

interface TabsCustomProps {
  tabs: Array<{
    label: string;
    content: ReactNode;
  }>;
}

export function TabsCustom({ tabs }: TabsCustomProps) {
  return (
    <Tabs className="w-full">
      <Tabs.ListContainer>
        <Tabs.List className={styles.tabsList} aria-label="Tabs">
          {tabs.map((tab, index) => (
            <Tabs.Tab className={styles.tab } key={index} id={`tab-${index}`}>
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>

      {tabs.map((tab, index) => (
        <Tabs.Panel key={index} id={`tab-${index}`} className="pt-4">
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
