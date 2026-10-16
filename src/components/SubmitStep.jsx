import { CONFIRM_OPTION, COURSE } from "../data/course";
import { PrimaryButton } from "./PrimaryButton";
import { RadioGroup } from "./RadioGroup";
import { SummaryCard } from "./SummaryCard";

export function SubmitStep({ values, errors, onChange, onSubmit, submitting, submitError }) {
  const isSchool = values.registrantType === "school";
  const confirmOption = isSchool
    ? {
        value: "yes",
        label: "Trường xác nhận đăng ký tham gia khoá học 10 buổi nền tảng AI Foundation",
      }
    : CONFIRM_OPTION;

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
        options={[confirmOption]}
        value={values.confirm}
        onChange={onChange}
        error={errors.confirm}
        required
      />
      <p className="disclaimer">
        *Khi chọn xác nhận, {isSchool ? "nhà trường đăng ký" : "em đăng ký"} tham gia đủ 10 buổi{" "}
        {COURSE.fullName}. {COURSE.feeNote}
        {COURSE.opening ? `. Khai giảng ${COURSE.opening}` : ""}.
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
