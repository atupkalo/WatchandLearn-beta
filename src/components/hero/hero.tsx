'use client';

import Image from "next/image";
import { useTranslations } from "next-intl";
import ButtonCustom from "../ui/button";
import Title from "../ui/title";
import { useEffect, useState } from "react";
import uiStyles from "../ui/ui.module.css";
import styles from "./hero.module.css";

const layers = [
  "/l1.png",
  "/l2.png",
  "/l3.png",
  "/l4.png",
  "/l5.png",
  "/l6.png",
  "/l7.png",
  "/l8.png",
  "/l9.png",
  "/l10.png",
  "/l11.png",
  "/l12.png",
];
const layerLifetimeInSeconds = 3;
const animationStepInMilliseconds = 1000;
const cycleLength = layers.length + layerLifetimeInSeconds - 1;

export default function Hero() {
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations("Hero");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentStep((previousStep) => (previousStep + 1) % cycleLength);
    }, animationStepInMilliseconds);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className={`${styles.hero} relative overflow-hidden`}>
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Image
          src="/base.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="pointer-events-none object-contain object-right"
        />
        {layers.map((layerSrc, index) => {
          const isVisible =
            currentStep >= index &&
            currentStep < index + layerLifetimeInSeconds;

          return (
            <Image
              key={layerSrc}
              src={layerSrc}
              alt=""
              fill
              priority={index === 0}
              sizes="50vw"
              className={`pointer-events-none object-contain object-right transition-opacity duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

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
            <a href="/signup">
              <ButtonCustom
                size="lg"
                label={t("CTA")}
                variant="primary"
                className={`p-6 text-xl ${uiStyles.shadowInset}`}
              />
            </a>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2" />
      </div>
    </section>
  );
}
