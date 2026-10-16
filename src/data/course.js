export const COURSE = {
  brand: "Hồng Lĩnh Education",
  name: "AI Foundation",
  fullName: "Lớp Nền tảng AI Foundation",
  deadline: "23:59, Thứ Sáu, 30/11/2026",
  duration: "10 buổi · 90 phút",
  format: "Trực tuyến (online)",
  fee: "Miễn phí",
  feeNote: "Hồng Lĩnh Education tài trợ toàn phần",
  hotline: "099 696 3399",
  hotlineTel: "0996963399",
};

export const STEPS = [
  { id: "info", label: "Thông tin học sinh & phụ huynh", short: "Thông tin" },
  { id: "schedule", label: "Đăng ký lịch học", short: "Lịch học" },
  { id: "submit", label: "Xác nhận và gửi", short: "Xác nhận" },
];

export const CUSTOM_SCHEDULE = "custom";

export const SCHEDULES = [
  {
    value: "mon-wed",
    label: "Thứ 2 – 19:00-20:30 và Thứ 4 – 19:00-20:30",
  },
  {
    value: "tue-fri",
    label: "Thứ 3 – 19:00-20:30 và Thứ 6 – 19:00-20:30",
  },
  {
    value: "thu-sat",
    label: "Thứ 5 – 19:00-20:30 và Thứ 7 – 19:00-20:30",
  },
  {
    value: CUSTOM_SCHEDULE,
    label: "Lịch học trống (tự chọn)",
  },
];

export const SCHEDULE_HINT =
  "(Lưu ý: Chọn một khung giờ có sẵn, hoặc chọn mục thứ 4 để tự điền thứ và giờ trống. Lớp sẽ khai giảng theo khung giờ được nhiều bạn chọn nhất)";

export const WEEKDAYS = [
  { value: "2", short: "T2", label: "Thứ 2" },
  { value: "3", short: "T3", label: "Thứ 3" },
  { value: "4", short: "T4", label: "Thứ 4" },
  { value: "5", short: "T5", label: "Thứ 5" },
  { value: "6", short: "T6", label: "Thứ 6" },
  { value: "7", short: "T7", label: "Thứ 7" },
  { value: "cn", short: "CN", label: "Chủ nhật" },
];

export const TIME_SLOTS = Array.from({ length: 13 }, (_, index) => {
  const totalMinutes = 16 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
});

export function formatAvailability(days, start, end) {
  const labels = WEEKDAYS.filter((day) => (days || []).includes(day.value)).map((day) => day.label);
  if (!labels.length || !start || !end) return "";
  return `${labels.join(", ")} · ${start}–${end}`;
}

export const CONFIRM_OPTION = {
  value: "yes",
  label:
    "Em xác nhận tham gia khoá học 10 buổi nền tảng AI Foundation (khai giảng thứ 7 ngày 17/10)",
};

export function scheduleLabel(value) {
  return SCHEDULES.find((item) => item.value === value)?.label ?? "";
}

export function isCustomSchedule(value) {
  return value === CUSTOM_SCHEDULE;
}

export function selectedScheduleText(values) {
  if (isCustomSchedule(values.schedule)) {
    return formatAvailability(values.freeDays, values.freeTimeStart, values.freeTimeEnd);
  }
  return scheduleLabel(values.schedule);
}
