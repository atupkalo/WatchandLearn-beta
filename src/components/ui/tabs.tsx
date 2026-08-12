import type { ReactNode } from "react";
import { Tabs } from "@heroui/react";
import styles from "./ui.module.css";

interface TabsCustomProps {
  tabs: Array<{
    id?: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
  }>;
  selectedKey?: string;
  onSelectionChange?: (key: string) => void;
}

export function TabsCustom({
  tabs,
  selectedKey,
  onSelectionChange,
}: TabsCustomProps) {
  return (
    <Tabs
      className="w-full"
      selectedKey={selectedKey}
      onSelectionChange={
        onSelectionChange
          ? (key) => onSelectionChange(String(key))
          : undefined
      }
    >
      <Tabs.ListContainer className={styles.tabsListContainer}>
        <Tabs.List className={styles.tabsList} aria-label="Tabs">
          {tabs.map((tab, index) => (
            <Tabs.Tab
              className={styles.tab}
              key={tab.id ?? `tab-${index}`}
              id={tab.id ?? `tab-${index}`}
              isDisabled={tab.disabled}
            >
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>

      {tabs.map((tab, index) => (
        <Tabs.Panel
          key={tab.id ?? `panel-${index}`}
          id={tab.id ?? `tab-${index}`}
        >
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
