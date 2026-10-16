import { PrimaryButton } from "./PrimaryButton";

const OPTIONS = [
  {
    value: "personal",
    title: "Cá nhân",
    description: "Đăng ký cho học sinh và phụ huynh",
  },
  {
    value: "school",
    title: "Nhà trường",
    description: "Đăng ký theo đơn vị trường học",
  },
];

export function TypePicker({ value, error, onSelect, onNext }) {
  return (
    <form
      className="form type-picker"
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      noValidate
    >
      <fieldset className={`type-picker__fieldset${error ? " is-error" : ""}`}>
        <legend className="section-title">Bạn đăng ký với tư cách nào?</legend>
        <p className="type-picker__hint">Chọn hình thức phù hợp để hiển thị form đăng ký</p>
        <div className="type-picker__list">
          {OPTIONS.map((option) => {
            const selected = value === option.value;
            return (
              <label key={option.value} className={`type-card${selected ? " is-selected" : ""}`}>
                <input
                  type="radio"
                  name="registrantType"
                  value={option.value}
                  checked={selected}
                  onChange={() => onSelect(option.value)}
                />
                <span className="type-card__title">{option.title}</span>
                <span className="type-card__desc">{option.description}</span>
              </label>
            );
          })}
        </div>
        {error ? (
          <p className="field__error" role="alert">
            {error}
          </p>
        ) : null}
      </fieldset>
      <div className="actions">
        <PrimaryButton>Tiếp tục</PrimaryButton>
      </div>
    </form>
  );
}
