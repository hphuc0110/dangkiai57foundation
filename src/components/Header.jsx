import { COURSE } from "../data/course";
import { scrollToRegistration } from "../lib/scrollToRegistration";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="header">
      <a className="brand" href="#dang-ky" onClick={scrollToRegistration}>
        <Logo />
        <span className="brand__name">{COURSE.brand}</span>
      </a>
      <p className="header__aside">
        Hotline liên hệ: <a href={`tel:${COURSE.hotlineTel}`}>{COURSE.hotline}</a>
      </p>
    </header>
  );
}
