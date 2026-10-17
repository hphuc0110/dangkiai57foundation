import { COURSE, isCustomSchedule, registrantTypeLabel, selectedScheduleText } from "../data/course";

export function SummaryCard({ values }) {
  const isSchool = values.registrantType === "school";
  const rows = [
    { label: "Hình thức", value: registrantTypeLabel(values.registrantType) || "Chưa chọn" },
    ...(isSchool
      ? [
          { label: "Nhà trường", value: values.schoolName || "—" },
          { label: "Người đại diện", value: values.contactName || "—" },
        ]
      : []),
    { label: "Khoá học", value: COURSE.name },
    { label: "Thời lượng", value: COURSE.duration },
    { label: "Hình thức học", value: COURSE.format },
    ...(COURSE.opening ? [{ label: "Khai giảng", value: COURSE.opening }] : []),
    ...(!isSchool
      ? [
          {
            label: isCustomSchedule(values.schedule) ? "Giờ trống" : "Khung giờ",
            value: selectedScheduleText(values) || "Chưa chọn",
          },
        ]
      : []),
  ];

  return (
    <section className="summary" aria-label="Tóm tắt đăng ký">
      <h2>Tóm tắt</h2>
      <p>{isSchool ? "Thông tin đăng ký của nhà trường" : "Thông tin lớp học của em"}</p>
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
