import { PrimaryButton } from "./PrimaryButton";
import { TextField } from "./TextField";

export function StudentStep({ values, errors, onChange, onNext }) {
  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      noValidate
    >
      <h2 className="section-title">Học sinh</h2>
      <div className="grid-2">
        <TextField
          label="Họ và tên học sinh"
          name="studentName"
          value={values.studentName}
          onChange={onChange}
          error={errors.studentName}
          placeholder="Nhập họ và tên học sinh"
          autoComplete="name"
          maxLength={80}
          required
        />
        <TextField
          label="Số điện thoại học sinh"
          name="studentPhone"
          value={values.studentPhone}
          onChange={onChange}
          error={errors.studentPhone}
          placeholder="Nhập số điện thoại"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={16}
          required
        />
        <TextField
          label="Trường đang theo học"
          name="school"
          value={values.school}
          onChange={onChange}
          error={errors.school}
          placeholder="Nhập tên trường"
          autoComplete="organization"
          maxLength={120}
          required
        />
        <TextField
          label="Lớp học hiện tại"
          name="className"
          value={values.className}
          onChange={onChange}
          error={errors.className}
          placeholder="Ví dụ: 10A1"
          autoComplete="off"
          maxLength={40}
          required
        />
      </div>
      <h2 className="section-title">Phụ huynh</h2>
      <div className="grid-2">
        <TextField
          label="Họ và tên phụ huynh"
          name="parentName"
          value={values.parentName}
          onChange={onChange}
          error={errors.parentName}
          placeholder="Nhập họ và tên phụ huynh"
          autoComplete="name"
          maxLength={80}
          required
        />
        <TextField
          label="Số điện thoại phụ huynh"
          name="parentPhone"
          value={values.parentPhone}
          onChange={onChange}
          error={errors.parentPhone}
          placeholder="Nhập số điện thoại"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={16}
          required
        />
      </div>
      <div className="field-follow">
        <TextField
          label="Mã giới thiệu"
          name="referralCode"
          value={values.referralCode}
          onChange={onChange}
          error={errors.referralCode}
          placeholder="Không bắt buộc"
          autoComplete="off"
          maxLength={40}
        />
      </div>
      <div className="actions">
        <PrimaryButton>Tiếp theo</PrimaryButton>
      </div>
    </form>
  );
}
