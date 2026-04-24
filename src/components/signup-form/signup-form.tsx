'use client';

import Input from "@/components/ui/input";
import { useRouter } from "next/navigation";
import ButtonCustom from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login } from "@/components/Icons/icons";
import ButtonIcon from "../ui/button-icon/button-icon";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import buttonStyles from "@/components/ui/button.module.css";
import cardStyles from "@/components/ui/card.module.css";
import { createClient } from "@/utils/supabase/client";

const icons = ['apple', 'google', 'fb', 'github'];

interface SignupFormProps {
    onSwitchToLogin?: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) { 
    const t = useTranslations("EnteringForms");
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setErrorMessage(t("passwordMismatch"));
            return;
        }

        setIsSubmitting(true);

        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        setIsSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        if (data.session) {
            router.push("/home");
            router.refresh();
            return;
        }

        setSuccessMessage(t("signupSuccess"));
    }

    return (
        <div className={cardStyles.card}>
            <form
                className="flex w-md flex-col items-center justify-center gap-6"
                onSubmit={handleSubmit}
            >
                <Input id={"signup-name"} label={t("name")} type={"text"} value={name} onChange={setName} ></Input>
                <Input id={"signup-email"} label={t("email")} type={"email"} value={email} onChange={setEmail} required={true}></Input>
                <Input id={"signup-password"} label={t("password")} type={"password"} value={password} onChange={setPassword} required={true}></Input>
                <Input id={"signup-confirm-password"} label={t("confirmPassword")} type={"password"} value={confirmPassword} onChange={setConfirmPassword} required={true}></Input>
                {errorMessage ? (
                    <p className="w-full text-sm text-[var(--danger)]">{errorMessage}</p>
                ) : null}
                {successMessage ? (
                    <p className="w-full text-sm text-[var(--primary)]">{successMessage}</p>
                ) : null}
                <ButtonCustom
                        size="lg"
                        label={t("signup")}
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className={`p-6 text-xl ${buttonStyles.shadowInset}`}
                    />
                <div className="flex w-full pt-2 bt-1 flex-col itmes-center text-center border-t-1 gap-4">
                    <span>{t("alternative")}</span>
                    <div className="flex flex-row justify-center itmes=center gap-4" >
                        {icons.map((icon) => (
                            <button key={icon} type="button" className="mx-2 cursor-pointer">
                                <Image
                                    src={`/${icon}.svg`}
                                    alt={`${icon} icon`}
                                    width={32}
                                    height={32}
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex w-full pt-2 flex-row justify-center itmes-center gap-4 border-t-1">
                    <div className="flex flex-col justify-center">{t("loginLabel")}</div>
                    <ButtonIcon
                        size="lg"
                        label={t("login")}
                        icon={<HugeiconsIcon icon={Login }  strokeWidth={2} size={16} />}
                        onClick={onSwitchToLogin}
                    />
                </div>
            </form>
        </div>

    )
}
