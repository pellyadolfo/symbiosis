import { AlertTriangle, Banknote, FileText, PieChart, RefreshCw, ShieldCheck } from 'lucide-react'
import { projects } from '../data/projects'
import { formatCurrency, formatPercent } from '../lib/format'
import { LinkButton } from '../components/ui/Button'
import { Card, SectionHeading } from '../components/ui/Surface'

const fees = [
  { label: 'Subscription fee', value: '1.5% of the amount invested, charged at closing' },
  { label: 'Ongoing management fee', value: '1.0% of collected rent, paid by the property' },
  { label: 'Disposition fee', value: '1.0% of sale price, paid at exit' },
  { label: 'Performance fee', value: '15% of net profits above an 8% preferred return' },
]

const risks = [
  'Property values can fall. A sale below your basis is possible and has happened in past cycles.',
  'Rental income depends on tenants paying. Vacancy, concessions, and bad debt all reduce distributions.',
  'Development projects carry permitting, construction cost, and delivery risk that can delay returns.',
  'Illiquidity: these are long-term holdings. We do not guarantee a buyer will exist when you want to sell.',
  'Leverage amplifies returns in both directions, including losses.',
]

const sponsorStats = [
  { value: '24', label: 'Sponsors reviewed' },
  { value: '41', label: 'Investments completed' },
  { value: '4.1%', label: 'Average forward cap rate' },
  { value: '0', label: 'Sponsors lost for cause' },
]

export const HowItWorksPage = () => {
  const avgYield =
    projects.reduce((total, project) => total + project.projectedYield, 0) / projects.length

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
          How it works
        </p>
        <h1 className="font-display mt-2 text-4xl tracking-tight text-ink-950 sm:text-5xl">
          A plain explanation of what you are buying
        </h1>
        <p className="mt-4 text-lg text-ink-600">
          You are buying an equity interest in a single property, held through a limited liability
          company that owns it. Distributions come from rent after expenses, and your share is
          based on the units you hold.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Average projected yield', value: formatPercent(avgYield), icon: PieChart },
          { label: 'Typical hold period', value: '6 years', icon: RefreshCw },
          { label: 'Lowest minimum', value: '$500', icon: Banknote },
          { label: 'Reviewed before listing', value: '100%', icon: ShieldCheck },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <stat.icon className="size-5 text-brand-600" />
            <p className="font-display mt-3 text-2xl text-ink-950">{stat.value}</p>
            <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Returns" title="Where your return comes from" />
          <div className="mt-6 space-y-5">
            <Card className="p-5">
              <h3 className="font-semibold text-ink-950">Rental income</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Tenants pay rent. After operating expenses, management fees, debt service, and
                reserves, what is left is distributed to holders in proportion to units owned. Most
                projects here distribute monthly or quarterly.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-ink-950">Appreciation</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                If the property is sold above your basis, or rent growth lifts its value, that gain
                shows up at exit. This is the portion you cannot count on in advance, and it is
                where most of the variance between deals comes from.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-ink-950">Re-marking</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Each holding is valued at least annually. Your portfolio value on this dashboard
                reflects the most recent mark, not the original investment.
              </p>
            </Card>
          </div>
        </div>

        <div>
        <div id="fees" className="scroll-mt-24">
          <SectionHeading eyebrow="Fees" title="What we charge" />
        </div>
          <Card className="mt-6 divide-y divide-ink-100">
            {fees.map((fee) => (
              <div key={fee.label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6 sm:justify-between">
                <p className="text-sm font-medium text-ink-900">{fee.label}</p>
                <p className="text-sm text-ink-600 sm:text-right">{fee.value}</p>
              </div>
            ))}
          </Card>
          <p className="mt-4 text-xs text-ink-500">
            Total fees on a typical five-year hold work out to roughly 6 to 8% of capital invested.
            The worked example for{' '}
            <span className="font-medium text-ink-700">
              {projects[0].name} at {formatCurrency(12_000)}
            </span>{' '}
            would be about {formatCurrency(840)} across the life of the investment.
          </p>
        </div>
      </section>

      <section id="risk" className="mt-20 scroll-mt-24">
        <div className="rounded-2xl bg-ink-900 p-8 text-white ring-1 ring-ink-800 sm:p-10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-6 text-amber-400" />
            <h2 className="font-display text-3xl tracking-tight">What can go wrong</h2>
          </div>
          <p className="mt-3 max-w-2xl text-ink-200">
            Real estate crowdfunding is speculative and involves a real possibility of losing money.
            We would rather you read this list than discover these facts later.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {risks.map((risk) => (
              <li key={risk} className="flex gap-3 rounded-xl bg-white/5 p-4">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                <span className="text-sm leading-relaxed text-ink-100">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="sponsors" className="mt-20 scroll-mt-24">
        <SectionHeading
          eyebrow="Sponsors"
          title="The firms we invest alongside"
          description="Every sponsor is reviewed against the same checklist before an offering goes live: audited financials, completed deals, references, and a viable plan for the specific asset."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {sponsorStats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <p className="font-display text-2xl text-ink-950">{stat.value}</p>
              <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {Array.from(new Map(projects.map((p) => [p.sponsor.name, p.sponsor])).values()).map(
            (sponsor) => (
              <Card key={sponsor.name} className="p-6">
                <p className="font-display text-xl text-ink-950">{sponsor.name}</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Deals completed</dt>
                    <dd className="font-medium text-ink-900">{sponsor.trackRecordDeals}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Years active</dt>
                    <dd className="font-medium text-ink-900">{sponsor.trackRecordYears}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Realized net IRR</dt>
                    <dd className="font-medium text-ink-900">
                      {formatPercent(sponsor.realizedIrr)}
                    </dd>
                  </div>
                </dl>
              </Card>
            ),
          )}
        </div>
      </section>

      <section id="disclosures" className="mt-20 scroll-mt-24">
        <Card className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-brand-600" />
              <h2 className="font-display text-2xl text-ink-950">Offering documents</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Every project publishes a PPM, operating budget, rent roll, construction contract, and
              sponsor financial statements. Read them before investing. The documents list every
              material risk we have identified for that asset.
            </p>
          </div>
          <LinkButton to="/invest" className="shrink-0">
            Browse offerings
          </LinkButton>
        </Card>
      </section>
    </div>
  )
}
