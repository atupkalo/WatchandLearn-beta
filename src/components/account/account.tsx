 "use client";

import styles from "./account.module.css";
import AvatarCustom from "@/components/ui/avatar-custom";
import RadioButtons from "@/components/ui/radio-buttons";
import { useTranslations } from "next-intl";
import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import radioStyles from "./account-radio.module.css";

interface AccountProps {
  name: string;
}
export default function Account(
  { name }: AccountProps
) {
  const t = useTranslations("Account");
  const { studyLanguage, setStudyLanguage } = useUserPreferences();
  const studyLanguageOptions = [
    { label: t("studyUa"), value: "en-ua" },
    { label: t("studyRu"), value: "en-ru" },
  ];

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
          className={radioStyles.group}
          selectedLabelClassName={radioStyles.selectedLabel}
          idleLabelClassName={radioStyles.idleLabel}
        />
      </div>
    </section>
  );
}
