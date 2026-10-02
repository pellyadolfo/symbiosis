import type { ReactNode } from 'react'

/**
 * Deterministic gradient stand-in for property photography. Keeps the demo
 * self-contained and free of network image dependencies.
 */
export const PropertyVisual = ({
  tone,
  label,
  className = '',
  children,
}: {
  tone: string
  label?: string
  className?: string
  children?: ReactNode
}) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${tone} ${className}`}>
    <div
      className="absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 14px)',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
    {label ? (
      <span className="absolute bottom-3 left-3 text-xs font-medium tracking-wide text-white/90">
        {label}
      </span>
    ) : null}
    {children}
  </div>
)
