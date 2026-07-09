"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight,
  Loader,
  MicStroke,
  Play,
  QuoteDown,
  QuoteUp,
  Smileface,
  Upsetface,
} from "@/components/Icons/icons";
import ButtonIcon from "@/components/ui/button-icon";
import type { LessonSayItQuote } from "@/lib/lessons";
import { useSayItSession } from "@/lib/say-it/use-say-it-session";
import styles from "./sayIt.module.css";

interface SayItProps {
  onComplete?: () => void;
  quotes: LessonSayItQuote[];
}

export default function SayIt({ onComplete, quotes }: SayItProps) {
  const locale = useLocale();
  const tLessons = useTranslations("Lessons");
  const tGeneric = useTranslations("Generic");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const completionSentRef = useRef(false);

  const currentQuote = quotes[currentQuoteIndex] ?? null;
  const isLastQuote = currentQuoteIndex === quotes.length - 1;
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
    canGoNext,
    feedback,
    handleMicClick,
    isListening,
    isPlaying,
    isProcessing,
    isScriptMatched,
    playQuote,
    resetCurrentQuote,
    pronunciationScore,
    spokenText,
  } = useSayItSession({
    quote: currentQuote,
    strings,
  });

  function handleNext() {
    if (!currentQuote) {
      return;
    }

    if (isLastQuote) {
      resetCurrentQuote();
      setCurrentQuoteIndex(0);
      return;
    }

    resetCurrentQuote();
    setCurrentQuoteIndex((current) => current + 1);
  }

  useEffect(() => {
    if (!isLastQuote || !canGoNext) {
      completionSentRef.current = false;
      return;
    }

    if (completionSentRef.current) {
      return;
    }

    completionSentRef.current = true;
    onComplete?.();
  }, [canGoNext, isLastQuote, onComplete]);

  if (!quotes.length) {
    return null;
  }

  const showFeedbackIcon =
    Boolean(feedback) &&
    feedback !== strings.recording &&
    feedback !== strings.processing;
  const wordingFeedback = feedback || tLessons("sayItTapMic");
  const wordingLabel = tLessons.has("sayItWordingHint")
    ? tLessons("sayItWordingHint")
    : locale === "uk"
      ? "Якщо слова не збігаються, ви не можете рухатися далі."
      : "If the words don't match you can't move on.";
  const pronunciationLabel = tLessons.has("sayItPronunciationHint")
    ? tLessons("sayItPronunciationHint")
    : locale === "uk"
      ? "Це ваша загальна оцінка: вимова, інтонація, темп."
      : "This is your overall score: pronunciation, intonation, speed.";
  const overallScoreLabel = tLessons.has("sayItScore")
    ? tLessons("sayItScore")
    : locale === "uk"
      ? "Загальна оцінка: вимова, інтонація, темп"
      : "Overall score: pronunciation, intonation, speed";

  return (
    <div className={styles.sayItRoot}>
      <div className={styles.sayItTitle}>{tLessons("sayItTitle")}</div>

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

        <div className={styles.sayItResultGrid}>
          <div className={styles.sayItResultCard}>
            <div className={styles.sayItResultLabel}>
              {wordingLabel}
            </div>
            <div className={styles.sayItResultText}>
              <div className="flex items-center justify-center gap-2">
                {showFeedbackIcon ? (
                  <HugeiconsIcon
                    icon={isScriptMatched ? Smileface : Upsetface}
                    size={20}
                    strokeWidth={1.8}
                    color="currentColor"
                    aria-hidden="true"
                  />
                ) : null}
                <span>{wordingFeedback}</span>
              </div>
            </div>
          </div>

          <div className={styles.sayItResultCard}>
            <div className={styles.sayItResultLabel}>
              {pronunciationLabel}
            </div>
            <div className={styles.sayItResultRow}>
              <div className={styles.sayItResultText}>
                {overallScoreLabel}
              </div>
              <div className={styles.sayItScoreBadge}>
                {pronunciationScore == null ? "—" : `${pronunciationScore}%`}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sayItFooter}>
          <div className={styles.sayItAttempts}>
            {tLessons("sayItAttempts", { count: attemptCount })}
          </div>

          <ButtonIcon
            label={isLastQuote ? tGeneric("reset") : tGeneric("next")}
            icon={<HugeiconsIcon icon={ArrowRight} size={18} strokeWidth={1.6} />}
            size="lg"
            onClick={handleNext}
            disabled={!canGoNext}
            color="accent"
          />
        </div>
      </div>
    </div>
  );
}
