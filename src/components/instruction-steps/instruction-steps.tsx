"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft, ArrowRight } from "../Icons/icons";
import ButtonCustom from "../ui/button";
import ButtonIcon from "../ui/button-icon";
import InstructionStepsDots from "./instruction-steps-dots";
import styles from "./instruction-steps.module.css";

interface InstructionStep {
  title: string;
  body: string;
  image?: string;
}

interface InstructionStepsProps {
  isOpen: boolean;
  steps: InstructionStep[];
  onStart?: () => void;
  onSkip?: () => void;
}

export default function InstructionSteps({
  isOpen,
  steps,
  onStart,
  onSkip,
}: InstructionStepsProps) {
  const locale = useLocale();
  const t = useTranslations("LessonInstructions");
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen || steps.length === 0) {
    return null;
  }

  const activeStep = steps[currentStep];
  const hasPreviousStep = currentStep > 0;
  const hasNextStep = currentStep < steps.length - 1;
  const progressLabel =
    steps.length === 7
      ? locale === "uk"
        ? "Сім простих кроків"
        : "Seven simple steps"
      : t("progressLabel");

  const handleNext = () => {
    setCurrentStep((previousStep) =>
      Math.min(previousStep + 1, steps.length - 1),
    );
  };

  const handlePrevious = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  };

  const handleStart = () => {
    setCurrentStep(0);
    onStart?.();
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onSkip?.();
  };

  return (
    <div className={styles.lessonInstructionOverlay}>
      <div
        className={styles.lessonInstructionDialog}
        role="dialog"
        aria-modal="true"
        aria-label={activeStep.title}
      >
        <div className={styles.lessonInstructionCard}>
          <div className={styles.lessonInstructionHeader}>
            <div className={styles.lessonInstructionEyebrow}>{t("title")}</div>

            <InstructionStepsDots
              label={progressLabel}
              totalSteps={steps.length}
              currentStep={currentStep + 1}
            />
          </div>

          <div>
            <div className={styles.lessonInstructionStepRow}>
              <span className={styles.lessonInstructionStepLabel}>
                {t("stepLabel", { current: currentStep + 1, total: steps.length })}
              </span>
              <span className={styles.lessonInstructionStepTitle}>
                {activeStep.title}
              </span>
            </div>

            <p className={styles.lessonInstructionBody}>{activeStep.body}</p>
          </div>

          {activeStep.image ? (
            <div className={styles.imageContainer}>
              <div
                aria-hidden={!hasPreviousStep}
                style={{ visibility: hasPreviousStep ? "visible" : "hidden" }}
              >
                <ButtonIcon
                  label={t("previousButton")}
                  icon={
                    <HugeiconsIcon
                      icon={ArrowLeft}
                      size={18}
                      strokeWidth={1.6}
                    />
                  }
                  size="lg"
                  iconPosition="left"
                  onClick={hasPreviousStep ? handlePrevious : undefined}
                />
              </div>

              <div className={styles.lessonInstructionImageWrap}>
                <Image
                  src={activeStep.image}
                  alt={activeStep.title}
                  width={520}
                  height={260}
                  className={styles.lessonInstructionImage}
                />
              </div>

              <div
                aria-hidden={!hasNextStep}
                style={{ visibility: hasNextStep ? "visible" : "hidden" }}
              >
                <ButtonIcon
                  label={t("nextButton")}
                  icon={
                    <HugeiconsIcon
                      icon={ArrowRight}
                      size={18}
                      strokeWidth={1.6}
                    />
                  }
                  size="lg"
                  onClick={hasNextStep ? handleNext : undefined}
                />
              </div>
            </div>

          ) : null}

          <ButtonCustom
            label={t("startButton")}
            variant="accent"
            size="sm"
            className={`${styles.lessonInstructionButton} ${styles.lessonInstructionButtonCentered}`}
            onClick={handleStart}
          />

          <div className={styles.lessonInstructionFooter}>
            <div className={styles.lessonInstructionSkip}>
              <div className={styles.lessonInstructionSkipText}>
                {t("skipForever")}
              </div>

              <ButtonCustom
                label={t("skipButton")}
                variant="secondary"
                size="sm"
                className={styles.lessonInstructionSkipButton}
                onClick={handleSkip}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
