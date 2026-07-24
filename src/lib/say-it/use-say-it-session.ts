"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LessonSayItQuote } from "@/lib/lessons";
import {
  buildSayItAssessment,
  isExactScriptMatch,
  type PronunciationMetricSample,
} from "@/lib/say-it/say-it-scoring";
import {
  getLessonSegmentDurationMs,
  playLessonSegment,
} from "@/lib/say-it/say-it-playback";

interface SayItStrings {
  feedbackNotQuiteThere: string;
  feedbackSuccess: string;
  micDenied: string;
  micMissing: string;
  micUnsupported: string;
  noSpeech: string;
  processing: string;
  recognitionFailed: string;
  recording: string;
  serviceUnavailable: string;
}

interface UseSayItSessionProps {
  quote: LessonSayItQuote | null;
  strings: SayItStrings;
}

interface AzurePronunciationAssessment {
  AccuracyScore?: number;
  CompletenessScore?: number;
  FluencyScore?: number;
  PronScore?: number;
  ProsodyScore?: number;
}

interface AzurePhoneme {
  PronunciationAssessment?: {
    AccuracyScore?: number;
  };
}

interface AzureWord {
  Phonemes?: AzurePhoneme[];
  PronunciationAssessment?: {
    AccuracyScore?: number;
  };
}

interface AzureBestMatch {
  PronunciationAssessment?: AzurePronunciationAssessment;
  Words?: AzureWord[];
}

interface AzureRecognitionResult {
  NBest?: AzureBestMatch[];
}

