import { CUSTOM_SCHEDULE, SCHEDULE_HINT, SCHEDULES } from "../data/course";
import { AvailabilityField } from "./AvailabilityField";
import { PrimaryButton } from "./PrimaryButton";
import { RadioGroup } from "./RadioGroup";

export function ScheduleStep({ values, errors, onChange, onChangeMany, onNext }) {
  const isCustom = values.schedule === CUSTOM_SCHEDULE;

  function selectSchedule(_name, value) {
    if (value === CUSTOM_SCHEDULE) {
      onChangeMany({ schedule: value });
      return;
    }
    onChangeMany({
      schedule: value,
      freeDays: [],
      freeTimeStart: "",
      freeTimeEnd: "",
    });
  }

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      noValidate
    >
      <RadioGroup
        legend="Em muốn tham gia học vào thời gian nào?"
        hint={SCHEDULE_HINT}
        name="schedule"
        options={SCHEDULES}
        value={values.schedule}
        onChange={selectSchedule}
        error={errors.schedule}
        required
      />
      {isCustom ? (
        <AvailabilityField
          days={values.freeDays}
          start={values.freeTimeStart}
          end={values.freeTimeEnd}
          onChange={onChange}
          error={errors.availability}
        />
      ) : null}
      <div className="actions">
        <PrimaryButton>Tiếp theo</PrimaryButton>
      </div>
    </form>
  );
}
