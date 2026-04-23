'use client';

import Input from "@/components/ui/input";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ButtonCustom from "@/components/ui/button";
import cardStyles from "@/components/ui/card.module.css";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const t = useTranslations("EnteringForms");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={cardStyles.card}>
      <form className="flex flex-col gap-6">
        <Input
          id="login-email"
          label={t("email")}
          type="email"
          value={email}
          onChange={setEmail}
          required={true}
        />
        <Input
          id="login-password"
          label={t("password")}
          type="password"
          value={password}
          onChange={setPassword}
          required={true}
        />
        <ButtonCustom
          label={t("loginH")}
          variant={"primary"}
          size={"lg"}
          className="w-full justify-center"
        />
        <div className="flex w-full flex-col items-center gap-4 border-t-1 pt-2 text-center">
          <span>{t("signupLabel")}</span>
          <ButtonCustom
            label={t("signup")}
            variant={"secondary"}
            size={"md"}
            className="w-full justify-center"
            onClick={onSwitchToSignup}
          />
        </div>
      </form>
    </div>
  );
}
