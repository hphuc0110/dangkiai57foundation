import { COURSE, isCustomSchedule, selectedScheduleText } from "../data/course";

export function SummaryCard({ values }) {
  const rows = [
    { label: "Khoá học", value: COURSE.name },
    { label: "Thời lượng", value: COURSE.duration },
    { label: "Hình thức", value: COURSE.format },
    { label: "Khai giảng", value: COURSE.opening },
    {
      label: isCustomSchedule(values.schedule) ? "Giờ trống" : "Khung giờ",
      value: selectedScheduleText(values) || "Chưa chọn",
    },
  ];

  return (
    <section className="summary" aria-label="Tóm tắt đăng ký">
      <h2>Tóm tắt</h2>
      <p>Thông tin lớp học của em</p>
      <div className="summary__rows">
        {rows.map((row) => (
          <div className="summary__row" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
        <hr className="summary__dash" />
        <div className="summary__row summary__row--total">
          <span>Học phí</span>
          <strong>{COURSE.fee}</strong>
        </div>
      </div>
    </section>
  );
}
