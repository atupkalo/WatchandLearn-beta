"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import {
  mergeVocabularyEntries,
  readVocabularyCache,
  sortVocabularyEntries,
  type VocabularyEntry,
} from "@/lib/vocabulary";
import { createClient, getUserOrNull } from "@/utils/supabase/client";

export default function VocabularyList() {
  const tMisc = useTranslations("Misc");
  const tVocabulary = useTranslations("Vocabulary");
  const { studyLanguage } = useUserPreferences();
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      const cached = readVocabularyCache();

      if (isMounted) {
        setEntries(sortVocabularyEntries(cached));
      }

      try {
        const supabase = createClient();
        const user = await getUserOrNull();

        if (!user) {
          return;
        }

        const { data } = await supabase
          .from("vocabulary_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!isMounted || !data) {
          return;
        }

        setEntries(mergeVocabularyEntries(data as VocabularyEntry[], cached));
      } catch {
        // Cache fallback is enough for local user testing if DB is not ready.
      }
    }

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, []);

  const rows = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        translation:
          studyLanguage === "en-ru" ? entry.translation_ru : entry.translation_ua,
      })),
    [entries, studyLanguage],
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6 overflow-hidden p-4">
      <div className="text-xl font-bold text-[var(--textBody)]">
        {tMisc("vocabTitle")}
      </div>

      <div className="overflow-auto rounded-[24px] border border-[var(--neutral700)] bg-white/50">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 bg-white/85">
            <tr>
              <th className="px-4 py-3 text-base font-semibold text-[var(--textBody)]">
                {tVocabulary("english")}
              </th>
              <th className="px-4 py-3 text-base font-semibold text-[var(--textBody)]">
                {tVocabulary("translation")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-base text-[var(--textInactive)]"
                  colSpan={2}
                >
                  {tVocabulary("empty")}
                </td>
              </tr>
            ) : (
              rows.map((entry) => (
                <tr key={entry.id} className="border-t border-[var(--neutral700)]/70">
                  <td className="px-4 py-3 text-base text-[var(--textBody)]">
                    {entry.word}
                  </td>
                  <td className="px-4 py-3 text-base text-[var(--textBody)]">
                    {entry.translation}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
