'use client';

import Image from "next/image";
import { useTranslations } from "next-intl";
import ButtonCustom from "../ui/button";
import Title from "../ui/title";

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative hero overflow-hidden">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Image
          src="/base.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="pointer-events-none object-contain object-right"
        />
      </div>

      <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-l from-white/35 via-white/10 to-transparent lg:w-1/2" />

      <div className="relative z-10 flex h-full items-center px-6 lg:px-8">
        <div className="flex w-full flex-col items-center gap-12 text-center lg:w-1/2 lg:gap-16">
          <div>
            <Title className="mb-4" weight="font-bold" size={64}>
              <span>{t("description")}</span>
            </Title>

            <h1 className="text-[var(--textBody)] text-3xl">
              {t("h1")}
            </h1>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h2 className="max-w-[420px] text-base text-[var(--textBody)]">
              {t("h2")}
            </h2>

            <ButtonCustom
              size="lg"
              label={t("CTA")}
              variant="primary"
              className="p-6 text-xl shadow-[inset_4px_4px_6px_rgba(255,255,255,0.4)]"
            />
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2" />
      </div>
    </section>
  );
}
