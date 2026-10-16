export function scrollToRegistration(event) {
  event?.preventDefault();
  document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (window.location.hash) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
}
