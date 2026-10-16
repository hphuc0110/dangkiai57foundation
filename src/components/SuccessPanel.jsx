import { SummaryCard } from "./SummaryCard";

export function SuccessPanel({ values, onReset }) {
  return (
    <section className="success">
      <div className="success__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5 9.2 17 19 7" />
        </svg>
      </div>
      <h1>Đăng ký đã được ghi nhận</h1>
      <p className="success__lead">
        Cảm ơn {values.studentName}. Hồng Lĩnh Education sẽ liên hệ qua số điện thoại đã đăng ký.
      </p>
      <SummaryCard values={values} />
      <button className="btn btn--ghost" type="button" onClick={onReset}>
        Đăng ký học sinh khác
      </button>
    </section>
  );
}
