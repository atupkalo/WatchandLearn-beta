"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Popover } from "@heroui/react";
import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import ButtonCustom from "@/components/ui/button";
import type { LessonToken } from "@/lib/lessons";
import {
  getVocabularyEntryId,
  upsertVocabularyCache,
  type VocabularyEntry,
} from "@/lib/vocabulary";
import { createClient, getUserOrNull } from "@/utils/supabase/client";

interface LessonKeyWordProps {
  lessonId: string;
  lessonSlug: string;
  lineNumber: number;
  token: LessonToken;
}

export default function LessonKeyWord({
  lessonId,
  lessonSlug,
  lineNumber,
  token,
}: LessonKeyWordProps) {
  const t = useTranslations("LessonKeyPopover");
  const { studyLanguage } = useUserPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const translations = token.translations ?? {
    ua: token.text,
    ru: token.text,
  };
  const translation = studyLanguage === "en-ru" ? translations.ru : translations.ua;

  async function handleLearn() {
    setIsSaving(true);

    const entry: VocabularyEntry = {
      id: getVocabularyEntryId(lessonId, token.id),
      lesson_id: lessonId,
      lesson_slug: lessonSlug,
      line_number: lineNumber,
      token_id: token.id,
      word: token.text,
      normalized: token.normalized,
      translation_ua: translations.ua,
      translation_ru: translations.ru,
      created_at: new Date().toISOString(),
    };

    upsertVocabularyCache(entry);

    try {
      const supabase = createClient();
      const user = await getUserOrNull();

      if (user) {
        await supabase.from("vocabulary_entries").upsert(
          {
            ...entry,
            user_id: user.id,
          },
          {
            onConflict: "user_id,lesson_id,token_id",
          },
        );
      }
    } catch {
      // Local cache is enough if the auth session is stale or DB is unavailable.
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  }

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <button
          type="button"
          className="cursor-pointer bg-transparent text-left transition-opacity hover:opacity-70"
        >
          {token.text}
          {token.punctuationAfter}
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Arrow />
        <Popover.Dialog>
          <div className="flex min-w-[180px] flex-col gap-3 p-1">
            <div className="text-base font-semibold text-[var(--textBody)]">
              {token.text}
            </div>
            <div className="text-base font-normal text-[var(--textBody)]">
              {translation}
            </div>
            <ButtonCustom
              label={isSaving ? t("saving") : t("learn")}
              variant="accent"
              onClick={handleLearn}
              disabled={isSaving}
            />
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
