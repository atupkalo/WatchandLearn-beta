'use client';

import Input from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ButtonCustom from "@/components/ui/button";
import uiStyles from "@/components/ui/ui.module.css";
import { createClient } from "@/utils/supabase/client";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSuccess?: () => void;
  showSignupPrompt?: boolean;
}

export default function LoginForm({
  onSwitchToSignup,
  onSuccess,
  showSignupPrompt = true,
}: LoginFormProps) {
  const t = useTranslations("EnteringForms");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    onSuccess?.();
    router.push("/home");
    router.refresh();
  }

  return (
    <div className={uiStyles.cardNoHover}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
        {errorMessage ? (
          <p className="text-sm text-[var(--danger)]">{errorMessage}</p>
        ) : null}
        <ButtonCustom
          label={t("loginH")}
          variant={"primary"}
          size={"lg"}
          type="submit"
          disabled={isSubmitting}
          className="w-full justify-center"
        />
        {showSignupPrompt ? (
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
        ) : null}
      </form>
    </div>
  );
}
