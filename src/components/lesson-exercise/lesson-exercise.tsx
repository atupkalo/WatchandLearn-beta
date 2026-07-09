"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import type { LessonLine, LessonSayItQuote, LessonToken } from "@/lib/lessons";
import { markLessonCompleted, markLessonStarted } from "@/lib/lesson-state";
import { ArrowRight, MicStroke } from "@/components/Icons/icons";
import ButtonCustom from "@/components/ui/button";
import ButtonIcon from "@/components/ui/button-icon";
import DropSlot from "@/components/ui/drop-slot";
import DropWord from "@/components/ui/drop-word";
import InputLesson from "@/components/ui/input-lesson";
import { TabsCustom } from "@/components/ui/tabs";
import SayIt from "@/components/sayIt/sayIt";
import styles from "./lesson-exercise.module.css";

interface LessonExerciseProps {
  lessonId: string;
  userId: string | null;
  availableModes: string[];
  lines: LessonLine[];
  sayIt?: LessonSayItQuote[];
}

const SAY_IT_UNLOCKED_EVENT = "watchandlearn:say-it-unlocked";

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

function getModeLabel(mode: string, tLessons: ReturnType<typeof useTranslations>) {
  if (mode === "easy") return tLessons("exerciseEasy");
  if (mode === "medium") return tLessons("exerciseMedium");
  if (mode === "hard") return tLessons("exerciseHard");
  return mode.charAt(0).toUpperCase() + mode.slice(1);
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
  onStartSayIt,
  isSayItUnlocked = false,
  onUnlockSayIt,
}: {
  lines: LessonLine[];
  onStartSayIt?: () => void;
  isSayItUnlocked?: boolean;
  onUnlockSayIt?: () => void;
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

  useEffect(() => {
    if (isComplete) {
      onUnlockSayIt?.();
    }
  }, [isComplete, onUnlockSayIt]);

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

      {onStartSayIt ? (
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-[var(--secondary)]">
            <HugeiconsIcon icon={MicStroke} size={22} strokeWidth={1.8} />
            <span className="text-base font-medium text-[var(--textBody)]">
              {tLessons("sayItPrompt")}
            </span>
          </div>

          <ButtonCustom
            label={tLessons("sayItOutLoud")}
            variant="accent"
            size="md"
            onClick={onStartSayIt}
            disabled={!isComplete && !isSayItUnlocked}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function LessonExercise({
  lessonId,
  userId,
  availableModes,
  lines,
  sayIt = [],
}: LessonExerciseProps) {
  const tLessons = useTranslations("Lessons");
  const sayItUnlockKey = `watchandlearn:say-it-unlocked:${lessonId}`;
  const [selectedMode, setSelectedMode] = useState(availableModes[0] ?? "easy");
  const [modeRenderKeys, setModeRenderKeys] = useState<Record<string, number>>({});
  const [isSayItOpen, setIsSayItOpen] = useState(false);
  const isSayItUnlocked = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      const handleUnlocked = () => {
        onStoreChange();
      };

      window.addEventListener("storage", handleUnlocked);
      window.addEventListener(SAY_IT_UNLOCKED_EVENT, handleUnlocked);

      return () => {
        window.removeEventListener("storage", handleUnlocked);
        window.removeEventListener(SAY_IT_UNLOCKED_EVENT, handleUnlocked);
      };
    },
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(sayItUnlockKey) === "true",
    () => false,
  );

  useEffect(() => {
    markLessonStarted(userId, lessonId);
  }, [lessonId, userId]);

  const unlockSayIt = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(sayItUnlockKey, "true");
      window.dispatchEvent(new Event(SAY_IT_UNLOCKED_EVENT));
    }
  }, [sayItUnlockKey]);

  const handleSelectionChange = useCallback((nextMode: string) => {
    if (selectedMode === nextMode) {
      return;
    }

    setModeRenderKeys((current) => ({
      ...current,
      [selectedMode]: (current[selectedMode] ?? 0) + 1,
    }));
    setSelectedMode(nextMode);
  }, [selectedMode]);

  const advanceFromEasy = useCallback(() => {
    const easyIndex = availableModes.indexOf("easy");
    const nextMode =
      availableModes[easyIndex + 1] ??
      (availableModes.includes("medium") ? "medium" : availableModes[0]);

    if (nextMode) {
      handleSelectionChange(nextMode);
    }
  }, [availableModes, handleSelectionChange]);

  const advanceFromMedium = useCallback(() => {
    const mediumIndex = availableModes.indexOf("medium");
    const nextMode =
      availableModes[mediumIndex + 1] ??
      (availableModes.includes("hard") ? "hard" : availableModes[0]);

    if (nextMode) {
      handleSelectionChange(nextMode);
    }
  }, [availableModes, handleSelectionChange]);

  const tabs = useMemo(
    () =>
      availableModes.map((mode) => ({
        id: mode,
        label: getModeLabel(mode, tLessons),
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
          ) : (
            <HardMode
              key={`hard-${modeRenderKeys.hard ?? 0}`}
              lines={lines}
              isSayItUnlocked={isSayItUnlocked}
              onUnlockSayIt={sayIt.length > 0 ? unlockSayIt : undefined}
              onStartSayIt={sayIt.length > 0 ? () => setIsSayItOpen(true) : undefined}
            />
          ),
      })),
    [
      availableModes,
      advanceFromEasy,
      advanceFromMedium,
      isSayItUnlocked,
      lines,
      modeRenderKeys,
      sayIt.length,
      tLessons,
      unlockSayIt,
    ],
  );

  return (
    <div className={styles.exerciseRoot}>
      {isSayItOpen ? (
        <SayIt
          quotes={sayIt}
          onComplete={() => markLessonCompleted(userId, lessonId)}
        />
      ) : (
        <TabsCustom
          tabs={tabs}
          selectedKey={selectedMode}
          onSelectionChange={handleSelectionChange}
        />
      )}
    </div>
  );
}
