import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { ProgramIntro } from "./components/ProgramIntro";
import { ScheduleStep } from "./components/ScheduleStep";
import { SchoolStep } from "./components/SchoolStep";
import { Stepper } from "./components/Stepper";
import { StudentStep } from "./components/StudentStep";
import { SubmitStep } from "./components/SubmitStep";
import { SuccessPanel } from "./components/SuccessPanel";
import { TypePicker } from "./components/TypePicker";
import { COURSE, getSteps } from "./data/course";
import { INITIAL_VALUES, hasErrors, validateRegistrantType, validateStep } from "./lib/validate";
import { submitToSheet } from "./lib/submitToSheet";

const DRAFT_KEY = "hle-ai-foundation-draft";

function readDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const values = { ...INITIAL_VALUES, ...(parsed.values || {}) };
    const steps = getSteps(values.registrantType);
    const step = Math.min(Math.max(Number(parsed.step) || 0, 0), steps.length - 1);
    const maxStep = Math.min(
      Math.max(Number(parsed.maxStep ?? parsed.step) || 0, step),
      steps.length - 1,
    );
    return {
      step,
      maxStep,
      pickingType: Boolean(parsed.pickingType) || !values.registrantType,
      values,
    };
  } catch {
    return null;
  }
}

export default function App() {
  const [pickingType, setPickingType] = useState(() => readDraft()?.pickingType ?? true);
  const [step, setStep] = useState(() => readDraft()?.step ?? 0);
  const [maxStep, setMaxStep] = useState(() => readDraft()?.maxStep ?? 0);
  const [values, setValues] = useState(() => readDraft()?.values ?? INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const pendingScrollY = useRef(null);

  const steps = getSteps(values.registrantType);
  const stepId = steps[step]?.id;

  useEffect(() => {
    if (window.location.hash === "#dang-ky") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  useLayoutEffect(() => {
    if (pendingScrollY.current == null) return;
    const y = pendingScrollY.current;
    pendingScrollY.current = null;
    window.scrollTo(0, y);
  }, [pickingType, step]);

  useEffect(() => {
    if (status === "success") return;
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ step, maxStep, pickingType, values }),
    );
  }, [step, maxStep, pickingType, values, status]);

  function runWithoutScrollJump(update) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    pendingScrollY.current = window.scrollY;
    update();
  }

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

  function selectType(type) {
    setValues((current) => ({ ...current, registrantType: type }));
    clearRelatedErrors(["registrantType"]);
  }

  function confirmType() {
    const nextErrors = validateRegistrantType(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    runWithoutScrollJump(() => {
      setPickingType(false);
      setStep(0);
      setMaxStep(0);
      setErrors({});
    });
  }

  function changeType() {
    runWithoutScrollJump(() => {
      setPickingType(true);
      setStep(0);
      setMaxStep(0);
      setErrors({});
      setValues((current) => ({
        ...INITIAL_VALUES,
        registrantType: current.registrantType,
      }));
    });
  }

  function goNext() {
    const nextErrors = validateStep(step, values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    const next = Math.min(step + 1, steps.length - 1);
    runWithoutScrollJump(() => {
      setStep(next);
      setMaxStep((reached) => Math.max(reached, next));
    });
  }

  function goTo(index) {
    if (index > maxStep) return;
    runWithoutScrollJump(() => {
      setErrors({});
      setStep(index);
    });
  }

  async function handleSubmit() {
    const submitIndex = steps.findIndex((item) => item.id === "submit");
    const nextErrors = validateStep(submitIndex, values);
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
    setPickingType(true);
    setStep(0);
    setMaxStep(0);
    setStatus("idle");
    setSubmitError("");
    sessionStorage.removeItem(DRAFT_KEY);
  }

  return (
    <div className="page">
      <Header />
      {status !== "success" ? <ProgramIntro /> : null}
      <main className="main" id="dang-ky">
        {status === "success" ? (
          <SuccessPanel values={values} onReset={registerAnother} />
        ) : (
          <section className="register">
            <div className="register__inner">
              <header className="intro">
                <p className="intro__eyebrow">Đăng ký tham gia</p>
                <h1>Bắt đầu đăng ký</h1>
                <p>{pickingType ? "Chọn hình thức đăng ký để tiếp tục" : "Nhập thông tin để tiếp tục"}</p>
                <p className="intro__meta">
                  {COURSE.fullName} · <br /> Hạn đăng ký {COURSE.deadline}
                </p>
              </header>
              {!pickingType ? (
                <Stepper steps={steps} current={step} maxStep={maxStep} onSelect={goTo} />
              ) : null}
              <div
                className={`form-panel${pickingType ? " form-panel--type" : `form-panel--${step}`}`}
              >
                {pickingType ? (
                  <TypePicker
                    value={values.registrantType}
                    error={errors.registrantType}
                    onSelect={selectType}
                    onNext={confirmType}
                  />
                ) : null}
                {!pickingType && stepId === "info" && values.registrantType === "school" ? (
                  <SchoolStep
                    values={values}
                    errors={errors}
                    onChange={update}
                    onNext={goNext}
                    onChangeType={changeType}
                  />
                ) : null}
                {!pickingType && stepId === "info" && values.registrantType === "personal" ? (
                  <StudentStep
                    values={values}
                    errors={errors}
                    onChange={update}
                    onNext={goNext}
                    onChangeType={changeType}
                  />
                ) : null}
                {!pickingType && stepId === "schedule" ? (
                  <ScheduleStep
                    values={values}
                    errors={errors}
                    onChange={update}
                    onChangeMany={updateMany}
                    onNext={goNext}
                  />
                ) : null}
                {!pickingType && stepId === "submit" ? (
                  <SubmitStep
                    values={values}
                    errors={errors}
                    onChange={update}
                    onSubmit={handleSubmit}
                    submitting={status === "submitting"}
                    submitError={submitError}
                  />
                ) : null}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
