import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-55'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-700 text-white shadow-soft hover:bg-brand-800 active:translate-y-px hover:shadow-lift',
  secondary:
    'bg-white text-ink-900 ring-1 ring-ink-200 shadow-soft hover:bg-ink-50 hover:ring-ink-300 active:translate-y-px',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:translate-y-px',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
)

type LinkButtonProps = CommonProps & {
  to: string
  onClick?: () => void
}

export const LinkButton = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  to,
  onClick,
  children,
}: LinkButtonProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
  >
    {children}
  </Link>
)
