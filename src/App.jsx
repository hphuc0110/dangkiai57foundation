import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { ScheduleStep } from "./components/ScheduleStep";
import { Stepper } from "./components/Stepper";
import { StudentStep } from "./components/StudentStep";
import { SubmitStep } from "./components/SubmitStep";
import { SuccessPanel } from "./components/SuccessPanel";
import { COURSE, STEPS } from "./data/course";
import { INITIAL_VALUES, hasErrors, validateStep } from "./lib/validate";
import { submitToSheet } from "./lib/submitToSheet";

const DRAFT_KEY = "hle-ai-foundation-draft";

function readDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const step = Math.min(Math.max(Number(parsed.step) || 0, 0), STEPS.length - 1);
    const maxStep = Math.min(
      Math.max(Number(parsed.maxStep ?? parsed.step) || 0, step),
      STEPS.length - 1,
    );
    return {
      step,
      maxStep,
      values: { ...INITIAL_VALUES, ...(parsed.values || {}) },
    };
  } catch {
    return null;
  }
}

export default function App() {
  const [step, setStep] = useState(() => readDraft()?.step ?? 0);
  const [maxStep, setMaxStep] = useState(() => readDraft()?.maxStep ?? 0);
  const [values, setValues] = useState(() => readDraft()?.values ?? INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (status === "success") return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, maxStep, values }));
  }, [step, maxStep, values, status]);

  function clearRelatedErrors(keys) {
    setErrors((current) => {
      if (!keys.some((key) => current[key])) return current;
      const next = { ...current };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  }

  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    const related =
      name === "schedule" || name === "freeDays" || name === "freeTimeStart" || name === "freeTimeEnd"
        ? ["schedule", "availability", name]
        : [name];
    clearRelatedErrors(related);
  }

  function updateMany(patch) {
    setValues((current) => ({ ...current, ...patch }));
    clearRelatedErrors([...Object.keys(patch), "schedule", "availability"]);
  }

  function goNext() {
    const nextErrors = validateStep(step, values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    const next = Math.min(step + 1, STEPS.length - 1);
    setStep(next);
    setMaxStep((reached) => Math.max(reached, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goTo(index) {
    if (index > maxStep) return;
    setErrors({});
    setStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const nextErrors = validateStep(2, values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setStatus("submitting");
    setSubmitError("");
    try {
      await submitToSheet(values);
      sessionStorage.removeItem(DRAFT_KEY);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setSubmitError(error.message || "Không gửi được đăng ký. Vui lòng thử lại.");
    }
  }

  function registerAnother() {
    setValues(INITIAL_VALUES);
    setErrors({});
    setStep(0);
    setMaxStep(0);
    setStatus("idle");
    setSubmitError("");
    sessionStorage.removeItem(DRAFT_KEY);
  }

  return (
    <div className="page">
      <Header />
      <main className="main" id="dang-ky">
        {status === "success" ? (
          <SuccessPanel values={values} onReset={registerAnother} />
        ) : (
          <>
            <header className="intro">
              <h1>Bắt đầu đăng ký</h1>
              <p>Nhập thông tin để tiếp tục</p>
              <p className="intro__meta">
                {COURSE.fullName} · Hạn đăng ký {COURSE.deadline}
              </p>
            </header>
            <Stepper steps={STEPS} current={step} maxStep={maxStep} onSelect={goTo} />
            <div className={`form-panel form-panel--${step}`} key={step}>
              {step === 0 && <StudentStep values={values} errors={errors} onChange={update} onNext={goNext} />}
              {step === 1 && (
                <ScheduleStep
                  values={values}
                  errors={errors}
                  onChange={update}
                  onChangeMany={updateMany}
                  onNext={goNext}
                />
              )}
              {step === 2 && (
                <SubmitStep
                  values={values}
                  errors={errors}
                  onChange={update}
                  onSubmit={handleSubmit}
                  submitting={status === "submitting"}
                  submitError={submitError}
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
