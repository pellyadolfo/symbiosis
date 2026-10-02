import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const Card = ({
  children,
  className = '',
  as: Component = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}) => (
  <Component
    className={`rounded-2xl bg-white ring-1 ring-ink-200/70 shadow-soft ${className}`}
  >
    {children}
  </Component>
)

type Tone = 'brand' | 'sand' | 'success' | 'warning' | 'neutral' | 'danger'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-800 ring-brand-200',
  sand: 'bg-sand-100 text-sand-600 ring-sand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
}

export const Badge = ({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tones[tone]} ${className}`}
  >
    {children}
  </span>
)

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-display mt-2 text-3xl tracking-tight text-ink-950 sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-3 text-base text-ink-600">{description}</p> : null}
    </div>
    {action}
  </div>
)

export const Divider = ({ className = '' }: { className?: string }) => (
  <hr className={`border-ink-200/80 ${className}`} />
)

export const StatCard = ({
  label,
  value,
  hint,
  icon,
  tone = 'brand',
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: ReactNode
  tone?: Tone
}) => (
  <Card className="p-5">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-ink-500">{label}</p>
      {icon ? (
        <span
          className={`flex size-9 items-center justify-center rounded-xl ring-1 ring-inset ${tones[tone]}`}
        >
          {icon}
        </span>
      ) : null}
    </div>
    <p className="font-display mt-3 text-2xl tracking-tight text-ink-950">{value}</p>
    {hint ? <p className="mt-1 text-sm text-ink-500">{hint}</p> : null}
  </Card>
)

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}) => (
  <Card className={`flex flex-col items-center gap-3 px-6 py-16 text-center ${className}`}>
    {icon ? <div className="text-ink-300">{icon}</div> : null}
    <h3 className="font-display text-xl text-ink-950">{title}</h3>
    <p className="max-w-md text-sm text-ink-600">{description}</p>
    {action}
  </Card>
)

export const InlineLink = ({
  to,
  children,
  className = '',
}: {
  to: string
  children: ReactNode
  className?: string
}) => (
  <Link to={to} className={`font-medium text-brand-700 hover:text-brand-800 ${className}`}>
    {children}
  </Link>
)
