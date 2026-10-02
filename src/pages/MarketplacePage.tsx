import { SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { Button } from '../components/ui/Button'
import { SelectField, TextField } from '../components/ui/Field'
import { Card, EmptyState } from '../components/ui/Surface'
import { assetTypeLabels, projects, strategyLabels } from '../data/projects'
import type { AssetType, Strategy } from '../types'

type SortKey = 'funded-desc' | 'funded-asc' | 'yield-desc' | 'minimum-asc' | 'closing'

type StatusFilter = 'all' | 'funding' | 'in-development' | 'fully-funded' | 'exited'

const sortLabels: Record<SortKey, string> = {
  'funded-desc': 'Closest to fully funded',
  'funded-asc': 'Largest remaining need',
  'yield-desc': 'Highest projected yield',
  'minimum-asc': 'Lowest minimum',
  closing: 'Closing soonest',
}

/** Hand-tuned stand-in for a closing date so the mock data can be sorted. */
const closingOrder: Record<string, number> = {
  prj_mercer: 12,
  prj_wren: 26,
  prj_harrow: 31,
  prj_lantern: 18,
  prj_ashgrove: 9,
  prj_velvet: 0,
  prj_calder: 0,
  prj_westmoor: 0,
}

export const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [assetType, setAssetType] = useState<AssetType | 'all'>('all')
  const [strategy, setStrategy] = useState<Strategy | 'all'>('all')
  const [status, setStatus] = useState<StatusFilter>(() => {
    const initial = searchParams.get('filter')
    return initial === 'featured' ? 'funding' : 'all'
  })
  const [sort, setSort] = useState<SortKey>('funded-desc')
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('filter') === 'featured')

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()

    const filtered = projects.filter((project) => {
      if (featuredOnly && !project.featured) return false
      if (assetType !== 'all' && project.assetType !== assetType) return false
      if (strategy !== 'all' && project.strategy !== strategy) return false
      if (status !== 'all' && project.status !== status) return false
      if (!term) return true

      return [
        project.name,
        project.tagline,
        project.address.city,
        project.address.state,
        project.sponsor.name,
        project.propertyManager,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'funded-desc':
        sorted.sort(
          (a, b) => b.raised / b.targetRaise - a.raised / a.targetRaise,
        )
        break
      case 'funded-asc':
        sorted.sort(
          (a, b) => a.raised / a.targetRaise - b.raised / b.targetRaise,
        )
        break
      case 'yield-desc':
        sorted.sort((a, b) => b.projectedYield - a.projectedYield)
        break
      case 'minimum-asc':
        sorted.sort((a, b) => a.minimumInvestment - b.minimumInvestment)
        break
      case 'closing':
        sorted.sort((a, b) => closingOrder[a.id] - closingOrder[b.id])
        break
    }
    return sorted
  }, [query, assetType, strategy, status, sort, featuredOnly])

  const hasFilters =
    query.trim() !== '' ||
    assetType !== 'all' ||
    strategy !== 'all' ||
    status !== 'all' ||
    featuredOnly

  const clearFilters = () => {
    setQuery('')
    setAssetType('all')
    setStrategy('all')
    setStatus('all')
    setFeaturedOnly(false)
    setSearchParams({}, { replace: true })
  }

  const toggleFeatured = () => {
    const next = !featuredOnly
    setFeaturedOnly(next)
    if (next) {
      setStatus('funding')
      setSearchParams({ filter: 'featured' }, { replace: true })
    } else {
      setStatus('all')
      setSearchParams({}, { replace: true })
    }
  }

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
          Marketplace
        </p>
        <h1 className="font-display mt-2 text-4xl tracking-tight text-ink-950 sm:text-5xl">
          Investment offerings
        </h1>
        <p className="mt-3 text-base text-ink-600">
          {projects.filter((project) => project.status === 'funding').length} projects are open for
          investment. Filter by asset class, strategy, or status to narrow the list.
        </p>
      </div>

      <Card className="mt-8 p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TextField
            label="Search"
            placeholder="City, sponsor, property name"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <SelectField
            label="Asset class"
            value={assetType}
            onChange={(event) => setAssetType(event.target.value as AssetType | 'all')}
          >
            <option value="all">All asset classes</option>
            {Object.entries(assetTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Strategy"
            value={strategy}
            onChange={(event) => setStrategy(event.target.value as Strategy | 'all')}
          >
            <option value="all">All strategies</option>
            {Object.entries(strategyLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as StatusFilter)
              if (event.target.value !== 'all') setFeaturedOnly(false)
            }}
          >
            <option value="all">Any status</option>
            <option value="funding">Open for investment</option>
            <option value="in-development">In development</option>
            <option value="fully-funded">Fully funded</option>
            <option value="exited">Exited</option>
          </SelectField>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={featuredOnly ? 'primary' : 'secondary'}
              size="sm"
              onClick={toggleFeatured}
            >
              Featured only
            </Button>
            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="size-3.5" />
                Clear filters
              </Button>
            ) : null}
            <span className="text-sm text-ink-500">
              {results.length} {results.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <SlidersHorizontal className="size-4 text-ink-400" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="rounded-lg bg-white px-2 py-1.5 text-sm text-ink-900 ring-1 ring-ink-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {results.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<SearchX className="size-10" />}
          title="No projects match those filters"
          description="Try widening the status filter, or clear everything and start again."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
