import { ArrowRight, Building2, CalendarClock, LineChart, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { PropertyVisual } from '../components/PropertyVisual'
import { LinkButton } from '../components/ui/Button'
import { Card, SectionHeading } from '../components/ui/Surface'
import { projects } from '../data/projects'
import { formatCompactCurrency, formatPercent } from '../lib/format'

const featured = projects.filter((project) => project.featured).slice(0, 3)

const steps = [
  {
    icon: Users,
    title: 'Open an account',
    body: 'Verify your identity and accreditation status in a few minutes. Accounts can be funded by bank transfer or ACH.',
  },
  {
    icon: Building2,
    title: 'Choose a project',
    body: 'Every offering publishes its rent roll, budget, sponsor track record, and use of funds before the raise opens.',
  },
  {
    icon: LineChart,
    title: 'Hold a share',
    body: 'Invest from the project minimum. You receive a statement showing your units, share of equity, and distributions to date.',
  },
  {
    icon: CalendarClock,
    title: 'Get paid monthly',
    body: 'Distributions arrive on the schedule in the offering memo, and you are notified at every valuation and milestone.',
  },
]

const stats = [
  { value: formatCompactCurrency(58_400_000), label: 'Equity raised to date' },
  { value: '41', label: 'Investments completed' },
  { value: formatPercent(0.176, 1), label: 'Realized net IRR, realized deals' },
  { value: '9,800+', label: 'Registered investors' },
]

export const LandingPage = () => (
  <>
    <section className="relative overflow-hidden border-b border-ink-200 bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-sand-100" />
      <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-brand-800 ring-1 ring-brand-200">
            <ShieldCheck className="size-3.5" />
            Reviewed offerings only
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
            Real estate, owned in part.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-600">
            Invest from $500 in professionally managed apartment, industrial, and hospitality
            assets. Reviewed sponsors, published budgets, and distributions on a schedule you can
            plan around.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/invest" size="lg">
              Browse open offerings
              <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton to="/how-it-works" variant="secondary" size="lg">
              How it works
            </LinkButton>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl tracking-tight text-ink-950">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink-500">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-up grid grid-cols-2 gap-4 [animation-delay:120ms]">
          {projects.slice(0, 4).map((project) => (
            <Link
              key={project.id}
              to={`/invest/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-lift ring-1 ring-ink-900/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <PropertyVisual tone={project.gallery[0].tone} className="h-44" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                <p className="font-display text-sm leading-tight text-white">{project.name}</p>
                <p className="mt-0.5 text-xs text-white/75">
                  {project.address.city}, {project.address.state}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="container-page py-20">
      <SectionHeading
        eyebrow="Featured offerings"
        title="Open for investment now"
        description="Each raise publishes a full offering memo, sponsor financials, and a construction or leasing schedule before it opens."
        action={
          <LinkButton to="/invest" variant="secondary">
            See all projects
            <ArrowRight className="size-4" />
          </LinkButton>
        }
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>

    <section className="border-y border-ink-200 bg-white py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="The process"
          title="Four steps from signup to income"
          description="No broker, no advisor commission, and no minimum beyond the project minimum."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full p-6">
                <div className="flex items-center gap-3">
                  <span className="font-display grid size-10 place-items-center rounded-xl bg-brand-800 text-white">
                    <step.icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-xl text-ink-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="container-page py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Why it works"
            title="We review the deal before you ever see it"
            description="Stonebridge underwrites every offering against its own checklist. Anything that does not clear review is not published."
          />
          <ul className="mt-8 space-y-4">
            {[
              {
                title: 'Sponsor verification',
                body: 'We review audited financials, prior deals, and reference calls with property managers before listing.',
              },
              {
                title: 'Independent valuation',
                body: 'Every purchase is supported by a third-party appraisal, and we re-mark it at least annually.',
              },
              {
                title: 'Distribution commitments',
                body: 'Distribution schedules are contractual. Missed payments trigger a review, and a full report to investors.',
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-ink-950">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-600">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Card className="overflow-hidden">
          <PropertyVisual tone="from-ink-900 via-brand-800 to-brand-500" className="h-64" />
          <div className="p-6">
            <h3 className="font-display text-2xl text-ink-950">Ready to look at real numbers?</h3>
            <p className="mt-2 text-sm text-ink-600">
              Open an account in under three minutes, or browse the open offerings first and decide
              later.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton to="/signup">Open an account</LinkButton>
              <LinkButton to="/invest" variant="secondary">
                Browse offerings
              </LinkButton>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </>
)
