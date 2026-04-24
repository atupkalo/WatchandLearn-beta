'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Info } from "@/components/Icons/icons";
import LoginForm from "@/components/login-form/login-form";
import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import PopoverCustom from "@/components/ui/popover";
import ButtonCustom from "@/components/ui/button";
import RadioButtons from "@/components/ui/radio-buttons";
import Title from "@/components/ui/title";
import SignupForm from "@/components/signup-form/signup-form";
import type {
  InterfaceLanguage,
  StudyLanguage,
} from "@/lib/user-preferences";

function PreferenceInfo({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-base font-semibold text-[var(--textBody)]">{title}</div>
      <PopoverCustom
        content={
          <p className="max-w-[320px] text-sm leading-6 text-[var(--textBody)]">
            {description}
          </p>
        }
        trigger={
          <button
            type="button"
            aria-label={`More information about ${title}`}
            className="cursor-pointer text-[var(--primary)]"
          >
            <HugeiconsIcon icon={Info} size={18} />
          </button>
        }
      />
    </div>
  );
}

export default function SignupPage() {
  const { interfaceLanguage, studyLanguage, setInterfaceLanguage, setStudyLanguage } =
    useUserPreferences();
  const t = useTranslations("Onbording");
  const tAuth = useTranslations("EnteringForms");
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  const interfaceLanguageOptions: { label: string; value: InterfaceLanguage }[] = [
    { label: "EN", value: "en" },
    { label: "UA", value: "uk" },
  ];
  const studyLanguageOptions: { label: string; value: StudyLanguage }[] = [
    { label: `${t("langEN")} - ${t("langUA")}`, value: "en-ua" },
    { label: `${t("langEN")} - ${t("langRu")}`, value: "en-ru" },
  ];

  return (
    <section className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-8 rounded-[32px] p-8">
      {authMode === "signup" ? (
        <>
          <Title tag="h3" size={32} className="text-center">
            {t("title")}
          </Title>

          <div className="flex flex-col items-center gap-4">
            <PreferenceInfo
              title={t("interfaceLang")}
              description={t("descriptionInterface")}
            />
            <RadioButtons
              options={interfaceLanguageOptions}
              value={interfaceLanguage}
              onChange={(value) => setInterfaceLanguage(value as InterfaceLanguage)}
              name="interfaceLanguage"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <PreferenceInfo
              title={t("studyLang")}
              description={t("discriptionStudy")}
            />
            <RadioButtons
              options={studyLanguageOptions}
              value={studyLanguage}
              onChange={(value) => setStudyLanguage(value as StudyLanguage)}
              name="studyLanguage"
            />
          </div>
        </>
      ) : null}
      {authMode === "signup" ? (
        <SignupForm onSwitchToLogin={() => setAuthMode("login")} />
      ) : (
        <>
          <LoginForm showSignupPrompt={false} />
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-[var(--textBody)]">{tAuth("signupLabel")}</span>
            <ButtonCustom
              label={tAuth("signup")}
              variant="secondary"
              size="md"
              className="w-full max-w-[420px] justify-center"
              onClick={() => setAuthMode("signup")}
            />
          </div>
        </>
      )}
    </section>
  );
}
