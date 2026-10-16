export function TextField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className={`field${error ? " is-error" : ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span className="req">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
