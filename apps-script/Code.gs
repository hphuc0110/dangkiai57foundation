/**
 * Nhận đăng ký lớp Nền tảng AI Foundation và ghi vào Google Sheet.
 * Cá nhân → sheet "CaNhan". Nhà trường → sheet "NhaTruong".
 *
 * Cách gắn vào trang:
 * 1. Tạo một Google Sheet trống.
 * 2. Trên Sheet: Extensions → Apps Script.
 * 3. Xoá mã mẫu, dán toàn bộ file này, rồi Save.
 * 4. (Tuỳ chọn) Nếu script tạo riêng, không mở từ Sheet, dán ID của Sheet
 *    vào SPREADSHEET_ID. ID là đoạn giữa /d/ và /edit trên thanh địa chỉ.
 * 5. Deploy → New deployment → chọn bánh răng → Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL kết thúc bằng /exec, dán vào src/config.js (APPS_SCRIPT_URL).
 * 7. Mỗi lần sửa file này: Deploy → Manage deployments → Edit →
 *    Version: New version → Deploy. URL /exec giữ nguyên.
 *
 * Chạy submitSamplePersonal() / submitSampleSchool() để thử ghi dòng mẫu.
 */

var SPREADSHEET_ID = "";
var SHEET_PERSONAL = "CaNhan";
var SHEET_SCHOOL = "NhaTruong";

var HEADERS_PERSONAL = [
  "Thời gian gửi",
  "Khoá học",
  "Loại đăng ký",
  "Họ và tên học sinh",
  "Số điện thoại học sinh",
  "Trường đang theo học",
  "Năm sinh",
  "Họ và tên phụ huynh",
  "Số điện thoại phụ huynh",
  "Mã giới thiệu",
  "Khung giờ học",
  "Lịch học trống",
  "Xác nhận tham gia",
];

var HEADERS_SCHOOL = [
  "Thời gian gửi",
  "Khoá học",
  "Loại đăng ký",
  "Tên nhà trường",
  "Địa chỉ trường",
  "Người đại diện",
  "Chức vụ",
  "SĐT liên hệ",
  "Email liên hệ",
  "Mã giới thiệu",
  "Xác nhận tham gia",
];

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error("Hãy tạo script từ menu Extensions của Google Sheet, hoặc điền SPREADSHEET_ID.");
  }
  return active;
}

function getSheet_(sheetName, headers) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  ensureHeaders_(sheet, headers);
  return sheet;
}

function ensureHeaders_(sheet, expectedHeaders) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(expectedHeaders);
    sheet.getRange(1, 1, 1, expectedHeaders.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, expectedHeaders.length);
    return expectedHeaders.slice();
  }

  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  for (var i = 0; i < expectedHeaders.length; i++) {
    if (headers.indexOf(expectedHeaders[i]) === -1) {
      sheet.getRange(1, headers.length + 1).setValue(expectedHeaders[i]).setFontWeight("bold");
      headers.push(expectedHeaders[i]);
    }
  }
  return headers;
}

function appendRecord_(sheet, expectedHeaders, record) {
  var headers = ensureHeaders_(sheet, expectedHeaders);
  var row = headers.map(function (header) {
    return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : "";
  });
  sheet.appendRow(row);
}

