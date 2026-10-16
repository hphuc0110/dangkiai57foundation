import { CONFIRM_OPTION, COURSE } from "../data/course";
import { PrimaryButton } from "./PrimaryButton";
import { RadioGroup } from "./RadioGroup";
import { SummaryCard } from "./SummaryCard";

export function SubmitStep({ values, errors, onChange, onSubmit, submitting, submitError }) {
  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <SummaryCard values={values} />
      <RadioGroup
        legend="Xác nhận tham gia khoá học 10 buổi nền tảng AI Foundation"
        name="confirm"
        options={[CONFIRM_OPTION]}
        value={values.confirm}
        onChange={onChange}
        error={errors.confirm}
        required
      />
      <p className="disclaimer">
        *Khi chọn xác nhận, em đăng ký tham gia đủ 10 buổi {COURSE.fullName}. {COURSE.feeNote}. Khai giảng{" "}
        {COURSE.opening}.
      </p>
      {submitError ? (
        <p className="banner" role="alert">
          {submitError}
        </p>
      ) : null}
      <div className="actions">
        <PrimaryButton loading={submitting} wide>
          Gửi đăng ký
        </PrimaryButton>
      </div>
    </form>
  );
}
