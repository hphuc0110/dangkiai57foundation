import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const EVENTS = [
  {
    id: "nhan-chinh",
    src: "/events/workshop-nhan-chinh.jpg",
    alt: "Buổi tập huấn AI tại phòng họp THPT Nhân Chính",
    position: "center 35%",
    featured: true,
  },
  {
    id: "trao-doi",
    src: "/events/buoi-trao-doi.jpg",
    alt: "Nhóm học viên trao đổi quanh bàn trong không gian học tập",
    position: "center 40%",
  },
  {
    id: "hoi-thao",
    src: "/events/hoi-thao-chuyen-gia.jpg",
    alt: "Hội thảo với chuyên gia AI và người tham dự trong hội trường",
    position: "center 45%",
  },
  {
    id: "ky-ket",
    src: "/events/le-ky-ket-mou.jpg",
    alt: "Lễ ký kết biên bản ghi nhớ hợp tác NIC, HUST và Hồng Lĩnh Education",
    position: "center 40%",
  },
  {
    id: "toa-dam",
    src: "/events/toa-dam-hoc-thuat.jpg",
    alt: "Buổi chia sẻ định hướng AI với diễn giả và khán giả",
    position: "center 42%",
  },
];

export function PastEvents() {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [active, setActive] = useState(null);
  const activeEvent = active == null ? null : EVENTS[active];

  useEffect(() => {
    if (active == null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
        return;
      }
      if (event.key === "ArrowRight") {
        setActive((index) => (index == null ? 0 : (index + 1) % EVENTS.length));
        return;
      }
      if (event.key === "ArrowLeft") {
        setActive((index) =>
          index == null ? 0 : (index - 1 + EVENTS.length) % EVENTS.length,
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  function openAt(index) {
    setActive(index);
  }

  function close() {
    setActive(null);
  }

  function showPrev() {
    setActive((index) =>
      index == null ? 0 : (index - 1 + EVENTS.length) % EVENTS.length,
    );
  }

  function showNext() {
    setActive((index) => (index == null ? 0 : (index + 1) % EVENTS.length));
  }

  return (
    <section className="events" aria-labelledby={titleId}>
      <div className="events__inner">
        <header className="events__header">
          <p className="events__eyebrow">Hành trình đã đi qua</p>
          <h2 className="events__title" id={titleId}>
            Các sự kiện đã diễn ra
          </h2>
          <p className="events__lead">
            Những buổi tập huấn, hội thảo và trao đổi chuyên môn trong hành trình
            đưa AI đến với giáo viên và học sinh phổ thông.
          </p>
        </header>

        <ul className="events__grid">
          {EVENTS.map((event, index) => (
            <li
              key={event.id}
              className={`events__item${event.featured ? " events__item--featured" : ""}`}
              style={{ "--i": index }}
            >
              <button
                type="button"
                className="events__card"
                onClick={() => openAt(index)}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <span className="events__media">
                  <img
                    src={event.src}
                    alt={event.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: event.position }}
                  />
                </span>
                <span className="events__zoom" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M16.2 16.2 20 20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 8.2v5.6M8.2 11h5.6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeEvent
        ? createPortal(
            <div
              className="events-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`Ảnh sự kiện ${active + 1}`}
              ref={dialogRef}
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <div className="events-lightbox__panel">
                <div className="events-lightbox__toolbar">
                  <p className="events-lightbox__count">
                    {active + 1} / {EVENTS.length}
                  </p>
                  <button
                    type="button"
                    className="events-lightbox__close"
                    ref={closeRef}
                    onClick={close}
                    aria-label="Đóng ảnh"
                  >
                    ×
                  </button>
                </div>

                <div className="events-lightbox__stage">
                  <button
                    type="button"
                    className="events-lightbox__nav events-lightbox__nav--prev"
                    onClick={showPrev}
                    aria-label="Ảnh trước"
                  >
                    ‹
                  </button>
                  <img
                    key={activeEvent.id}
                    className="events-lightbox__image"
                    src={activeEvent.src}
                    alt={activeEvent.alt}
                  />
                  <button
                    type="button"
                    className="events-lightbox__nav events-lightbox__nav--next"
                    onClick={showNext}
                    aria-label="Ảnh sau"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
