import { useTranslations } from "next-intl";

interface LessonKeyPopoverProps {
  script: string;
  translation: string;
  takeaways?: string | null;
}

export default function LessonKeyPopover({ script, translation, takeaways }: LessonKeyPopoverProps) {
  const t = useTranslations("LessonKeyPopover");

  return (
    <div className="flex w-2xl flex-col gap-4 p-1">
      <div className="flex flex-col gap-1">
        <div className="text-base font-semibold text-[#0f7c90]">
          {t("script")}:
        </div>
        <div className="text-base font-normal text-[var(--textBody)]">
          {script}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-base font-semibold text-[#ff6b35]">
          {t("translation")}:
        </div>
        <div className="text-base font-normal text-[var(--textBody)]">
          {translation}
        </div>
      </div>

      {takeaways ? (
        <div className="flex flex-col gap-1">
          <div className="text-base font-semibold text-[#5c8f1c]">
            {t("takeaways")}:
          </div>
          <div className="text-base font-normal text-[var(--textBody)]">
            {takeaways}
          </div>
        </div>
      ) : null}
    </div>
  );
}
