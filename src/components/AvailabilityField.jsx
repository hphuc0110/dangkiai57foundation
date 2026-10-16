import { TIME_SLOTS, WEEKDAYS } from "../data/course";

export function AvailabilityField({ days, start, end, onChange, error }) {
  const selected = Array.isArray(days) ? days : [];

  function toggleDay(day) {
    const next = selected.includes(day) ? selected.filter((item) => item !== day) : [...selected, day];
    const ordered = WEEKDAYS.filter((item) => next.includes(item.value)).map((item) => item.value);
    onChange("freeDays", ordered);
  }

  return (
    <div className={`availability${error ? " is-error" : ""}`}>
      <p className="choices__hint">Chọn các thứ và khoảng giờ em có thể tham gia học.</p>
      <div className="day-list" role="group" aria-label="Thứ trống">
        {WEEKDAYS.map((day) => {
          const active = selected.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              className={`day${active ? " is-selected" : ""}`}
              aria-label={day.label}
              aria-pressed={active}
              title={day.label}
              onClick={() => toggleDay(day.value)}
            >
              {day.short}
            </button>
          );
        })}
      </div>
      <div className="availability__times">
        <label className="time-field">
          <span>Từ</span>
          <select name="freeTimeStart" value={start} onChange={(event) => onChange("freeTimeStart", event.target.value)}>
            <option value="">Chọn giờ</option>
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
        <label className="time-field">
          <span>Đến</span>
          <select name="freeTimeEnd" value={end} onChange={(event) => onChange("freeTimeEnd", event.target.value)}>
            <option value="">Chọn giờ</option>
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
