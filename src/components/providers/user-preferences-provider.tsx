'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  studyLanguageCookieName,
  type InterfaceLanguage,
  type StudyLanguage,
} from "@/lib/user-preferences";

interface UserPreferencesContextValue {
  interfaceLanguage: InterfaceLanguage;
  studyLanguage: StudyLanguage;
  setInterfaceLanguage: (language: InterfaceLanguage) => void;
  setStudyLanguage: (language: StudyLanguage) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(
  null,
);

interface UserPreferencesProviderProps {
  children: ReactNode;
  initialInterfaceLanguage: InterfaceLanguage;
  initialStudyLanguage: StudyLanguage;
}

export function UserPreferencesProvider({
  children,
  initialInterfaceLanguage,
  initialStudyLanguage,
}: UserPreferencesProviderProps) {
  const router = useRouter();
  const [interfaceLanguage, setInterfaceLanguageState] =
    useState<InterfaceLanguage>(initialInterfaceLanguage);
  const [studyLanguage, setStudyLanguageState] =
    useState<StudyLanguage>(initialStudyLanguage);

  useEffect(() => {
    setInterfaceLanguageState(initialInterfaceLanguage);
  }, [initialInterfaceLanguage]);

  useEffect(() => {
    document.cookie = `${studyLanguageCookieName}=${studyLanguage}; path=/; max-age=31536000`;
  }, [studyLanguage]);

  const value = useMemo<UserPreferencesContextValue>(
    () => ({
      interfaceLanguage,
      studyLanguage,
      setInterfaceLanguage: (language) => {
        setInterfaceLanguageState(language);
        document.cookie = `locale=${language}; path=/; max-age=31536000`;
        router.refresh();
      },
      setStudyLanguage: (language) => {
        setStudyLanguageState(language);
      },
    }),
    [interfaceLanguage, router, studyLanguage],
  );

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);

  if (!context) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider",
    );
  }

  return context;
}
