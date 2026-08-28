export default function Logo({ size = 32, className = '' }) {
  return (
    <img
      src="/logo.png"
      alt="Ration Saathi"
      className={`object-contain ${className}`}
      style={{ height: size, width: 'auto' }}
    />
  );
}