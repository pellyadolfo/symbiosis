import { ArrowLeft, Check, Circle, Clock, MapPin, ShieldCheck, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { InvestPanel } from '../components/InvestPanel'
import { ProjectCard } from '../components/ProjectCard'
import { PropertyVisual } from '../components/PropertyVisual'
import { ProgressBar } from '../components/ProgressBar'
import { LinkButton } from '../components/ui/Button'
import { Badge, Card, SectionHeading } from '../components/ui/Surface'
import {
  assetTypeLabels,
  getProjectBySlug,
  projects,
  statusLabels,
  strategyLabels,
} from '../data/projects'
import {
  formatAddress,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercent,
} from '../lib/format'

const riskCopy = {
  low: 'Lower risk: stabilized asset, low leverage, long leases',
  moderate: 'Moderate risk: renovation or lease-up execution required',
  elevated: 'Elevated risk: development, permitting, or demand uncertainty',
} as const

export const ProjectDetailPage = () => {
  const { slug = '' } = useParams()
  const project = getProjectBySlug(slug)
  const [activeImage, setActiveImage] = useState(0)

  if (!project) return <Navigate to="/invest" replace />

  const related = projects
    .filter((item) => item.id !== project.id && item.assetType === project.assetType)
    .slice(0, 3)

  const projectedIrr = project.projectedYield + project.projectedAppreciation
  const remaining = project.targetRaise - project.raised

  const details = [
    { label: 'Asset class', value: assetTypeLabels[project.assetType] },
    { label: 'Strategy', value: strategyLabels[project.strategy] },
    { label: 'Property manager', value: project.propertyManager },
    { label: 'Units', value: formatNumber(project.units) },
    { label: 'Rentable area', value: `${formatNumber(project.squareFeet)} sq ft` },
    { label: 'Year built', value: String(project.yearBuilt) },
    { label: 'Distribution', value: project.distribution },
    { label: 'Target hold', value: `${project.holdPeriodYears} years` },
    { label: 'Expense ratio', value: formatPercent(project.expenseRatio, 0) },
    {
      label: 'Entry valuation',
      value: `${formatPercent(project.projectedYield)} cap on cost`,
    },
  ]

  return (
    <div className="pb-8">
      <div className="container-page pt-6">
        <Link
          to="/invest"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="size-4" />
          All offerings
        </Link>
      </div>

      <section className="container-page mt-5">
        <div className="grid gap-3 lg:grid-cols-4">
          <PropertyVisual
            tone={project.gallery[activeImage].tone}
            label={project.gallery[activeImage].label}
            className="h-72 rounded-2xl sm:h-96 lg:col-span-3"
          />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {project.gallery.slice(1, 5).map((image, index) => (
              <button
                key={image.label}
                type="button"
                onClick={() => setActiveImage(index + 1)}
                className={`group relative overflow-hidden rounded-xl ring-2 transition ${
                  activeImage === index + 1
                    ? 'ring-brand-600'
                    : 'ring-transparent hover:ring-ink-300'
                }`}
                aria-label={`Show ${image.label}`}
              >
                <PropertyVisual tone={image.tone} label={image.label} className="h-full" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page mt-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{statusLabels[project.status]}</Badge>
          <Badge>{strategyLabels[project.strategy]}</Badge>
          <Badge tone="neutral">{assetTypeLabels[project.assetType]}</Badge>
        </div>

        <h1 className="font-display mt-4 text-4xl tracking-tight text-ink-950 sm:text-5xl">
          {project.name}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-ink-600">
          <MapPin className="size-4 text-ink-400" />
          {formatAddress(project.address)} {project.address.postalCode}
        </p>
        <p className="mt-4 max-w-3xl text-lg text-ink-600">{project.tagline}</p>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-ink-200 py-6 sm:grid-cols-4">
          {[
            { label: 'Projected yield', value: formatPercent(project.projectedYield) },
            { label: 'Projected appreciation', value: formatPercent(project.projectedAppreciation) },
            { label: 'Projected total return', value: formatPercent(projectedIrr) },
            { label: 'Target hold', value: `${project.holdPeriodYears} years` },
          ].map((metric) => (
            <div key={metric.label}>
              <dt className="text-sm text-ink-500">{metric.label}</dt>
              <dd className="font-display mt-1 text-3xl tracking-tight text-ink-950">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-page mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          <div>
            <h2 className="font-display text-2xl text-ink-950">The investment</h2>
            <p className="mt-3 leading-relaxed text-ink-600">{project.summary}</p>
            <ul className="mt-6 space-y-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <Check className="mt-0.5 size-4.5 shrink-0 text-brand-600" />
                  <span className="text-ink-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink-950">Property details</h2>
            <Card className="mt-5 divide-y divide-ink-100">
              {details.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between gap-6 px-5 py-3">
                  <dt className="text-sm text-ink-500">{detail.label}</dt>
                  <dd className="text-sm font-medium text-ink-900">{detail.value}</dd>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink-950">Use of funds</h2>
            <p className="mt-2 text-sm text-ink-600">
              {formatCurrency(project.targetRaise)} of equity is allocated as follows.
            </p>
            <div className="mt-5 space-y-4">
              {project.useOfFunds.map((line) => (
                <div key={line.label}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-ink-800">{line.label}</span>
                    <span className="text-ink-600">
                      {formatPercent(line.percent, 0)} ·{' '}
                      {formatCompactCurrency(line.percent * project.targetRaise)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-200/80">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${line.percent * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink-950">Project timeline</h2>
            <ol className="mt-5 space-y-0">
              {project.timeline.map((step, index) => (
                <li key={step.milestone} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full ${
                        step.status === 'done'
                          ? 'bg-brand-600 text-white'
                          : step.status === 'active'
                            ? 'bg-white text-brand-700 ring-2 ring-brand-500'
                            : 'bg-ink-100 text-ink-400'
                      }`}
                    >
                      {step.status === 'done' ? (
                        <Check className="size-3.5" />
                      ) : step.status === 'active' ? (
                        <Clock className="size-3.5" />
                      ) : (
                        <Circle className="size-2" />
                      )}
                    </span>
                    {index < project.timeline.length - 1 ? (
                      <span className="my-1 w-px flex-1 bg-ink-200" />
                    ) : null}
                  </div>
                  <div className="pb-6">
                    <p className="font-medium text-ink-900">{step.milestone}</p>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {step.date}
                      {step.status === 'active' ? ' · in progress' : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink-950">Sponsor</h2>
            <Card className="mt-5 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-xl text-ink-950">{project.sponsor.name}</p>
                  <p className="mt-1 text-sm text-ink-500">
                    {project.sponsor.trackRecordDeals} completed deals over{' '}
                    {project.sponsor.trackRecordYears} years
                  </p>
                </div>
                <Badge tone="success">
                  <ShieldCheck className="size-3.5" />
                  Reviewed by Stonebridge
                </Badge>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-ink-100 pt-5">
                <div>
                  <dt className="text-xs text-ink-500">Realized net IRR</dt>
                  <dd className="font-display mt-1 text-2xl text-ink-950">
                    {formatPercent(project.sponsor.realizedIrr)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">Deals completed</dt>
                  <dd className="font-display mt-1 text-2xl text-ink-950">
                    {project.sponsor.trackRecordDeals}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">Risk classification</dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink-900 capitalize">
                    {project.riskLevel}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-ink-500">{riskCopy[project.riskLevel]}.</p>
            </Card>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink-950">The raise</h2>
            <Card className="mt-5 p-6">
              <ProgressBar
                value={project.raised / project.targetRaise}
                label={`${formatCurrency(project.raised)} raised of ${formatCurrency(project.targetRaise)}`}
                className="mb-6"
              />
              <dl className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {[
                  { label: 'Remaining', value: formatCompactCurrency(remaining) },
                  { label: 'Unit price', value: formatCurrency(project.minimumInvestment) },
                  { label: 'Investors', value: formatNumber(Math.round(project.raised / 4200)) },
                  { label: 'Days to close', value: project.status === 'funding' ? '18' : '—' },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs text-ink-500">{item.label}</dt>
                    <dd className="font-display mt-1 text-xl text-ink-950">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <InvestPanel project={project} />
          <Card className="mt-4 p-5">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-500">
              <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
              Projected figures come from the sponsor pro forma. Actual results depend on rents,
              expenses, financing costs, and exit timing.
            </p>
          </Card>
        </aside>
      </section>

      {related.length > 0 ? (
        <section className="container-page mt-20">
          <SectionHeading
            eyebrow="Similar assets"
            title={`More ${assetTypeLabels[project.assetType].toLowerCase()} offerings`}
            action={
              <LinkButton to="/invest" variant="secondary">
                View all
              </LinkButton>
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
