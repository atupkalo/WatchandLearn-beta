import styles from "./instruction-steps.module.css";

interface InstructionStepsDotsProps {
  label?: string;
  totalSteps: number;
  currentStep: number;
}

export default function InstructionStepsDots({
  label,
  totalSteps,
  currentStep,
}: InstructionStepsDotsProps) {
  return (
    <div
      className={styles.instructionStepsDots}
      aria-label={`${currentStep} of ${totalSteps} steps completed`}
    >
      {label ? <span>{label}</span> : null}
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const isActive = step <= currentStep;

        return (
          <div
            key={step}
            className={`${
              isActive ? styles.dotActive : styles.dot
            }`}
          >
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
