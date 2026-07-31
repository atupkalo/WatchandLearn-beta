"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loader,
  MicStroke,
  QuoteDown,
  QuoteUp,
} from "@/components/Icons/icons";
import AccordionSquare from "@/components/ui/accordion-square";
import ButtonCustom from "@/components/ui/button";
import { useUserPreferences } from "@/components/providers/user-preferences-provider";
import type { LessonTranslateItQuote } from "@/lib/lessons";
import { useSayItSession } from "@/lib/say-it/use-say-it-session";
import styles from "./translate-it.module.css";

interface TranslateItProps {
  quotes: LessonTranslateItQuote[];
  onComplete?: () => void;
}

export default function TranslateIt({
  quotes,
  onComplete,
}: TranslateItProps) {
  const tLessons = useTranslations("Lessons");
  const { studyLanguage } = useUserPreferences();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const completionSentRef = useRef(false);
  const advanceTimeoutRef = useRef<number | null>(null);

  const currentQuote = quotes[currentQuoteIndex] ?? null;
  const sourceText = useMemo(() => {
    if (!currentQuote) {
      return "";
    }

    return studyLanguage === "en-ru"
      ? currentQuote.translations.ru
      : currentQuote.translations.ua;
  }, [currentQuote, studyLanguage]);
  const strings = useMemo(
    () => ({
      feedbackNotQuiteThere: tLessons("translateItFeedbackRetry"),
      feedbackSuccess: tLessons("translateItFeedbackSuccess"),
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
    isProcessing,
    isScriptMatched,
    resetCurrentQuote,
    spokenText,
  } = useSayItSession({
    quote: currentQuote,
    strings,
  });
  const isCompleted = currentQuoteIndex === quotes.length - 1 && isScriptMatched;
  const visibleFeedback =
    feedback && feedback !== strings.recording && feedback !== strings.processing
      ? isScriptMatched
        ? "success"
        : "error"
      : null;

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current != null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScriptMatched || isCompleted) {
      return;
    }

    if (currentQuoteIndex === quotes.length - 1) {
      if (!completionSentRef.current) {
        completionSentRef.current = true;
        onComplete?.();
      }

      return;
    }

    advanceTimeoutRef.current = window.setTimeout(() => {
      resetCurrentQuote();
      setCurrentQuoteIndex((current) => current + 1);
    }, 900);

    return () => {
      if (advanceTimeoutRef.current != null) {
        window.clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
    };
  }, [currentQuoteIndex, isCompleted, isScriptMatched, onComplete, quotes.length, resetCurrentQuote]);

  function handleReset() {
    if (advanceTimeoutRef.current != null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    completionSentRef.current = false;
    setCurrentQuoteIndex(0);
    resetCurrentQuote();
  }

  if (!quotes.length || !currentQuote) {
    return null;
  }

  return (
    <div className={styles.translateItRoot}>
      <div className={styles.translateItCard}>
        <div className={styles.translateItBlock}>
          <div className={styles.translateItLabel}>
            {tLessons("translateItLineLabel")}
          </div>
          <div className={styles.translateItQuote}>
            <HugeiconsIcon
              icon={QuoteUp}
              size={18}
              strokeWidth={1.6}
              color="var(--textBody)"
            />
            <span>{sourceText}</span>
            <HugeiconsIcon
              icon={QuoteDown}
              size={18}
              strokeWidth={1.6}
              color="var(--textBody)"
            />
          </div>
        </div>

        <AccordionSquare
          title={tLessons("translateItRevealAnswer")}
          disabled={attemptCount < 3}
        >
          {currentQuote.text}
        </AccordionSquare>

        <div className={styles.translateItMicRow}>
          <button
            type="button"
            className={`${styles.translateItMicButton} ${
              isListening ? styles.translateItMicButtonActive : ""
            }`}
            onClick={handleMicClick}
            aria-label={tLessons("translateItMicAriaLabel")}
            disabled={isProcessing || isCompleted}
          >
            <span
              className={`${styles.translateItMicGlyph} ${
                isListening ? styles.translateItMicGlyphActive : ""
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

        <div className={styles.translateItBlock}>
          <div className={styles.translateItLabel}>{tLessons("sayItYouSaid")}</div>
          <div className={styles.translateItTranscript}>
            {isProcessing ? (
              <HugeiconsIcon
                icon={Loader}
                size={24}
                strokeWidth={1.8}
                className={styles.translateItLoader}
              />
            ) : (
              spokenText
            )}
          </div>
        </div>

        {isCompleted ? (
          <div className={styles.translateItCompleted}>
            {tLessons("translateItCompleted")}
          </div>
        ) : visibleFeedback ? (
          <div
            className={`${styles.translateItFeedback} ${
              visibleFeedback === "success"
                ? styles.translateItFeedbackSuccess
                : styles.translateItFeedbackError
            }`}
          >
            {feedback}
          </div>
        ) : null}

        <div className={styles.translateItAttempts}>
          {tLessons("sayItAttempts", { count: attemptCount })}
        </div>

        <div className={styles.translateItFooter}>
          <ButtonCustom
            label={tLessons("translateItReset")}
            variant="secondary"
            size="sm"
            onClick={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
