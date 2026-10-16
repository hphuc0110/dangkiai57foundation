import { APPS_SCRIPT_URL } from "../config";
import {
  CONFIRM_OPTION,
  COURSE,
  formatAvailability,
  isCustomSchedule,
  scheduleLabel,
} from "../data/course";

function cleanPhone(value) {
  return String(value || "").replace(/[\s.\-]/g, "");
}

export function buildPayload(values) {
  return {
    course: COURSE.fullName,
    studentName: values.studentName.trim(),
    studentPhone: cleanPhone(values.studentPhone),
    school: values.school.trim(),
    className: values.className.trim(),
    parentName: values.parentName.trim(),
    parentPhone: cleanPhone(values.parentPhone),
    referralCode: values.referralCode.trim(),
    schedule: scheduleLabel(values.schedule),
    availability: isCustomSchedule(values.schedule)
      ? formatAvailability(values.freeDays, values.freeTimeStart, values.freeTimeEnd)
      : "",
    confirm: CONFIRM_OPTION.label,
  };
}

export async function submitToSheet(values) {
  const url = APPS_SCRIPT_URL.trim();
  if (!url) {
    throw new Error(
      "Chưa gắn link Apps Script. Mở src/config.js và dán URL web app (kết thúc bằng /exec).",
    );
  }

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(buildPayload(values)),
    });
  } catch {
    throw new Error("Không kết nối được Google Sheet. Kiểm tra mạng hoặc link Apps Script.");
  }

  const text = await response.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || "Google Sheet từ chối đăng ký. Kiểm tra lại Apps Script rồi deploy phiên bản mới.");
  }

  return data ?? { ok: true };
}
