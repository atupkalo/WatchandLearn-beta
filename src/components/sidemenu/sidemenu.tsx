'use client';

import { useTranslations } from 'next-intl';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  HomeStroke,
  HomeSolid,
  LessonsSolid,
  LessonsStroke,
  VocabularyStroke,
  VocabularySolid,
  GrammarStroke,
  GrammarSolid,
  PronunciationStroke,
  PronunciationSolid
} from "../Icons/icons";
import styles from "./sidemenu.module.css";

const menuItems = [
  { href: "/home", stroke: HomeStroke, solid: HomeSolid, lang: "home" },
  { href: "/lessons", stroke: LessonsStroke, solid: LessonsSolid, lang: "lessons" },
  { href: "/vocabulary", stroke: VocabularyStroke, solid: VocabularySolid, lang: "vocabulary" },
  { href: "/grammar", stroke: GrammarStroke, solid: GrammarSolid, lang: "grammar" },
  { href: "/pronunciation", stroke: PronunciationStroke, solid: PronunciationSolid, lang: "pronunciation" }
];

export default function SideMenu() {
  const t = useTranslations('SideMenu');
  const pathname = usePathname();

  return (
    <div className={styles.sideMenu}>
      <ul className="flex flex-col gap-6">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = isActive ? item.solid : item.stroke;

          return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-lg
                    text-sm font-medium transition-colors duration-200

                    ${
                      isActive
                        ? "text-[var(--accent300)] bg-[var(--primary600)]"
                        : "text-white hover:bg-[var(--primary600)]"
                    }
                  `}
                >
                  <HugeiconsIcon
                    icon={Icon}
                    size={24}
                    color={isActive ? "var(--accent300)" : "white"}
                  />

                {t(item.lang)}
                </Link>
              </li>
          );
        })}
      </ul>
    </div>
  );
}
