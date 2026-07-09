export const SAY_IT_PASSING_SCORE = 80;

export interface PronunciationMetricSample {
  accuracy: number | null;
  completeness: number | null;
  fluency: number | null;
  lowPhonemeCount: number;
  lowWordCount: number;
  phonemeAccuracyAverage: number | null;
  phonemeAccuracyMin: number | null;
  pronunciation: number | null;
  prosody: number | null;
  totalPhonemeCount: number;
  totalWordCount: number;
  wordAccuracyAverage: number | null;
  wordAccuracyMin: number | null;
}

interface BuildSayItAssessmentParams {
  metricsSamples: PronunciationMetricSample[];
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function normalizeWords(text: string) {
  return text
    .toLowerCase()
    .match(/[a-z0-9]+(?:'[a-z0-9]+)*/giu) ?? [];
}

function averageMetric(
  samples: PronunciationMetricSample[],
  key: keyof PronunciationMetricSample,
) {
  const values = samples
    .map((sample) => sample[key])
    .filter((value): value is number => typeof value === "number");

  if (!values.length) {
    return null;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function minimumMetric(
  samples: PronunciationMetricSample[],
  key: keyof PronunciationMetricSample,
) {
  const values = samples
    .map((sample) => sample[key])
    .filter((value): value is number => typeof value === "number");

  if (!values.length) {
    return null;
  }

  return Math.min(...values);
}

function sumMetric(
  samples: PronunciationMetricSample[],
  key:
    | "lowPhonemeCount"
    | "lowWordCount"
    | "totalPhonemeCount"
    | "totalWordCount",
) {
  return samples.reduce((sum, sample) => sum + sample[key], 0);
}

export function calculateWordCoverageScore(referenceText: string, spokenText: string) {
  const referenceWords = normalizeWords(referenceText);
  const spokenWords = normalizeWords(spokenText);

  if (referenceWords.length === 0) {
    return 0;
  }

  const dp = Array.from({ length: referenceWords.length + 1 }, () =>
    Array<number>(spokenWords.length + 1).fill(0),
  );

  for (let i = 1; i <= referenceWords.length; i += 1) {
    for (let j = 1; j <= spokenWords.length; j += 1) {
      if (referenceWords[i - 1] === spokenWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const matchedWords = dp[referenceWords.length][spokenWords.length] ?? 0;
  return Math.round((matchedWords / referenceWords.length) * 100);
}

export function buildSayItAssessment({
  metricsSamples,
}: BuildSayItAssessmentParams) {
  const accuracyScore = averageMetric(metricsSamples, "accuracy");
  const fluencyScore = averageMetric(metricsSamples, "fluency");
  const phonemeAccuracyAverage = averageMetric(
    metricsSamples,
    "phonemeAccuracyAverage",
  );
  const phonemeAccuracyMin = minimumMetric(metricsSamples, "phonemeAccuracyMin");
  const prosodyScore = averageMetric(metricsSamples, "prosody");
  const totalPhonemeCount = sumMetric(metricsSamples, "totalPhonemeCount");
  const totalWordCount = sumMetric(metricsSamples, "totalWordCount");
  const lowPhonemeCount = sumMetric(metricsSamples, "lowPhonemeCount");
  const lowWordCount = sumMetric(metricsSamples, "lowWordCount");
  const lowestFluencyScore = minimumMetric(metricsSamples, "fluency");
  const lowestProsodyScore = minimumMetric(metricsSamples, "prosody");
  const wordAccuracyAverage = averageMetric(metricsSamples, "wordAccuracyAverage");
  const wordAccuracyMin = minimumMetric(metricsSamples, "wordAccuracyMin");
  const azurePronunciationScore = averageMetric(
    metricsSamples,
    "pronunciation",
  );
  const blendedScore =
    accuracyScore == null ||
    fluencyScore == null ||
    phonemeAccuracyAverage == null ||
    prosodyScore == null ||
    wordAccuracyAverage == null
      ? null
      : Math.round(
          accuracyScore * 0.1 +
            wordAccuracyAverage * 0.2 +
            phonemeAccuracyAverage * 0.35 +
            fluencyScore * 0.15 +
            prosodyScore * 0.2,
        );
  const weakWordPenalty =
    totalWordCount > 0 ? Math.round((lowWordCount / totalWordCount) * 20) : 0;
  const weakPhonemePenalty =
    totalPhonemeCount > 0
      ? Math.round((lowPhonemeCount / totalPhonemeCount) * 35)
      : 0;
  const penaltyScore =
    blendedScore == null
      ? null
      : blendedScore - weakWordPenalty - weakPhonemePenalty;
  const cappedScore =
    penaltyScore == null
      ? null
      : clampScore(
          Math.min(
            penaltyScore,
            accuracyScore ?? penaltyScore,
            (wordAccuracyMin ?? wordAccuracyAverage ?? penaltyScore) + 10,
            (phonemeAccuracyMin ?? phonemeAccuracyAverage ?? penaltyScore) + 8,
            (lowestFluencyScore ?? fluencyScore ?? penaltyScore) + 8,
            (lowestProsodyScore ?? prosodyScore ?? penaltyScore) + 8,
          ),
        );
  const score =
    cappedScore == null
      ? azurePronunciationScore == null
        ? null
        : clampScore(azurePronunciationScore)
      : cappedScore;

  return {
    pronunciationScore: score,
  };
}

export function isExactScriptMatch(referenceText: string, spokenText: string) {
  const referenceWords = normalizeWords(referenceText);
  const spokenWords = normalizeWords(spokenText);

  if (referenceWords.length !== spokenWords.length) {
    return false;
  }

  return referenceWords.every((word, index) => word === spokenWords[index]);
}