function roundAverage(values: number[]) {
  if (!values.length) {
    return null;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function minimumValue(values: number[]) {
  if (!values.length) {
    return null;
  }

  return Math.min(...values);
}

export function useSayItSession({ quote, strings }: UseSayItSessionProps) {
  const [spokenText, setSpokenText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playResetTimeoutRef = useRef<number | null>(null);
  const pronunciationRecognizerRef = useRef<{
    close: () => void;
    stopContinuousRecognitionAsync?: (
      success: () => void,
      error: (error: string) => void,
    ) => void;
  } | null>(null);
  const pronunciationAudioConfigRef = useRef<{ close: () => void } | null>(null);
  const mediaStreamsRef = useRef<MediaStream[]>([]);
  const transcriptPartsRef = useRef<string[]>([]);
  const metricsPartsRef = useRef<PronunciationMetricSample[]>([]);

  const [isScriptMatched, setIsScriptMatched] = useState(false);
  const canGoNext = isScriptMatched;

  const stopMediaStreams = useCallback(() => {
    mediaStreamsRef.current.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    });
    mediaStreamsRef.current = [];
  }, []);

  const cleanupRecognitionResources = useCallback(() => {
    pronunciationAudioConfigRef.current?.close();
    pronunciationAudioConfigRef.current = null;
    pronunciationRecognizerRef.current?.close();
    pronunciationRecognizerRef.current = null;
    stopMediaStreams();
  }, [stopMediaStreams]);

  const resetCurrentQuote = useCallback(() => {
    if (playResetTimeoutRef.current != null) {
      window.clearTimeout(playResetTimeoutRef.current);
      playResetTimeoutRef.current = null;
    }

    setSpokenText("");
    setFeedback("");
    setPronunciationScore(null);
    setAttemptCount(0);
    setIsScriptMatched(false);
    setIsListening(false);
    setIsProcessing(false);
    setIsPlaying(false);
  }, []);

  const finalizeRecognitionAttempt = useCallback(() => {
    const transcript = transcriptPartsRef.current.join(" ").trim();
    const nextPronunciation = buildSayItAssessment({
      metricsSamples: metricsPartsRef.current,
    });
    const exactMatch = quote ? isExactScriptMatch(quote.text, transcript) : false;

    setPronunciationScore(nextPronunciation.pronunciationScore);
    setSpokenText(transcript || strings.noSpeech);
    setAttemptCount((current) => current + 1);
    setIsScriptMatched(exactMatch);
    setFeedback(
      transcript
        ? exactMatch
          ? strings.feedbackSuccess
          : strings.feedbackNotQuiteThere
        : strings.noSpeech,
    );
    setIsProcessing(false);
    cleanupRecognitionResources();
  }, [cleanupRecognitionResources, quote, strings]);

  useEffect(() => {
    return () => {
      if (playResetTimeoutRef.current != null) {
        window.clearTimeout(playResetTimeoutRef.current);
      }

      cleanupRecognitionResources();
    };
  }, [cleanupRecognitionResources]);

  const playQuote = useCallback(() => {
    if (!quote || typeof window === "undefined" || isPlaying) {
      return;
    }

    setIsPlaying(true);
    playLessonSegment({
      startSec: quote.startSec,
      endSec: quote.endSec,
    });

    if (playResetTimeoutRef.current != null) {
      window.clearTimeout(playResetTimeoutRef.current);
    }

    playResetTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(false);
    }, getLessonSegmentDurationMs({ startSec: quote.startSec, endSec: quote.endSec }));
  }, [isPlaying, quote]);

  const startRecognition = useCallback(async () => {
    if (!quote || isListening || isProcessing || typeof window === "undefined") {
      return;
    }

    setSpokenText("");
    setPronunciationScore(null);
    setIsScriptMatched(false);
    setIsListening(true);
    setIsProcessing(false);
    setFeedback(strings.recording);
    transcriptPartsRef.current = [];
    metricsPartsRef.current = [];

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("microphone-not-supported");
      }

      // Safari is more reliable when we only use getUserMedia as a permission
      // preflight and let the Azure SDK manage the microphone input itself.
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamsRef.current = [permissionStream];

      const tokenResponse = await fetch("/api/azure-speech-token", {
        cache: "no-store",
      });

      if (!tokenResponse.ok) {
        throw new Error("token-request-failed");
      }

      const { token, region } = (await tokenResponse.json()) as {
        token: string;
        region: string;
      };

      const SpeechSDK = await import("microsoft-cognitiveservices-speech-sdk");
      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
        token,
        region,
      );
      speechConfig.speechRecognitionLanguage = "en-US";

      stopMediaStreams();

      const pronunciationAudioConfig =
        SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      pronunciationAudioConfigRef.current = pronunciationAudioConfig;
      const pronunciationConfig = new SpeechSDK.PronunciationAssessmentConfig(
        quote.text,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
        true,
      );
      pronunciationConfig.enableProsodyAssessment = true;

      const pronunciationRecognizer = new SpeechSDK.SpeechRecognizer(
        speechConfig,
        pronunciationAudioConfig,
      );
      pronunciationRecognizerRef.current = pronunciationRecognizer;
      pronunciationConfig.applyTo(pronunciationRecognizer);
      pronunciationRecognizer.recognized = (_sender, event) => {
        const result = event.result;

        if (!result?.text) {
          return;
        }

        transcriptPartsRef.current.push(result.text.trim());

        try {
          const jsonResult = result.properties.getProperty(
            SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult,
          );
          const parsed = jsonResult ? (JSON.parse(jsonResult) as AzureRecognitionResult) : null;
          const bestMatch = parsed?.NBest?.[0] ?? null;
          const pronunciation = bestMatch?.PronunciationAssessment ?? null;
          const words = Array.isArray(bestMatch?.Words) ? bestMatch.Words : [];
          const wordAccuracies = words
            .map((word: AzureWord) => word.PronunciationAssessment?.AccuracyScore)
            .filter((value): value is number => typeof value === "number")
            .map((value) => Math.round(value));
          const phonemeAccuracies = words
            .flatMap((word: AzureWord) =>
              Array.isArray(word.Phonemes)
                ? word.Phonemes.map(
                    (phoneme: AzurePhoneme) =>
                      phoneme.PronunciationAssessment?.AccuracyScore,
                  )
                : [],
            )
            .filter((value): value is number => typeof value === "number")
            .map((value) => Math.round(value));

          metricsPartsRef.current.push({
            accuracy:
              typeof pronunciation?.AccuracyScore === "number"
                ? Math.round(pronunciation.AccuracyScore)
                : null,
            completeness:
              typeof pronunciation?.CompletenessScore === "number"
                ? Math.round(pronunciation.CompletenessScore)
                : null,
            fluency:
              typeof pronunciation?.FluencyScore === "number"
                ? Math.round(pronunciation.FluencyScore)
                : null,
            lowPhonemeCount: phonemeAccuracies.filter((value) => value < 75).length,
            lowWordCount: wordAccuracies.filter((value) => value < 85).length,
            phonemeAccuracyAverage: roundAverage(phonemeAccuracies),
            phonemeAccuracyMin: minimumValue(phonemeAccuracies),
            pronunciation:
              typeof pronunciation?.PronScore === "number"
                ? Math.round(pronunciation.PronScore)
                : null,
            prosody:
              typeof pronunciation?.ProsodyScore === "number"
                ? Math.round(pronunciation.ProsodyScore)
                : null,
            totalPhonemeCount: phonemeAccuracies.length,
            totalWordCount: wordAccuracies.length,
            wordAccuracyAverage: roundAverage(wordAccuracies),
            wordAccuracyMin: minimumValue(wordAccuracies),
          });
        } catch {
          // Keep recognition resilient if Azure omits detailed scoring payloads.
        }
      };

      await new Promise<void>((resolve, reject) => {
        pronunciationRecognizer.startContinuousRecognitionAsync(
          () => resolve(),
          (error) => reject(error),
        );
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "speech-recognition-failed";

      if (message === "microphone-not-supported") {
        setFeedback(strings.micUnsupported);
      } else if (message === "NotAllowedError" || message === "PermissionDeniedError") {
        setFeedback(strings.micDenied);
      } else if (message === "NotFoundError") {
        setFeedback(strings.micMissing);
      } else if (message === "token-request-failed") {
        setFeedback(strings.serviceUnavailable);
      } else {
        setFeedback(strings.recognitionFailed);
      }
      setIsListening(false);
      setIsProcessing(false);
      cleanupRecognitionResources();
    }
  }, [
    cleanupRecognitionResources,
    isListening,
    isProcessing,
    quote,
    stopMediaStreams,
    strings,
  ]);

  const stopRecognition = useCallback(async () => {
    const pronunciationRecognizer = pronunciationRecognizerRef.current;
    const stopPronunciationRecognition =
      pronunciationRecognizer?.stopContinuousRecognitionAsync;

    if (!pronunciationRecognizer || !stopPronunciationRecognition) {
      return;
    }

    setIsListening(false);
    setIsProcessing(true);
    setFeedback(strings.processing);

    try {
      await new Promise<void>((resolve, reject) => {
        stopPronunciationRecognition.call(
          pronunciationRecognizer,
          () => resolve(),
          (error) => reject(error),
        );
      });

      window.setTimeout(() => {
        finalizeRecognitionAttempt();
      }, 250);
    } catch {
      setFeedback(strings.recognitionFailed);
      setIsProcessing(false);
      cleanupRecognitionResources();
    }
  }, [cleanupRecognitionResources, finalizeRecognitionAttempt, strings]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      void stopRecognition();
      return;
    }

    if (!isProcessing) {
      void startRecognition();
    }
  }, [isListening, isProcessing, startRecognition, stopRecognition]);

  return {
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
  };
}
