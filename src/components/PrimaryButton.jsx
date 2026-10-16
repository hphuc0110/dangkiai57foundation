export function PrimaryButton({ children, loading = false, wide = false }) {
  return (
    <button
      className={`btn${wide ? " btn--wide" : ""}`}
      type="submit"
      disabled={loading}
      onMouseDown={(event) => event.preventDefault()}
    >
      {loading ? "Đang gửi..." : children}
    </button>
  );
}
