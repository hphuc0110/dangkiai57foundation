import { scrollToRegistration } from "../lib/scrollToRegistration";

export function ProgramIntro() {
  return (
    <section className="program" aria-labelledby="program-title">
      <div className="program__inner">
        <p className="program__eyebrow">
          Chương trình tập huấn – đào tạo AI cho giáo viên và học sinh phổ thông
        </p>
        <h1 className="program__title" id="program-title">
          Lớp Nền tảng AI Foundation dành cho học sinh THPT
        </h1>
        <p className="program__lead">
          Trong tháng 10 và tháng 11 năm 2026, Hồng Lĩnh Education triển khai chuỗi chương
          trình tập huấn và đào tạo AI miễn phí tại các trường phổ thông, với mục tiêu tập
          huấn cho 1.000 giáo viên và trang bị nền tảng AI cho 10.000 học sinh. Lớp Nền tảng
          AI Foundation gồm 10 buổi, dành cho học sinh THPT, do Hồng Lĩnh Education tài trợ
          toàn bộ kinh phí.
        </p>
        <a className="btn program__cta" href="#dang-ky" onClick={scrollToRegistration}>
          Đăng ký tham gia
        </a>

        <div className="program__sections">
          <article className="program__block">
            <h2>1. Căn cứ triển khai</h2>
            <p>
              Chương trình hưởng ứng Quyết định số 2422/QĐ-BGDĐT của Bộ Giáo dục và Đào tạo về
              việc ban hành Khung nội dung giáo dục AI cấp phổ thông, áp dụng từ năm học 2026
              – 2027.
            </p>
            <p>
              Chương trình đồng thời được đặt trong định hướng của Nghị quyết số 57-NQ/TW của
              Bộ Chính trị, xác định phát triển khoa học, công nghệ, đổi mới sáng tạo và
              chuyển đổi số là đột phá quan trọng hàng đầu, trong đó nguồn nhân lực là yếu tố
              quyết định.
            </p>
          </article>

          <article className="program__block">
            <h2>2. Định hướng sau khóa học</h2>
            <p>
              Học sinh hoàn thành lớp nền tảng được định hướng học tiếp lộ trình AI57 –
              chương trình đào tạo kỹ sư AI gồm 6 module, 4 cấp độ, nơi các em làm dự án thật,
              tham gia các cuộc thi khoa học kỹ thuật và kết nối với hệ sinh thái nghiên cứu,
              khởi nghiệp, doanh nghiệp công nghệ.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
