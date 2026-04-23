export const interfaceLanguages = ["en", "uk"] as const;
export const studyLanguages = ["en-ua", "en-ru"] as const;

export type InterfaceLanguage = (typeof interfaceLanguages)[number];
export type StudyLanguage = (typeof studyLanguages)[number];

export const defaultInterfaceLanguage: InterfaceLanguage = "en";
export const defaultStudyLanguage: StudyLanguage = "en-ua";
export const studyLanguageCookieName = "studyLanguage";

export function isInterfaceLanguage(
  value: string | undefined,
): value is InterfaceLanguage {
  return (
    value !== undefined && interfaceLanguages.includes(value as InterfaceLanguage)
  );
}

export function isStudyLanguage(value: string | undefined): value is StudyLanguage {
  return value !== undefined && studyLanguages.includes(value as StudyLanguage);
}
