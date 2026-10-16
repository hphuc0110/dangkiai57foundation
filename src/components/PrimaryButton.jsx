export function PrimaryButton({ children, loading = false, wide = false }) {
  return (
    <button className={`btn${wide ? " btn--wide" : ""}`} type="submit" disabled={loading}>
      {loading ? "Đang gửi..." : children}
    </button>
  );
}
