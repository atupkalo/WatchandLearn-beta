"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import type {
  LessonLine,
  LessonSayItQuote,
  LessonToken,
  LessonTranslateItQuote,
} from "@/lib/lessons";
import type { LessonPracticeStepId } from "@/lib/lesson-practice";
import { markLessonCompleted, markLessonStarted } from "@/lib/lesson-state";
import { useLessonStepAccess } from "@/lib/use-lesson-step-access";
import { ArrowRight } from "@/components/Icons/icons";
import ButtonCustom from "@/components/ui/button";
import ButtonIcon from "@/components/ui/button-icon";
import DropSlot from "@/components/ui/drop-slot";
import DropWord from "@/components/ui/drop-word";
import InputLesson from "@/components/ui/input-lesson";
import { TabsCustom } from "@/components/ui/tabs";
import SayIt from "@/components/sayIt/sayIt";
import TranslateIt from "@/components/translate-it/translate-it";
import styles from "./lesson-exercise.module.css";

interface LessonExerciseProps {
  lessonId: string;
  userId: string | null;
  lines: LessonLine[];
  sayIt?: LessonSayItQuote[];
  translateIt?: LessonTranslateItQuote[];
}

interface EasyGroup {
  lines: LessonLine[];
}

type ValidationState = "default" | "success" | "error";
type HardInputState = "default" | "active" | "success" | "error";
type EasyOptionState = "default" | "success" | "error";

function hasEasyBlank(line: LessonLine) {
  return line.modes.easy.snaps.some((snap) => snap.blanks.length > 0);
}

function buildEasyGroups(lines: LessonLine[]): EasyGroup[] {
  const groups: EasyGroup[] = [];
  let index = 0;

  while (index < lines.length) {
    const groupLines: LessonLine[] = [lines[index]];

    if (!hasEasyBlank(lines[index])) {
      let nextIndex = index + 1;

      while (nextIndex < lines.length) {
        groupLines.push(lines[nextIndex]);

        if (hasEasyBlank(lines[nextIndex])) {
          nextIndex += 1;
          break;
        }

        nextIndex += 1;
      }

      groups.push({ lines: groupLines });
      index = nextIndex;
      continue;
    }

    groups.push({ lines: groupLines });
    index += 1;
  }

  return groups;
}

function tokenizeEasyText(text: string) {
  const parts: Array<{ type: "text" | "blank"; value: string }> = [];
  const matcher = /\[\[(.*?)\]\]/gu;
  let lastIndex = 0;

  for (const match of text.matchAll(matcher)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, matchIndex),
      });
    }

    parts.push({
      type: "blank",
      value: match[1],
    });

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return parts;
}

function getTokenWidth(tokenText: string) {
  return String(Math.max(36, tokenText.length * 12));
}

function getModeLabel(mode: LessonPracticeStepId, tLessons: ReturnType<typeof useTranslations>) {
  if (mode === "easy") return tLessons("exerciseEasy");
  if (mode === "medium") return tLessons("exerciseMedium");
  if (mode === "hard") return tLessons("exerciseHard");
  if (mode === "say-it") return tLessons("exerciseSayIt");
  if (mode === "translate-it") return tLessons("exerciseTranslate");
  return mode;
}

