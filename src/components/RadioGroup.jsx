export function RadioGroup({ legend, hint, name, options, value, onChange, error, required = false }) {
  const errorId = `${name}-error`;

  return (
    <fieldset className={`choices${error ? " is-error" : ""}`} aria-describedby={error ? errorId : undefined}>
      <legend className="choices__legend">
        {legend}
        {required ? <span className="req">*</span> : null}
      </legend>
      {hint ? <p className="choices__hint">{hint}</p> : null}
      <div className="choices__list">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label key={option.value} className={`radio${selected ? " is-selected" : ""}`}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(name, option.value)}
              />
              <span className="radio__ui" aria-hidden="true" />
              <span className="radio__label">{option.label}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
