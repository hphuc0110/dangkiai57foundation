import { COURSE } from "../data/course";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="header">
      <a className="brand" href="#dang-ky">
        <Logo />
        <span className="brand__name">{COURSE.brand}</span>
      </a>
      <p className="header__aside">
        Hotline liên hệ: <a href={`tel:${COURSE.hotlineTel}`}>{COURSE.hotline}</a>
      </p>
    </header>
  );
}
