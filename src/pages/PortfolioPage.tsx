import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Card, Badge, EmptyState, StatCard } from '../components/ui/Surface'
import { LinkButton } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { activity, holdings } from '../data/investor'
import { getProjectById, projects } from '../data/projects'
import { formatCompactCurrency, formatCurrency, formatDate, formatPercent } from '../lib/format'
import type { Holding, HoldingStatus } from '../types'
import { PropertyVisual } from '../components/PropertyVisual'
import { ProgressBar } from '../components/ProgressBar'

const holdingStatusLabel: Record<HoldingStatus, string> = {
  active: 'Active',
  distributing: 'Distributing',
  exited: 'Exited',
}

const holdingStatusTone: Record<HoldingStatus, 'brand' | 'success' | 'neutral'> = {
  active: 'brand',
  distributing: 'success',
  exited: 'neutral',
}

const eventIcon = {
  investment: Wallet,
  distribution: CircleDollarSign,
  milestone: Building2,
  valuation: TrendingUp,
  exit: PiggyBank,
} as const

export const PortfolioPage = () => {
  const { investor } = useAuth()

  const summary = useMemo(() => {
    const invested = holdings.reduce((total, holding) => total + holding.investedAmount, 0)
    const value = holdings.reduce((total, holding) => total + holding.currentValue, 0)
    const distributions = holdings.reduce(
      (total, holding) => total + holding.distributionsReceived,
      0,
    )
    const activeValue = holdings
      .filter((holding) => holding.status !== 'exited')
      .reduce((total, holding) => total + holding.currentValue, 0)

    const weightedReturn =
      value + distributions - invested === 0
        ? 0
        : (value + distributions - invested) / invested

    return { invested, value, distributions, activeValue, weightedReturn }
  }, [])

  const openOpportunities = projects.filter((project) => project.status === 'funding').slice(0, 3)

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
            Portfolio
          </p>
          <h1 className="font-display mt-2 text-4xl tracking-tight text-ink-950">
            {investor ? `Welcome back, ${investor.name.split(' ')[0]}` : 'Your portfolio'}
          </h1>
          <p className="mt-2 text-ink-600">
            {holdings.length} investments · member since{' '}
            {investor ? formatDate(investor.joinedAt) : '—'}
          </p>
        </div>
        <LinkButton to="/invest">Invest in another project</LinkButton>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current value"
          value={formatCurrency(summary.value)}
          hint="Valued at the most recent mark"
          icon={<Wallet className="size-4" />}
        />
        <StatCard
          label="Capital invested"
          value={formatCurrency(summary.invested)}
          hint={`${formatCompactCurrency(summary.activeValue)} still in active assets`}
          icon={<PiggyBank className="size-4" />}
          tone="sand"
        />
        <StatCard
          label="Distributions received"
          value={formatCurrency(summary.distributions)}
          hint="Cash paid to your account"
          icon={<CircleDollarSign className="size-4" />}
          tone="success"
        />
        <StatCard
          label="Total return"
          value={formatPercent(summary.weightedReturn)}
          hint="Value and distributions versus capital invested"
          icon={<TrendingUp className="size-4" />}
          tone="brand"
        />
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink-950">Your holdings</h2>
        <div className="mt-5 space-y-4">
          {holdings.map((holding) => (
            <HoldingRow key={holding.id} holding={holding} />
          ))}
        </div>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="font-display text-2xl text-ink-950">Activity</h2>
          <Card className="mt-5 divide-y divide-ink-100">
            {activity.map((event) => {
              const project = getProjectById(event.projectId)
              const Icon = eventIcon[event.type]
              return (
                <div key={event.id} className="flex items-start gap-4 px-5 py-4">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-ink-900">{event.title}</p>
                      {event.amount !== undefined ? (
                        <p
                          className={`font-display text-sm ${
                            event.amount >= 0 ? 'text-brand-700' : 'text-ink-700'
                          }`}
                        >
                          {event.amount >= 0 ? '+' : ''}
                          {formatCurrency(event.amount)}
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-ink-600">{event.detail}</p>
                    <p className="mt-1 text-xs text-ink-400">
                      {project ? `${project.name} · ` : ''}
                      {formatDate(event.occurredAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </Card>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink-950">Open now</h2>
          <Card className="mt-5 divide-y divide-ink-100">
            {openOpportunities.map((project) => (
              <Link
                key={project.id}
                to={`/invest/${project.slug}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink-50"
              >
                <PropertyVisual
                  tone={project.gallery[0].tone}
                  className="size-14 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-900">{project.name}</p>
                  <p className="mt-0.5 text-sm text-ink-500">
                    {formatPercent(project.projectedYield)} yield · from{' '}
                    {formatCurrency(project.minimumInvestment)}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-ink-400" />
              </Link>
            ))}
          </Card>

          <Card className="mt-4 p-5">
            <p className="text-sm text-ink-600">
              <span className="font-medium text-ink-900">Accreditation status: </span>
              {investor?.accreditation === 'verified'
                ? 'Verified. You can invest in every offering on the platform.'
                : 'Not yet verified. Some development offerings require accreditation.'}
            </p>
            {investor?.accreditation !== 'verified' ? (
              <LinkButton to="/signup" variant="secondary" size="sm" className="mt-4">
                Start verification
              </LinkButton>
            ) : null}
          </Card>
        </section>
      </div>

      {holdings.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Wallet className="size-10" />}
          title="No investments yet"
          description="Once you subscribe to an offering it will appear here with distributions and valuations."
          action={<LinkButton to="/invest">Browse offerings</LinkButton>}
        />
      ) : null}
    </div>
  )
}

const HoldingRow = ({ holding }: { holding: Holding }) => {
  const project = getProjectById(holding.projectId)

  if (!project) return null

  const gain = holding.currentValue + holding.distributionsReceived - holding.investedAmount
  const gainPercent = holding.investedAmount === 0 ? 0 : gain / holding.investedAmount

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lift">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <PropertyVisual
          tone={project.gallery[0].tone}
          className="h-32 shrink-0 rounded-xl sm:size-28"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/invest/${project.slug}`}
              className="font-display text-lg text-ink-950 hover:text-brand-700"
            >
              {project.name}
            </Link>
            <Badge tone={holdingStatusTone[holding.status]}>
              {holdingStatusLabel[holding.status]}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-ink-500">
            {project.address.city}, {project.address.state} · {holding.unitsBought} units · joined{' '}
            {formatDate(holding.purchasedAt)}
          </p>

          {project.status === 'funding' ? (
            <ProgressBar
              value={project.raised / project.targetRaise}
              showValue={false}
              className="mt-3 max-w-xs"
            />
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:w-64">
          <div>
            <dt className="text-xs text-ink-500">Invested</dt>
            <dd className="font-display mt-0.5 text-lg text-ink-950">
              {formatCurrency(holding.investedAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Value</dt>
            <dd className="font-display mt-0.5 text-lg text-ink-950">
              {formatCurrency(holding.currentValue)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Distributions</dt>
            <dd className="font-display mt-0.5 text-lg text-brand-700">
              {formatCurrency(holding.distributionsReceived)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Total return</dt>
            <dd
              className={`font-display mt-0.5 text-lg ${gain >= 0 ? 'text-brand-700' : 'text-red-600'}`}
            >
              {formatPercent(gainPercent)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  )
}