function EasyMode({
  lines,
  onAdvanceToMedium,
}: {
  lines: LessonLine[];
  onAdvanceToMedium: () => void;
}) {
  const tGeneric = useTranslations("Generic");
  const tLessons = useTranslations("Lessons");
  const easyGroups = useMemo(() => buildEasyGroups(lines), [lines]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, ValidationState>>({});
  const [optionStates, setOptionStates] = useState<
    Record<string, { selectedWord: string; status: EasyOptionState }>
  >({});

  const currentGroup = easyGroups[groupIndex] ?? null;
  const visibleGroups = easyGroups.slice(0, groupIndex + 1);
  const allBlanks = useMemo(
    () =>
      easyGroups.flatMap((group) =>
        group.lines.flatMap((line) =>
          line.modes.easy.snaps.flatMap((snap) => snap.blanks),
        ),
      ),
    [easyGroups],
  );
  const isExerciseComplete =
    allBlanks.length > 0 &&
    allBlanks.every(
      (blank) => answers[blank.tokenId]?.toLowerCase() === blank.answer.toLowerCase(),
    );

  function resetExercise() {
    setGroupIndex(0);
    setAnswers({});
    setStatuses({});
    setOptionStates({});
  }

  function goToNextGroup() {
    setGroupIndex((current) => Math.min(current + 1, easyGroups.length - 1));
  }

  if (!currentGroup) {
    return null;
  }

  const currentGroupBlanks = currentGroup.lines.flatMap((line) =>
    line.modes.easy.snaps.flatMap((snap) => snap.blanks),
  );

  function handleOptionClick(tokenId: string, answer: string, selectedWord: string) {
    if (answers[tokenId]?.toLowerCase() === answer.toLowerCase()) {
      return;
    }

    if (selectedWord.toLowerCase() !== answer.toLowerCase()) {
      setStatuses((current) => ({
        ...current,
        [tokenId]: "error",
      }));
      setOptionStates((current) => ({
        ...current,
        [tokenId]: {
          selectedWord,
          status: "error",
        },
      }));
      return;
    }

    const nextAnswers = {
      ...answers,
      [tokenId]: answer,
    };

    setAnswers(nextAnswers);
    setStatuses((current) => ({
      ...current,
      [tokenId]: "success",
    }));
    setOptionStates((current) => ({
      ...current,
      [tokenId]: {
        selectedWord,
        status: "success",
      },
    }));

    const completed = currentGroupBlanks.every(
      (blank) => nextAnswers[blank.tokenId]?.toLowerCase() === blank.answer.toLowerCase(),
    );

    if (completed && groupIndex < easyGroups.length - 1) {
      window.setTimeout(() => {
        goToNextGroup();
      }, 300);
    }
  }

  return (
    <div className={styles.exercisePanel}>
      <div className={styles.exerciseCard}>
        {visibleGroups.map((group, visibleGroupIndex) => {
          const isCurrentGroup = visibleGroupIndex === groupIndex;

          return group.lines.map((line) => (
            <div key={line.lineNumber} className={styles.easyLineRow}>
              <div className={styles.lineLabel}>
                {tLessons("lineLabel")} {line.lineNumber}
              </div>

              <div className={styles.lineContent}>
                {line.modes.easy.snaps.map((snap) => {
                  const parts = tokenizeEasyText(snap.text);
                  let blankIndex = 0;

                  return (
                    <div key={snap.snapNumber} className={styles.lineBlock}>
                      <div className={styles.lineText}>
                        {parts.map((part, index) => {
                          if (part.type === "text") {
                            return (
                              <span key={`${snap.snapNumber}-text-${index}`}>
                                {part.value}
                              </span>
                            );
                          }

                          const blank = snap.blanks[blankIndex];
                          blankIndex += 1;

                          if (!blank) {
                            return null;
                          }

                          return (
                            <DropSlot
                              key={blank.tokenId}
                              width={getTokenWidth(blank.answer)}
                              value={answers[blank.tokenId] ?? ""}
                              status={statuses[blank.tokenId] ?? "default"}
                            />
                          );
                        })}
                      </div>

                      {isCurrentGroup && snap.blanks.length > 0 ? (
                        <div className={styles.optionGroups}>
                          {snap.blanks.map((blank) => (
                            <div key={blank.tokenId} className={styles.optionRow}>
                              {blank.options.map((option) => (
                                <DropWord
                                  key={`${blank.tokenId}-${option}`}
                                  word={option}
                                  status={
                                    optionStates[blank.tokenId]?.selectedWord === option
                                      ? optionStates[blank.tokenId]?.status
                                      : "default"
                                  }
                                  disabled={
                                    answers[blank.tokenId]?.toLowerCase() ===
                                    blank.answer.toLowerCase()
                                  }
                                  onClick={(word) =>
                                    isCurrentGroup
                                      ? handleOptionClick(blank.tokenId, blank.answer, word)
                                      : undefined
                                  }
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ));
        })}
      </div>

      {isExerciseComplete ? (
        <div className={styles.exerciseControls}>
          <ButtonCustom
            label={tGeneric("reset")}
            variant="secondary"
            onClick={resetExercise}
          />
          <ButtonIcon
            size="sm"
            label={tGeneric("next")}
            color="accent"
            icon={
              <HugeiconsIcon
                icon={ArrowRight}
                size={18}
                strokeWidth={1.6}
              />
            }
            onClick={onAdvanceToMedium}
          />
        </div>
      ) : null}
    </div>
  );
}

function MediumMode({
  lines,
  onAdvanceToHard,
}: {
  lines: LessonLine[];
  onAdvanceToHard: () => void;
}) {
  const tGeneric = useTranslations("Generic");
  const tLessons = useTranslations("Lessons");
  const [values, setValues] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, ValidationState>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const blankedTokenIds = useMemo(
    () => lines.flatMap((line) => line.modes.medium.blankedTokenIds),
    [lines],
  );
  const isExerciseComplete =
    blankedTokenIds.length > 0 &&
    blankedTokenIds.every((tokenId) => locked[tokenId] === true);

  function resetExercise() {
    setValues({});
    setStatuses({});
    setLocked({});
  }

  function handleValidate(token: LessonToken) {
    if (locked[token.id]) {
      return;
    }

    const currentValue = values[token.id]?.trim() ?? "";

    if (!currentValue) {
      setStatuses((current) => ({
        ...current,
        [token.id]: "default",
      }));
      return;
    }

    if (currentValue.toLowerCase() === token.text.toLowerCase()) {
      setValues((current) => ({
        ...current,
        [token.id]: token.text,
      }));
      setStatuses((current) => ({
        ...current,
        [token.id]: "success",
      }));
      setLocked((current) => ({
        ...current,
        [token.id]: true,
      }));
      return;
    }

    setStatuses((current) => ({
      ...current,
      [token.id]: "error",
    }));
  }

  return (
    <div className={styles.exercisePanel}>
      <div className={styles.exerciseCard}>
        <div className={styles.mediumLines}>
        {lines.map((line) => {
          const blankedTokenIdSet = new Set(line.modes.medium.blankedTokenIds);

          return (
            <div key={line.lineNumber} className={styles.lineRow}>
              <div className={styles.lineLabel}>
                {tLessons("lineLabel")} {line.lineNumber}
              </div>

              <div className={styles.lineContent}>
                <div className={styles.mediumText}>
                  {line.tokens.map((token) => {
                    const suffix = token.punctuationAfter;

                    if (!blankedTokenIdSet.has(token.id)) {
                      return (
                        <span key={token.id}>
                          {token.text}
                          {suffix}
                        </span>
                      );
                    }

                    return (
                      <span key={token.id} className={styles.optionRow}>
                      <InputLesson
                        name={token.id}
                        value={values[token.id] ?? ""}
                        width={getTokenWidth(token.text)}
                        height="22"
                        paddingX="4"
                        status={statuses[token.id] ?? "default"}
                        className={styles.mediumInput}
                        onChange={(nextValue) =>
                          setValues((current) => ({
                            ...current,
                              [token.id]: nextValue,
                            }))
                          }
                          onBlur={() => handleValidate(token)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleValidate(token);
                            }
                          }}
                          readOnly={locked[token.id] === true}
                        />
                        <span>{suffix}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {isExerciseComplete ? (
        <div className={styles.exerciseControls}>
          <ButtonCustom
            label={tGeneric("reset")}
            variant="secondary"
            onClick={resetExercise}
          />
          <ButtonIcon
            size="sm"
            label={tGeneric("next")}
            color="accent"
            icon={
              <HugeiconsIcon
                icon={ArrowRight}
                size={18}
                strokeWidth={1.6}
              />
            }
            onClick={onAdvanceToHard}
          />
        </div>
      ) : null}
    </div>
  );
}

function HardMode({
  lines,
  onAdvanceToSayIt,
}: {
  lines: LessonLine[];
  onAdvanceToSayIt?: () => void;
}) {
  const tGeneric = useTranslations("Generic");
  const tLessons = useTranslations("Lessons");
  const sequence = useMemo(
    () => lines.flatMap((line) => line.tokens),
    [lines],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [revealedTokenIds, setRevealedTokenIds] = useState<Set<string>>(() => new Set());
  const [inputState, setInputState] = useState<HardInputState>("default");

  const currentToken = sequence[currentIndex] ?? null;
  const isComplete = currentToken == null;

  function revealCurrentToken() {
    if (!currentToken) {
      return;
    }

    setRevealedTokenIds((current) => {
      const next = new Set(current);
      next.add(currentToken.id);
      return next;
    });
    setCurrentIndex((current) => current + 1);
    setInputValue("");
    setInputState("default");
  }

  function resetExercise() {
    setCurrentIndex(0);
    setInputValue("");
    setInputState("default");
    setRevealedTokenIds(new Set());
  }

  function handleInputChange(nextValue: string) {
    setInputValue(nextValue);

    if (!currentToken) {
      setInputState("default");
      return;
    }

    const expected = currentToken.text.toLowerCase();
    const current = nextValue.toLowerCase();

    if (!current) {
      setInputState("default");
      return;
    }

    if (expected.startsWith(current)) {
      if (expected === current) {
        setInputState("success");
        window.setTimeout(() => {
          revealCurrentToken();
        }, 300);
        return;
      }

      setInputState("active");
      return;
    }

    setInputState("error");
  }

  function getHardInputClassName() {
    const classNames = [styles.hardInput];

    return classNames.join(" ");
  }

  function getHiddenToken(tokenText: string) {
    return "_".repeat(Math.max(1, Array.from(tokenText).length));
  }

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.hardControls}>
        <InputLesson
          value={inputValue}
          width="220"
          height="36"
          paddingX="8"
          status={inputState}
          onChange={handleInputChange}
          readOnly={isComplete || inputState === "success"}
          className={getHardInputClassName()}
        />

        {isComplete ? (
          <ButtonCustom
            label={tGeneric("reset")}
            variant="secondary"
            className={styles.hardButton}
            onClick={resetExercise}
          />
        ) : (
          <ButtonCustom
            label={tLessons("dontKnow")}
            variant="secondary"
            className={styles.hardButton}
            onClick={revealCurrentToken}
          />
        )}
      </div>

      {isComplete ? (
        <div className={styles.completedText}>{tLessons("exerciseCompleted")}</div>
      ) : null}

      <div className={styles.hardSchema}>
        {lines.map((line) => (
          <div key={line.lineNumber} className={styles.hardSchemaLine}>
            <span className={styles.lineLabel}>
              {tLessons("lineLabel")} {line.lineNumber}
            </span>
            {line.tokens.map((token) => {
              const visibleToken = revealedTokenIds.has(token.id)
                ? token.text
                : getHiddenToken(token.text);

              return (
                <span key={token.id} className={styles.hardSchemaToken}>
                  {visibleToken}
                  {token.punctuationAfter}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {isComplete && onAdvanceToSayIt ? (
        <div className={styles.exerciseControls}>
          <ButtonCustom
            label={tGeneric("reset")}
            variant="secondary"
            onClick={resetExercise}
          />
          <ButtonIcon
            size="sm"
            label={tGeneric("next")}
            color="accent"
            icon={
              <HugeiconsIcon
                icon={ArrowRight}
                size={18}
                strokeWidth={1.6}
              />
            }
            onClick={onAdvanceToSayIt}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function LessonExercise({
  lessonId,
  userId,
  lines,
  sayIt = [],
  translateIt = [],
}: LessonExerciseProps) {
  const tLessons = useTranslations("Lessons");
  const hasAdvancedPractice = sayIt.length > 0 && translateIt.length > 0;
  const { stepOrder, isStepLocked } = useLessonStepAccess({
    hasAdvancedPractice,
  });
  const [selectedMode, setSelectedMode] = useState<LessonPracticeStepId>(
    stepOrder[0] ?? "easy",
  );
  const [modeRenderKeys, setModeRenderKeys] = useState<Record<string, number>>({});

  useEffect(() => {
    markLessonStarted(userId, lessonId);
  }, [lessonId, userId]);

  const handleSelectionChange = useCallback((nextMode: string) => {
    const nextStep = nextMode as LessonPracticeStepId;

    if (selectedMode === nextMode) {
      return;
    }

    if (isStepLocked(nextStep)) {
      return;
    }

    setModeRenderKeys((current) => ({
      ...current,
      [selectedMode]: (current[selectedMode] ?? 0) + 1,
    }));
    setSelectedMode(nextStep);
  }, [isStepLocked, selectedMode]);

  const advanceFromEasy = useCallback(() => {
    handleSelectionChange("medium");
  }, [handleSelectionChange]);

  const advanceFromMedium = useCallback(() => {
    handleSelectionChange("hard");
  }, [handleSelectionChange]);

  const tabs = useMemo(
    () =>
      stepOrder.map((mode, index) => ({
        id: mode,
        label: `${index + 1} ${getModeLabel(mode, tLessons)}`,
        disabled: isStepLocked(mode),
        content:
          mode === "easy" ? (
            <EasyMode
              key={`easy-${modeRenderKeys.easy ?? 0}`}
              lines={lines}
              onAdvanceToMedium={advanceFromEasy}
            />
          ) : mode === "medium" ? (
            <MediumMode
              key={`medium-${modeRenderKeys.medium ?? 0}`}
              lines={lines}
              onAdvanceToHard={advanceFromMedium}
            />
          ) : mode === "hard" ? (
            <HardMode
              key={`hard-${modeRenderKeys.hard ?? 0}`}
              lines={lines}
              onAdvanceToSayIt={
                hasAdvancedPractice ? () => handleSelectionChange("say-it") : undefined
              }
            />
          ) : mode === "say-it" ? (
            <SayIt
              quotes={sayIt}
              onComplete={() => handleSelectionChange("translate-it")}
            />
          ) : (
            <TranslateIt
              quotes={translateIt}
              onComplete={() => markLessonCompleted(userId, lessonId)}
            />
          ),
      })),
    [
      advanceFromEasy,
      advanceFromMedium,
      handleSelectionChange,
      hasAdvancedPractice,
      isStepLocked,
      lines,
      modeRenderKeys,
      sayIt,
      tLessons,
      translateIt,
      userId,
      lessonId,
      stepOrder,
    ],
  );

  return (
    <div className={styles.exerciseRoot}>
      <TabsCustom
        tabs={tabs}
        selectedKey={selectedMode}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
