import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ShieldCheck, TrendingUp, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button, LinkButton } from '../components/ui/Button'
import { TextField } from '../components/ui/Field'
import { Card } from '../components/ui/Surface'

const benefits = [
  { icon: Wallet, text: 'Invest from $500 per unit' },
  { icon: TrendingUp, text: 'Track yield, valuation, and distributions' },
  { icon: ShieldCheck, text: 'Every sponsor reviewed before listing' },
]

export const LoginPage = () => {
  const { investor, isReady, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/portfolio'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isReady && investor) return <Navigate to={from} replace />

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Log in to your account"
      subtitle="Pick up where you left off with your holdings and distributions."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error ? (
          <p
            className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <div className="mt-6 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-600">
        <p className="font-medium text-ink-800">Demo access</p>
        <p className="mt-1">
          Any valid email and a password of 6 or more characters will sign you in.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-ink-600">
        No account yet?{' '}
        <Link to="/signup" className="font-medium text-brand-700 hover:text-brand-800">
          Open an account
        </Link>
      </p>
    </AuthShell>
  )
}

export const SignupPage = () => {
  const { investor, isReady, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/portfolio'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isReady && investor) return <Navigate to={from} replace />

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await signUp({ name, email, password })
      navigate(from, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Open an account"
      subtitle="Takes about three minutes. You can browse without an account and fund it when you are ready."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error ? (
          <p
            className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <TextField
          label="Full name"
          autoComplete="name"
          placeholder="Alex Moreno"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Use 8 or more characters. A password manager is worth the trouble."
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          {submitting ? 'Creating your account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        By creating an account you agree to the terms of use and acknowledge the risk disclosure.
        This is a demo interface and no real account is created.
      </p>

      <p className="mt-6 text-center text-sm text-ink-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}

const AuthShell = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) => (
  <div className="container-page py-12 lg:py-20">
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-brand-700"
    >
      <ArrowLeft className="size-4" />
      Back to home
    </Link>

    <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <h1 className="font-display text-4xl tracking-tight text-ink-950">{title}</h1>
        <p className="mt-3 max-w-md text-ink-600">{subtitle}</p>
        <ul className="mt-8 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit.text} className="flex items-center gap-3 text-ink-700">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-800">
                <benefit.icon className="size-4" />
              </span>
              <span className="text-sm">{benefit.text}</span>
            </li>
          ))}
        </ul>
        <Card className="mt-8 bg-brand-900 p-6 ring-brand-900">
          <p className="font-display text-lg text-white">Start with $500</p>
          <p className="mt-1.5 text-sm text-brand-100">
            The lowest project minimum on the platform. A single unit in Wren Court Apartments is
            $1,000 and pays monthly.
          </p>
          <LinkButton
            to="/invest"
            className="mt-5 bg-white text-brand-900 hover:bg-brand-50"
            variant="primary"
          >
            Browse offerings
          </LinkButton>
        </Card>
      </div>

      <Card className="p-6 sm:p-8">{children}</Card>
    </div>
  </div>
)
