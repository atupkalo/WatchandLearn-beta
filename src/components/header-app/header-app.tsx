"use client";

import AvatarCustom from "@/components/ui/avatar-custom";
import type { AppRole } from "@/lib/auth";
import Logo from "../common/logo";
import AdBanner from "@/components/ad-banner/ad-banner";
import RadioLanguages from "../ui/radio-languages";
import Link from "next/link";
import styles from "./header-app.module.css";
import SlideOut from "../common/slide-out";
import Account from "@/components/account/account";
import { useState } from "react";

interface HeaderAppProps {
  userName: string;
  role: AppRole;
}

export default function HeaderApp({ userName, role }: HeaderAppProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <>
      <header
        className={`${styles.headerApp} flex w-full items-center justify-between px-4 pl-8 pt-4 pr-8 pb-4`}
      >
        <Link href="/">
          <Logo size="md" />
        </Link>

        <div className="mx-4 max-w-150 flex-1">
          <AdBanner />
        </div>

        <div className="flex w-50 flex-row items-center justify-between">
          <RadioLanguages />
          <button
            type="button"
            onClick={() => setIsAccountOpen(true)}
            className={styles.avatarButton}
            aria-label="Open account"
          >
            <AvatarCustom
              size="md"
              shape="circle"
              initials={userName.slice(0, 1).toUpperCase()}
              alt={userName}
            />
          </button>
        </div>
      </header>

      <SlideOut isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)}>
        <Account name={userName} role={role} />
      </SlideOut>
    </>
  );
}
