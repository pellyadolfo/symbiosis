import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Check, Info, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { clamp, formatCurrency, formatNumber, formatPercent, formatPreciseCurrency } from '../lib/format'
import type { Project } from '../types'
import { Button, LinkButton } from './ui/Button'
import { TextField } from './ui/Field'
import { Badge, Card, Divider } from './ui/Surface'

const roundTo = (value: number, step: number): number => Math.round(value / step) * step

const quickAmounts = (minimum: number) => {
  const options = [minimum, minimum * 2, minimum * 5, minimum * 10]
  return [...new Set(options)].filter((value) => value <= 100_000)
}

export const InvestPanel = ({ project }: { project: Project }) => {
  const { investor } = useAuth()
  const navigate = useNavigate()

  const isOpen = project.status === 'funding'
  const [amount, setAmount] = useState(project.minimumInvestment)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [waitlisted, setWaitlisted] = useState(false)

  const remaining = project.targetRaise - project.raised
  const unitPrice = project.minimumInvestment
  const maxAmount = Math.max(remaining, unitPrice)

  const units = Math.floor(clamp(amount, 0, maxAmount) / unitPrice)
  const invested = units * unitPrice
  const annualIncome = invested * project.projectedYield
  const netIncome = annualIncome * (1 - 0.15)
  const totalReturn = invested * (project.projectedYield + project.projectedAppreciation) * project.holdPeriodYears

  const quick = useMemo(() => quickAmounts(project.minimumInvestment), [project.minimumInvestment])

  const handleInvest = () => {
    if (!investor) return
    if (invested < project.minimumInvestment) {
      setError(`The minimum investment is ${formatCurrency(project.minimumInvestment)}.`)
      return
    }
    if (invested > remaining) {
      setError(`Only ${formatCurrency(remaining)} remains available in this raise.`)
      return
    }
    setError('')
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setConfirmed(true)
    }, 700)
  }

  if (!isOpen) {
    return (
      <Card className="p-6">
        <Badge tone={project.status === 'exited' ? 'neutral' : 'success'}>
          {project.status === 'exited' ? 'Investment closed' : 'Fully subscribed'}
        </Badge>
        <h2 className="font-display mt-3 text-2xl text-ink-950">This raise is no longer open</h2>
        <p className="mt-2 text-sm text-ink-600">
          {project.status === 'exited'
            ? 'The asset was sold and proceeds have been distributed to all holders. Historical documents remain available for reference.'
            : 'Every unit in this offering has been taken. We let you know when a matching unit is listed on the secondary market.'}
        </p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Target raise</dt>
            <dd className="font-medium text-ink-900">{formatCurrency(project.targetRaise)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Unit price</dt>
            <dd className="font-medium text-ink-900">{formatCurrency(unitPrice)}</dd>
          </div>
        </dl>

        <Divider className="my-5" />

        {waitlisted ? (
          <p className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
            <Check className="size-4" />
            You are on the secondary market list for this asset.
          </p>
        ) : (
          <Button variant="secondary" fullWidth onClick={() => setWaitlisted(true)}>
            Notify me about secondary units
          </Button>
        )}

        {!investor ? (
          <p className="mt-4 text-center text-xs text-ink-500">
            Already invested elsewhere?{' '}
            <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
              Log in
            </Link>
          </p>
        ) : null}
      </Card>
    )
  }

  if (confirmed) {
    return (
      <Card className="p-6 ring-emerald-300">
        <span className="grid size-11 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="size-6" />
        </span>
        <h2 className="font-display mt-4 text-2xl text-ink-950">Subscription received</h2>
        <p className="mt-2 text-sm text-ink-600">
          We have reserved {formatNumber(units)} {units === 1 ? 'unit' : 'units'} in{' '}
          {project.name}. This is a demo confirmation — no funds have moved.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Units reserved</dt>
            <dd className="font-medium text-ink-900">{formatNumber(units)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Amount</dt>
            <dd className="font-medium text-ink-900">{formatCurrency(invested)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Projected annual income</dt>
            <dd className="font-medium text-ink-900">{formatCurrency(netIncome)}</dd>
          </div>
        </dl>
        <Divider className="my-5" />
        <LinkButton to="/portfolio" fullWidth>
          View in my portfolio
        </LinkButton>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-ink-950">Invest in this project</h2>
      </div>
      <p className="mt-1 text-sm text-ink-500">
        Minimum {formatCurrency(project.minimumInvestment)} · {formatCurrency(remaining)} remaining
      </p>

      <div className="mt-6 space-y-4">
        <TextField
          label="Amount to invest"
          type="number"
          min={project.minimumInvestment}
          max={maxAmount}
          step={unitPrice}
          value={amount}
          error={error}
          onChange={(event) => {
            setAmount(Number(event.target.value))
            setError('')
          }}
        />

        <div className="flex flex-wrap gap-2">
          {quick.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setAmount(value)
                setError('')
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
                amount === value
                  ? 'bg-brand-700 text-white ring-brand-700'
                  : 'bg-white text-ink-700 ring-ink-200 hover:bg-ink-50'
              }`}
            >
              {formatCurrency(value)}
            </button>
          ))}
        </div>

        {amount > maxAmount ? (
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            That exceeds the {formatCurrency(remaining)} still available. You can invest up to{' '}
            {formatCurrency(roundTo(maxAmount, unitPrice))}.
          </p>
        ) : null}
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-ink-100 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">Units</dt>
          <dd className="font-medium text-ink-900">{formatNumber(units)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">Subscription amount</dt>
          <dd className="font-medium text-ink-900">{formatPreciseCurrency(invested)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">
            Projected annual income, net of {formatPercent(0.15, 0)} fee
          </dt>
          <dd className="font-medium text-brand-700">{formatCurrency(netIncome)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">Projected total over {project.holdPeriodYears} years</dt>
          <dd className="font-medium text-ink-900">{formatCurrency(totalReturn)}</dd>
        </div>
      </dl>

      <Divider className="my-5" />

      {investor ? (
        <>
          <Button fullWidth size="lg" onClick={handleInvest} disabled={submitting || units < 1}>
            {submitting ? 'Processing…' : `Invest ${formatCurrency(invested)}`}
            {!submitting ? <ArrowRight className="size-4" /> : null}
          </Button>
          <p className="mt-3 flex items-start gap-2 text-xs text-ink-500">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            Funds are held in escrow until the offering closes and are returned in full if the raise
            does not complete.
          </p>
        </>
      ) : (
        <>
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/login', { state: { from: `/invest/${project.slug}` } })}
          >
            Log in to invest
          </Button>
          <p className="mt-3 flex items-start gap-2 text-xs text-ink-500">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            New to Stonebridge?{' '}
            <Link to="/signup" className="font-medium text-brand-700 hover:text-brand-800">
              Open an account
            </Link>{' '}
            in about three minutes.
          </p>
        </>
      )}

      <p className="mt-4 text-xs text-ink-400">
        Projections are not guarantees. {formatPercent(project.riskLevel === 'low' ? 0.03 : 0.11)}{' '}
        of the subscription fee, {formatPreciseCurrency(invested * 0.015)}, is charged at closing.
      </p>
    </Card>
  )
}
