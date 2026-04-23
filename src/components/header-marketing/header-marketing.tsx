'use client';

import ButtonCustom from "../ui/button";
import Container from "../common/container";
import Logo from "../common/logo";
import RadioLanguages from "../ui/radio-languages";
import Link from "next/link";
import ButtonIcon from "@/components/ui/button-icon/button-icon";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login } from "@/components/Icons/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from "react";
import LoginForm from "@/components/login-form/login-form";
import { useAuthPopover } from "@/components/providers/auth-popover-provider";
import styles from "./header-marketing.module.css";

export default function HeaderMarketing() {
    const t = useTranslations('Header');
    const router = useRouter();
    const pathname = usePathname();
    const { isOpen, mode, toggleLogin, closeAuthPopover } = useAuthPopover();
    const loginAreaRef = useRef<HTMLDivElement>(null);
    const showAuthButtons = pathname !== "/signup";

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          isOpen &&
          loginAreaRef.current &&
          !loginAreaRef.current.contains(event.target as Node)
        ) {
          closeAuthPopover();
        }
      }

      function handleEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          closeAuthPopover();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [closeAuthPopover, isOpen]);

  return (
    <header className={`${styles.headerMarketing} sticky top-0 z-50 p-4`}>
      <Container>
          <div className="flex flex-row justify-between items-center">
            <Link href="/" className="flex flex-col justify-center items-center ">
              <Logo size="md" />
              <div className="text-[var(--textBody)] font-semibold"><span>Watch and Learn</span></div>
            </Link>
          <div className="flex flex-row min-w-100 justify-between items-center">
            <RadioLanguages />
            {showAuthButtons ? (
              <div className="flex flex-row gap-6 items-center">
                <ButtonCustom
                  size="md"
                  label={t('btnSignUp')}
                  variant="accent"
                  onClick={() => router.push("/signup")}
                />
                <div className="relative" ref={loginAreaRef}>
                  <ButtonIcon
                    size="lg"
                    label={t("btnSLogin")}
                    icon={<HugeiconsIcon icon={Login } strokeWidth={2} size={16} />}
                    onClick={toggleLogin}
                  />
                  {isOpen && mode === "login" ? (
                    <div className="absolute right-0 top-full z-50 mt-4 w-[420px] max-w-[calc(100vw-2rem)] rounded-[32px] shadow-[0_18px_40px_rgba(58,82,96,0.16)]">
                      <LoginForm />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
}

 
