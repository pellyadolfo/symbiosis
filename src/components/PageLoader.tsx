export const PageLoader = ({ label = 'Loading' }: { label?: string }) => (
  <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-3">
    <div
      className="size-8 animate-spin rounded-full border-2 border-ink-200 border-t-brand-600"
      role="status"
      aria-label={label}
    />
    <p className="text-sm text-ink-500">{label}</p>
  </div>
)
