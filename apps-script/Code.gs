/**
 * Nhận đăng ký lớp Nền tảng AI Foundation và ghi một dòng vào Google Sheet.
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
 * Chạy submitSample() trong trình soạn Apps Script để thử ghi một dòng mẫu.
 */

var SPREADSHEET_ID = "";
var SHEET_NAME = "DangKy";

var HEADERS = [
  "Thời gian gửi",
  "Khoá học",
  "Loại đăng ký",
  "Họ và tên học sinh",
  "Số điện thoại học sinh",
  "Trường đang theo học",
  "Lớp học hiện tại",
  "Họ và tên phụ huynh",
  "Số điện thoại phụ huynh",
  "Tên nhà trường",
  "Địa chỉ trường",
  "Người đại diện",
  "Chức vụ",
  "SĐT liên hệ (trường)",
  "Email liên hệ",
  "Số lượng học sinh",
  "Mã giới thiệu",
  "Khung giờ học",
  "Lịch học trống",
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

function getSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
    return HEADERS.slice();
  }

  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  for (var i = 0; i < HEADERS.length; i++) {
    if (headers.indexOf(HEADERS[i]) === -1) {
      sheet.getRange(1, headers.length + 1).setValue(HEADERS[i]).setFontWeight("bold");
      headers.push(HEADERS[i]);
    }
  }
  return headers;
}

function appendRecord_(sheet, record) {
  var headers = ensureHeaders_(sheet);
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

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return json_({ ok: false, error: "Hệ thống đang bận, vui lòng thử lại." });
  }

  try {
    var data = parseBody_(e);
    var isSchool = String(data.registrantType || "") === "Nhà trường";
    if (isSchool) {
      if (!data.schoolName && !data.school) {
        return json_({ ok: false, error: "Thiếu tên nhà trường." });
      }
      if (!data.contactName && !data.parentName) {
        return json_({ ok: false, error: "Thiếu người đại diện." });
      }
    } else if (!data.studentName) {
      return json_({ ok: false, error: "Thiếu họ và tên học sinh." });
    }

    var sheet = getSheet_();
    var sentAt = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var record = {};
    record["Thời gian gửi"] = sentAt;
    record["Khoá học"] = plain_(data.course, 120);
    record["Loại đăng ký"] = plain_(data.registrantType || "Cá nhân", 40);
    record["Họ và tên học sinh"] = plain_(data.studentName, 80);
    record["Số điện thoại học sinh"] = plain_(data.studentPhone, 20);
    record["Trường đang theo học"] = plain_(data.school, 120);
    record["Lớp học hiện tại"] = plain_(data.className, 40);
    record["Họ và tên phụ huynh"] = plain_(data.parentName, 80);
    record["Số điện thoại phụ huynh"] = plain_(data.parentPhone, 20);
    record["Tên nhà trường"] = plain_(data.schoolName, 120);
    record["Địa chỉ trường"] = plain_(data.schoolAddress, 200);
    record["Người đại diện"] = plain_(data.contactName, 80);
    record["Chức vụ"] = plain_(data.contactRole, 80);
    record["SĐT liên hệ (trường)"] = plain_(data.contactPhone, 20);
    record["Email liên hệ"] = plain_(data.contactEmail, 120);
    record["Số lượng học sinh"] = plain_(data.studentCount, 20);
    record["Mã giới thiệu"] = plain_(data.referralCode, 40);
    record["Khung giờ học"] = plain_(data.schedule, 160);
    record["Lịch học trống"] = plain_(data.availability, 200);
    record["Xác nhận tham gia"] = plain_(data.confirm, 200);
    appendRecord_(sheet, record);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: "AI Foundation registration endpoint" });
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignore) {}
  }
  if (e && e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }
  if (e && e.parameter) return e.parameter;
  return {};
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function submitSample() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        course: "Lớp Nền tảng AI Foundation",
        registrantType: "Cá nhân",
        studentName: "Học sinh thử",
        studentPhone: "0912345678",
        school: "THPT Thử",
        className: "10A1",
        parentName: "Phụ huynh thử",
        parentPhone: "0987654321",
        referralCode: "TEST",
        schedule: "Thứ 5 – 19:00-20:30 và Thứ 7 – 19:00-20:30",
        availability: "Thứ 2, Thứ 4 · 19:00–20:30",
        confirm: "Em xác nhận tham gia khoá học 10 buổi nền tảng AI Foundation",
      }),
    },
  });
  Logger.log(result.getContent());
}
