"use client";

import styles from "./account.module.css";
import type { AppRole } from "@/lib/auth";
import AvatarCustom from "@/components/ui/avatar-custom";
import RadioButtons from "@/components/ui/radio-buttons";
import ButtonCustom from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface AccountProps {
  name: string;
  role: AppRole;
}
export default function Account(
  { name, role }: AccountProps
) {
  const t = useTranslations("Account");
  const { studyLanguage, setStudyLanguage } = useUserPreferences();
  const router = useRouter();
  const studyLanguageOptions = [
    { label: t("studyUa"), value: "en-ua" },
    { label: t("studyRu"), value: "en-ru" },
  ];

  async function handleSignOut() {
    const supabase = createClient();

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <section className={styles.account}>
      <div className={styles.header}>
        <AvatarCustom
          alt={name}
          initials={name.slice(0, 1).toUpperCase()}
          size="md"
          shape="circle"
        />
        <div className={styles.name}>{name}</div>
        <div className={styles.role}>{t(role)}</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.preferenceRow}>
        <div className={styles.preferenceLabel}>{t("studyLabel")}</div>
        <RadioButtons
          options={studyLanguageOptions}
          value={studyLanguage}
          onChange={(nextValue) =>
            setStudyLanguage(nextValue as "en-ua" | "en-ru")
          }
          name="account-study-language"
          className={styles.radioGroup}
          selectedLabelClassName={styles.radioLabelSelected}
          idleLabelClassName={styles.radioLabelIdle}
        />
      </div>

      <ButtonCustom
        label={t("logout")}
        variant="secondary"
        size="md"
        className="mt-4 self-start"
        onClick={() => {
          void handleSignOut();
        }}
      />
    </section>
  );
}
