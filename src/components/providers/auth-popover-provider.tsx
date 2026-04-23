'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthPopoverMode = "login" | "signup";

interface AuthPopoverContextValue {
  isOpen: boolean;
  mode: AuthPopoverMode;
  openLogin: () => void;
  openSignup: () => void;
  closeAuthPopover: () => void;
  toggleLogin: () => void;
}

const AuthPopoverContext = createContext<AuthPopoverContextValue | null>(null);

export function AuthPopoverProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthPopoverMode>("login");

  const value = useMemo<AuthPopoverContextValue>(
    () => ({
      isOpen,
      mode,
      openLogin: () => {
        setMode("login");
        setIsOpen(true);
      },
      openSignup: () => {
        setMode("signup");
        setIsOpen(true);
      },
      closeAuthPopover: () => {
        setIsOpen(false);
      },
      toggleLogin: () => {
        setMode("login");
        setIsOpen((previousValue) =>
          mode === "login" ? !previousValue : true,
        );
      },
    }),
    [isOpen, mode],
  );

  return (
    <AuthPopoverContext.Provider value={value}>
      {children}
    </AuthPopoverContext.Provider>
  );
}

export function useAuthPopover() {
  const context = useContext(AuthPopoverContext);

  if (!context) {
    throw new Error(
      "useAuthPopover must be used within an AuthPopoverProvider",
    );
  }

  return context;
}
