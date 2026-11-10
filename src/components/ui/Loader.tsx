export function Loader({ label = "Loading your finds…" }: { label?: string }) {
  return (
    <div className="route-loading" role="status">
      <span className="loader-ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
