import { MapPin, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { assetTypeLabels, strategyLabels } from '../data/projects'
import { formatAddress, formatCompactCurrency, formatCurrency, formatPercent } from '../lib/format'
import type { Project, ProjectStatus } from '../types'
import { PropertyVisual } from './PropertyVisual'
import { ProgressBar } from './ProgressBar'
import { Badge, Card } from './ui/Surface'

const statusTone: Record<ProjectStatus, 'brand' | 'success' | 'warning' | 'neutral'> = {
  funding: 'brand',
  'fully-funded': 'success',
  'in-development': 'warning',
  exited: 'neutral',
}

const statusCopy: Record<ProjectStatus, string> = {
  funding: 'Open',
  'fully-funded': 'Fully funded',
  'in-development': 'In development',
  exited: 'Exited',
}

export const ProjectCard = ({ project }: { project: Project }) => {
  const isOpen = project.status === 'funding'
  const projectedIrr = project.projectedYield + project.projectedAppreciation

  return (
    <Card
      as="article"
      className="group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift"
    >
      <PropertyVisual
        tone={project.gallery[0].tone}
        label={`${assetTypeLabels[project.assetType]} · built ${project.yearBuilt}`}
        className="h-44 shrink-0"
      >
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge tone={statusTone[project.status]} className="bg-white/92 backdrop-blur">
            {statusCopy[project.status]}
          </Badge>
          {project.featured ? <Badge className="bg-white/92 text-ink-800 backdrop-blur">Featured</Badge> : null}
        </div>
      </PropertyVisual>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-ink-950">
            <Link to={`/invest/${project.slug}`} className="after:absolute after:inset-0">
              {project.name}
            </Link>
          </h3>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{formatAddress(project.address)}</span>
        </p>

        <p className="mt-3 line-clamp-2 text-sm text-ink-600">{project.tagline}</p>

        <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-ink-100 py-3">
          <div>
            <dt className="text-xs text-ink-500">Proj. yield</dt>
            <dd className="font-display mt-0.5 text-lg text-ink-950">
              {formatPercent(project.projectedYield)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Hold</dt>
            <dd className="font-display mt-0.5 text-lg text-ink-950">
              {project.holdPeriodYears} yrs
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">From</dt>
            <dd className="font-display mt-0.5 text-lg text-ink-950">
              {formatCurrency(project.minimumInvestment)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 space-y-3">
          <ProgressBar value={project.raised / project.targetRaise} showValue={isOpen} />
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-500">
              {isOpen
                ? `${formatCompactCurrency(project.targetRaise - project.raised)} remaining`
                : strategyLabels[project.strategy]}
            </span>
            {isOpen ? (
              <span className="flex items-center gap-1 font-medium text-brand-700">
                <TrendingUp className="size-3.5" />
                {formatPercent(projectedIrr, 1)} proj. total
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  )
}
