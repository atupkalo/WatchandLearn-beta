"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight,
  Loader,
  MicStroke,
  Play,
  QuoteDown,
  QuoteUp,
} from "@/components/Icons/icons";
import ButtonCustom from "@/components/ui/button";
import ButtonIcon from "@/components/ui/button-icon";
import type { LessonSayItQuote } from "@/lib/lessons";
import { useSayItSession } from "@/lib/say-it/use-say-it-session";
import styles from "./sayIt.module.css";

const SAY_IT_ADVANCE_ATTEMPT_COUNT = 3;

interface SayItProps {
  onComplete?: () => void;
  quotes: LessonSayItQuote[];
}

export default function SayIt({ onComplete, quotes }: SayItProps) {
  const tGeneric = useTranslations("Generic");
  const tLessons = useTranslations("Lessons");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const completionSentRef = useRef(false);

  const currentQuote = quotes[currentQuoteIndex] ?? null;
  const strings = useMemo(
    () => ({
      feedbackNotQuiteThere: tLessons.has("sayItFeedbackNotQuiteThere")
        ? tLessons("sayItFeedbackNotQuiteThere")
        : tLessons("sayItFeedbackRetry"),
      feedbackSuccess: tLessons("sayItFeedbackSuccess"),
      micDenied: tLessons("sayItMicDenied"),
      micMissing: tLessons("sayItMicMissing"),
      micUnsupported: tLessons("sayItMicUnsupported"),
      noSpeech: tLessons("sayItNoSpeech"),
      processing: tLessons("sayItProcessing"),
      recognitionFailed: tLessons("sayItRecognitionFailed"),
      recording: tLessons("sayItRecording"),
      serviceUnavailable: tLessons("sayItServiceUnavailable"),
    }),
    [tLessons],
  );
  const {
    attemptCount,
    feedback,
    handleMicClick,
    isListening,
    isPlaying,
    isProcessing,
    isScriptMatched,
    playQuote,
    resetCurrentQuote,
    spokenText,
  } = useSayItSession({
    quote: currentQuote,
    strings,
  });
  const canAdvanceCurrentQuote =
    isScriptMatched || attemptCount >= SAY_IT_ADVANCE_ATTEMPT_COUNT;
  const isLastQuote = currentQuoteIndex === quotes.length - 1;
  const visibleFeedback =
    feedback && feedback !== strings.recording && feedback !== strings.processing
      ? isScriptMatched
        ? "success"
        : "error"
      : null;

  if (!quotes.length) {
    return null;
  }

  function handleReset() {
    completionSentRef.current = false;
    resetCurrentQuote();
    setCurrentQuoteIndex(0);
  }

  function handleNext() {
    if (!canAdvanceCurrentQuote || isListening || isProcessing) {
      return;
    }

    if (isLastQuote) {
      if (completionSentRef.current) {
        return;
      }

      completionSentRef.current = true;
      onComplete?.();
      return;
    }

    resetCurrentQuote();
    setCurrentQuoteIndex((current) => current + 1);
  }

  if (!currentQuote) {
    return null;
  }

  return (
    <div className={styles.sayItRoot}>
      <div className={styles.sayItCard}>
        <div className={styles.sayItBlock}>
          <div className={styles.sayItLabel}>{tLessons("sayItLineToSay")}</div>
          <div className={styles.sayItQuote}>
            <HugeiconsIcon
              icon={QuoteUp}
              size={18}
              strokeWidth={1.6}
              color="var(--textBody)"
            />
            <span>{currentQuote?.text}</span>
            <HugeiconsIcon
              icon={QuoteDown}
              size={18}
              strokeWidth={1.6}
              color="var(--textBody)"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            className={styles.sayItMicButton}
            onClick={playQuote}
            aria-label={tLessons("sayItPlay")}
            disabled={isPlaying}
          >
            <HugeiconsIcon
              icon={Play}
              size={32}
              strokeWidth={1.8}
              color="var(--primary)"
            />
          </button>

          <button
            type="button"
            className={`${styles.sayItMicButton} ${
              isListening ? styles.sayItMicButtonActive : ""
            }`}
            onClick={handleMicClick}
            aria-label={tLessons("sayItMicAriaLabel")}
            disabled={isProcessing}
          >
            <span
              className={`${styles.sayItMicGlyph} ${
                isListening ? styles.sayItMicGlyphActive : ""
              }`}
            >
              <HugeiconsIcon
                icon={MicStroke}
                size={32}
                strokeWidth={1.8}
                color="var(--accent)"
              />
            </span>
          </button>
        </div>

        <div className={styles.sayItBlock}>
          <div className={styles.sayItLabel}>{tLessons("sayItYouSaid")}</div>
          <div className={styles.sayItTranscript}>
            {isProcessing ? (
              <span className={styles.sayItLoaderWrap}>
                <HugeiconsIcon
                  icon={Loader}
                  size={24}
                  strokeWidth={1.8}
                  className={styles.sayItLoader}
                />
              </span>
            ) : (
              spokenText
            )}
          </div>
        </div>

        {visibleFeedback ? (
          <div
            className={`${styles.sayItFeedback} ${
              visibleFeedback === "success"
                ? styles.sayItFeedbackSuccess
                : styles.sayItFeedbackError
            }`}
          >
            {feedback}
          </div>
        ) : null}

        <div className={styles.sayItAttempts}>
          {tLessons("sayItAttempts", { count: attemptCount })}
        </div>

        <div className={styles.sayItFooter}>
          <ButtonCustom
            label={tLessons("translateItReset")}
            variant="secondary"
            size="sm"
            onClick={handleReset}
          />
          {canAdvanceCurrentQuote ? (
            <ButtonIcon
              label={tGeneric("next")}
              icon={<HugeiconsIcon icon={ArrowRight} size={18} strokeWidth={1.6} />}
              size="lg"
              onClick={handleNext}
              disabled={isListening || isProcessing}
              color="accent"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
