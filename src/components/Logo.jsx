export function Logo({ size = 32 }) {
  return (
    <img
      className="brand__mark"
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      decoding="async"
    />
  );
}
