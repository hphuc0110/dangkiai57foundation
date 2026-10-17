import { APPS_SCRIPT_URL } from "../config";
import {
  CONFIRM_OPTION,
  COURSE,
  formatAvailability,
  isCustomSchedule,
  registrantTypeLabel,
  scheduleLabel,
} from "../data/course";

function cleanPhone(value) {
  return String(value || "").replace(/[\s.\-]/g, "");
}

export function buildPayload(values) {
  const isSchool = values.registrantType === "school";
  const typeLabel = registrantTypeLabel(values.registrantType);
  const base = {
    course: COURSE.fullName,
    registrantType: typeLabel,
    type: isSchool ? "school" : "personal",
    registrantTypeLabel: typeLabel,
    referralCode: values.referralCode.trim(),
    schedule: isSchool ? "" : scheduleLabel(values.schedule),
    availability:
      !isSchool && isCustomSchedule(values.schedule)
        ? formatAvailability(values.freeDays, values.freeTimeStart, values.freeTimeEnd)
        : "",
    confirm: isSchool
      ? "Trường xác nhận đăng ký tham gia khoá học 10 buổi nền tảng AI Foundation"
      : CONFIRM_OPTION.label.trim(),
  };

  if (isSchool) {
    return {
      ...base,
      schoolName: values.schoolName.trim(),
      schoolAddress: values.schoolAddress.trim(),
      contactName: values.contactName.trim(),
      contactRole: values.contactRole.trim(),
      contactPhone: cleanPhone(values.contactPhone),
      contactEmail: values.contactEmail.trim(),
    };
  }

  return {
    ...base,
    studentName: values.studentName.trim(),
    studentPhone: cleanPhone(values.studentPhone),
    school: values.school.trim(),
    className: values.className.trim(),
    parentName: values.parentName.trim(),
    parentPhone: cleanPhone(values.parentPhone),
  };
}

async function readEndpointInfo(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    const text = await res.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function submitToSheet(values) {
  const url = APPS_SCRIPT_URL.trim();
  if (!url) {
    throw new Error(
      "Chưa gắn link Apps Script. Mở src/config.js và dán URL web app (kết thúc bằng /exec).",
    );
  }

  const info = await readEndpointInfo(url);
  if (!info?.version || info.version !== "split-sheets-v2") {
    throw new Error(
      "URL trong src/config.js chưa trỏ tới bản split-sheets-v2. Mở đúng deployment mới trên trình duyệt (thấy version split-sheets-v2), copy URL /exec đó dán vào src/config.js rồi lưu lại.",
    );
  }

  const payload = buildPayload(values);
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
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
    throw new Error(
      data?.error || "Google Sheet từ chối đăng ký. Kiểm tra lại Apps Script rồi deploy phiên bản mới.",
    );
  }

  return data ?? { ok: true };
}
