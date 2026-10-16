export function Stepper({ steps, current, maxStep, onSelect }) {
  return (
    <ol className="stepper">
      {steps.map((step, index) => {
        const state = index === current ? "is-current" : index <= maxStep ? "is-done" : "";
        return (
          <li className="stepper__item" key={step.id}>
            <button
              type="button"
              className={`step ${state}`}
              onClick={() => onSelect(index)}
              disabled={index > maxStep}
              aria-current={index === current ? "step" : undefined}
            >
              <span className="step__index">{index + 1}</span>
              <span className="step__label">
                <span className="step__full">{step.label}</span>
                <span className="step__short">{step.short}</span>
              </span>
            </button>
            {index < steps.length - 1 && (
              <span className={`stepper__line${index < maxStep ? " is-done" : ""}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
