import { CUSTOM_SCHEDULE, getSteps } from "../data/course";

export const INITIAL_VALUES = {
  registrantType: "",
  studentName: "",
  studentPhone: "",
  school: "",
  className: "",
  parentName: "",
  parentPhone: "",
  schoolName: "",
  schoolAddress: "",
  contactName: "",
  contactRole: "",
  contactPhone: "",
  contactEmail: "",
  studentCount: "",
  referralCode: "",
  schedule: "",
  freeDays: [],
  freeTimeStart: "",
  freeTimeEnd: "",
  confirm: "",
};

function toMinutes(value) {
  const [hour, minute] = String(value || "").split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return NaN;
  return hour * 60 + minute;
}

const PHONE_PATTERN = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function compactPhone(value) {
  return String(value || "").replace(/[\s.\-]/g, "");
}

function requireText(values, errors, key, message) {
  if (!String(values[key] || "").trim()) errors[key] = message;
}

function phoneError(value, emptyMessage) {
  const compact = compactPhone(value);
  if (!compact) return emptyMessage;
  if (!PHONE_PATTERN.test(compact)) return "Số điện thoại chưa đúng định dạng";
  return "";
}

function validatePersonalInfo(values, errors) {
  const name = String(values.studentName || "").trim();
  if (name.length < 2) errors.studentName = "Vui lòng nhập họ và tên học sinh";
  const studentPhone = phoneError(values.studentPhone, "Vui lòng nhập số điện thoại học sinh");
  if (studentPhone) errors.studentPhone = studentPhone;
  requireText(values, errors, "school", "Vui lòng nhập trường đang theo học");
  requireText(values, errors, "className", "Vui lòng nhập lớp học hiện tại");

  const parentName = String(values.parentName || "").trim();
  if (parentName.length < 2) errors.parentName = "Vui lòng nhập họ và tên phụ huynh";
  const parentPhone = phoneError(values.parentPhone, "Vui lòng nhập số điện thoại phụ huynh");
  if (parentPhone) errors.parentPhone = parentPhone;
}

function validateSchoolInfo(values, errors) {
  requireText(values, errors, "schoolName", "Vui lòng nhập tên nhà trường");
  requireText(values, errors, "schoolAddress", "Vui lòng nhập địa chỉ trường");

  const count = Number(values.studentCount);
  if (!String(values.studentCount || "").trim()) {
    errors.studentCount = "Vui lòng nhập số lượng học sinh";
  } else if (!Number.isInteger(count) || count < 1) {
    errors.studentCount = "Số lượng học sinh phải từ 1 trở lên";
  }

  const contactName = String(values.contactName || "").trim();
  if (contactName.length < 2) errors.contactName = "Vui lòng nhập họ và tên người đại diện";
  requireText(values, errors, "contactRole", "Vui lòng nhập chức vụ");

  const contactPhone = phoneError(values.contactPhone, "Vui lòng nhập số điện thoại liên hệ");
  if (contactPhone) errors.contactPhone = contactPhone;

  const email = String(values.contactEmail || "").trim();
  if (!email) errors.contactEmail = "Vui lòng nhập email liên hệ";
  else if (!EMAIL_PATTERN.test(email)) errors.contactEmail = "Email chưa đúng định dạng";
}

export function validateRegistrantType(values) {
  const errors = {};
  if (values.registrantType !== "personal" && values.registrantType !== "school") {
    errors.registrantType = "Vui lòng chọn Cá nhân hoặc Nhà trường";
  }
  return errors;
}

export function validateStep(step, values) {
  const errors = {};
  const stepId = getSteps(values.registrantType)[step]?.id;

  if (stepId === "info") {
    if (values.registrantType === "school") validateSchoolInfo(values, errors);
    else validatePersonalInfo(values, errors);
  }

  if (stepId === "schedule") {
    requireText(values, errors, "schedule", "Vui lòng chọn một khung giờ học");
    if (values.schedule === CUSTOM_SCHEDULE) {
      const days = Array.isArray(values.freeDays) ? values.freeDays : [];
      const start = toMinutes(values.freeTimeStart);
      const end = toMinutes(values.freeTimeEnd);
      if (!days.length) errors.availability = "Vui lòng chọn ít nhất một thứ";
      else if (!values.freeTimeStart || !values.freeTimeEnd) errors.availability = "Vui lòng chọn giờ trống";
      else if (!(end > start)) errors.availability = "Giờ kết thúc phải sau giờ bắt đầu";
    }
  }

  if (stepId === "submit" && values.confirm !== "yes") {
    errors.confirm = "Vui lòng xác nhận tham gia khoá học";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
