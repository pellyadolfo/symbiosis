import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

const fieldClasses =
  'w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 hover:ring-ink-300 focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-ink-50 disabled:text-ink-400'

const Field = ({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: (id: string) => ReactNode
}) => {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink-800">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-sm text-ink-500">{hint}</p>
      ) : null}
    </div>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  hint?: string
  error?: string
}

export const TextField = ({ label, hint, error, className = '', ...props }: TextFieldProps) => (
  <Field label={label} hint={hint} error={error}>
    {(id) => (
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={`${fieldClasses} ${error ? 'ring-red-400 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
    )}
  </Field>
)

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

export const SelectField = ({
  label,
  hint,
  error,
  className = '',
  children,
  ...props
}: SelectFieldProps) => (
  <Field label={label} hint={hint} error={error}>
    {(id) => (
      <select
        id={id}
        className={`${fieldClasses} pr-9 ${error ? 'ring-red-400' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
    )}
  </Field>
)