function plain_(value, maxLen) {
  var clean = String(value || "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, maxLen);
  if (!clean) return "";
  return "'" + clean;
}

function normalizeType_(value) {
  var s = String(value || "").trim().toLowerCase();
  try {
    if (typeof s.normalize === "function") s = s.normalize("NFC");
  } catch (ignore) {}
  return s;
}

/** Nhận diện Nhà trường: ưu tiên field trường, rồi mã/nhãn loại đăng ký. */
function isSchoolRegistration_(data) {
  var hasStudentName = Boolean(String(data.studentName || "").trim());
  var hasSchoolName = Boolean(String(data.schoolName || "").trim());
  var hasContact =
    Boolean(String(data.contactName || "").trim()) ||
    Boolean(String(data.contactEmail || "").trim()) ||
    Boolean(String(data.contactPhone || "").trim());

  // Có thông tin trường / đại diện và không có tên học sinh → Nhà trường
  if ((hasSchoolName || hasContact) && !hasStudentName) return true;

  var type = normalizeType_(data.type || data.registrantType || data.registrantTypeLabel);
  if (type === "school" || type.indexOf("trường") !== -1 || type.indexOf("truong") !== -1) return true;
  if (type === "personal" || type.indexOf("cá nhân") !== -1 || type.indexOf("ca nhan") !== -1) return false;

  return false;
}

function registrantLabel_(data, isSchool) {
  var label = String(data.registrantTypeLabel || "").trim();
  if (label) return label;
  var type = normalizeType_(data.registrantType || data.type);
  if (type === "school" || type === "nhà trường") return "Nhà trường";
  if (type === "personal" || type === "cá nhân") return "Cá nhân";
  return isSchool ? "Nhà trường" : "Cá nhân";
}

function buildPersonalRecord_(data, sentAt) {
  var record = {};
  record["Thời gian gửi"] = sentAt;
  record["Khoá học"] = plain_(data.course, 120);
  record["Loại đăng ký"] = plain_(registrantLabel_(data, false), 40);
  record["Họ và tên học sinh"] = plain_(data.studentName, 80);
  record["Số điện thoại học sinh"] = plain_(data.studentPhone, 20);
  record["Trường đang theo học"] = plain_(data.school, 120);
  record["Năm sinh"] = plain_(data.className, 40);
  record["Họ và tên phụ huynh"] = plain_(data.parentName, 80);
  record["Số điện thoại phụ huynh"] = plain_(data.parentPhone, 20);
  record["Mã giới thiệu"] = plain_(data.referralCode, 40);
  record["Khung giờ học"] = plain_(data.schedule, 160);
  record["Lịch học trống"] = plain_(data.availability, 200);
  record["Xác nhận tham gia"] = plain_(data.confirm, 200);
  return record;
}

function buildSchoolRecord_(data, sentAt) {
  var record = {};
  record["Thời gian gửi"] = sentAt;
  record["Khoá học"] = plain_(data.course, 120);
  record["Loại đăng ký"] = plain_(registrantLabel_(data, true), 40);
  record["Tên nhà trường"] = plain_(data.schoolName || data.school, 120);
  record["Địa chỉ trường"] = plain_(data.schoolAddress, 200);
  record["Người đại diện"] = plain_(data.contactName || data.parentName, 80);
  record["Chức vụ"] = plain_(data.contactRole, 80);
  record["SĐT liên hệ"] = plain_(data.contactPhone || data.parentPhone, 20);
  record["Email liên hệ"] = plain_(data.contactEmail, 120);
  record["Mã giới thiệu"] = plain_(data.referralCode, 40);
  record["Xác nhận tham gia"] = plain_(data.confirm, 200);
  return record;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return json_({ ok: false, error: "Hệ thống đang bận, vui lòng thử lại." });
  }

  try {
    var data = parseBody_(e);
    if (!data || typeof data !== "object" || !Object.keys(data).length) {
      return json_({ ok: false, error: "Không nhận được dữ liệu đăng ký. Hãy deploy lại Apps Script (New version)." });
    }

    var isSchool = isSchoolRegistration_(data);
    var sentAt = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    if (isSchool) {
      if (!String(data.schoolName || data.school || "").trim()) {
        return json_({ ok: false, error: "Thiếu tên nhà trường." });
      }
      if (!String(data.contactName || data.parentName || "").trim()) {
        return json_({ ok: false, error: "Thiếu người đại diện." });
      }
      var schoolSheet = getSheet_(SHEET_SCHOOL, HEADERS_SCHOOL);
      appendRecord_(schoolSheet, HEADERS_SCHOOL, buildSchoolRecord_(data, sentAt));
    } else {
      if (!String(data.studentName || "").trim()) {
        return json_({ ok: false, error: "Thiếu họ và tên học sinh." });
      }
      var personalSheet = getSheet_(SHEET_PERSONAL, HEADERS_PERSONAL);
      appendRecord_(personalSheet, HEADERS_PERSONAL, buildPersonalRecord_(data, sentAt));
    }

    return json_({ ok: true, sheet: isSchool ? SHEET_SCHOOL : SHEET_PERSONAL });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({
    ok: true,
    message: "AI Foundation registration endpoint",
    version: "split-sheets-v2",
    sheets: [SHEET_PERSONAL, SHEET_SCHOOL],
  });
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignore) {}
  }
  if (e && e.parameter && e.parameter.payload) {
    try {
      return JSON.parse(e.parameter.payload);
    } catch (ignore2) {}
  }
  if (e && e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }
  return {};
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function submitSamplePersonal() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        course: "Lớp Nền tảng AI Foundation",
        registrantType: "personal",
        registrantTypeLabel: "Cá nhân",
        studentName: "Học sinh thử",
        studentPhone: "0912345678",
        school: "THPT Thử",
        className: "2008",
        parentName: "Phụ huynh thử",
        parentPhone: "0987654321",
        referralCode: "TEST",
        schedule: "Thứ 5 – 19:00-20:30 và Thứ 7 – 19:00-20:30",
        availability: "",
        confirm: "Em xác nhận tham gia khoá học 10 buổi nền tảng AI Foundation",
      }),
    },
  });
  Logger.log(result.getContent());
}

function submitSampleSchool() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        course: "Lớp Nền tảng AI Foundation",
        registrantType: "school",
        registrantTypeLabel: "Nhà trường",
        schoolName: "THPT Thử",
        schoolAddress: "123 Đường Thử, Hà Nội",
        contactName: "Nguyễn Văn A",
        contactRole: "Giáo viên phụ trách",
        contactPhone: "0912345678",
        contactEmail: "gv@truong.edu.vn",
        referralCode: "TEST",
        confirm: "Trường xác nhận đăng ký tham gia khoá học 10 buổi nền tảng AI Foundation",
      }),
    },
  });
  Logger.log(result.getContent());
}

/** @deprecated Dùng submitSamplePersonal() */
function submitSample() {
  submitSamplePersonal();
}
