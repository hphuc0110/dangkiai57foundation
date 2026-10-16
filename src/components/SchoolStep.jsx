import { PrimaryButton } from "./PrimaryButton";
import { TextField } from "./TextField";

export function SchoolStep({ values, errors, onChange, onNext, onChangeType }) {
  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      noValidate
    >
      <div className="form-type-bar">
        <p>
          Hình thức: <strong>Nhà trường</strong>
        </p>
        <button className="link-btn" type="button" onClick={onChangeType}>
          Đổi hình thức
        </button>
      </div>

      <h2 className="section-title">Thông tin nhà trường</h2>
      <div className="grid-2">
        <TextField
          label="Tên nhà trường"
          name="schoolName"
          value={values.schoolName}
          onChange={onChange}
          error={errors.schoolName}
          placeholder="Nhập tên trường"
          autoComplete="organization"
          maxLength={120}
          required
        />
        <TextField
          label="Địa chỉ trường"
          name="schoolAddress"
          value={values.schoolAddress}
          onChange={onChange}
          error={errors.schoolAddress}
          placeholder="Nhập địa chỉ trường"
          autoComplete="street-address"
          maxLength={200}
          required
        />
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

      <h2 className="section-title">Người đại diện liên hệ</h2>
      <div className="grid-2">
        <TextField
          label="Họ và tên người đại diện"
          name="contactName"
          value={values.contactName}
          onChange={onChange}
          error={errors.contactName}
          placeholder="Nhập họ và tên"
          autoComplete="name"
          maxLength={80}
          required
        />
        <TextField
          label="Chức vụ"
          name="contactRole"
          value={values.contactRole}
          onChange={onChange}
          error={errors.contactRole}
          placeholder="Ví dụ: Giáo viên phụ trách"
          autoComplete="organization-title"
          maxLength={80}
          required
        />
        <TextField
          label="Số điện thoại liên hệ"
          name="contactPhone"
          value={values.contactPhone}
          onChange={onChange}
          error={errors.contactPhone}
          placeholder="Nhập số điện thoại"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={16}
          required
        />
        <TextField
          label="Email liên hệ"
          name="contactEmail"
          value={values.contactEmail}
          onChange={onChange}
          error={errors.contactEmail}
          placeholder="email@truong.edu.vn"
          type="email"
          autoComplete="email"
          maxLength={120}
          required
        />
      </div>

      <div className="actions">
        <PrimaryButton>Tiếp theo</PrimaryButton>
      </div>
    </form>
  );
}
