import { clamp } from '../lib/format'

export const ProgressBar = ({
  value,
  label,
  showValue = true,
  className = '',
}: {
  /** 0 to 1. */
  value: number
  label?: string
  showValue?: boolean
  className?: string
}) => {
  const pct = clamp(value, 0, 1) * 100
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
          {label ? <span className="text-ink-600">{label}</span> : <span />}
          {showValue ? (
            <span className="font-medium text-ink-900">{pct.toFixed(0)}% funded</span>
          ) : null}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-ink-200/80"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Funding progress'}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
