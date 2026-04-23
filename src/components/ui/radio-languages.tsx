'use client';

import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import RadioButtons from "./radio-buttons";

export default function RadioLanguages() {
  const { interfaceLanguage, setInterfaceLanguage } = useUserPreferences();
  const interfaceLanguageOptions = [
    { label: "EN", value: "en" },
    { label: "UA", value: "uk" },
  ];

  return (
    <RadioButtons
      options={interfaceLanguageOptions}
      value={interfaceLanguage}
      onChange={(nextValue) => setInterfaceLanguage(nextValue as "en" | "uk")}
      name="language"
    />
  );
}
