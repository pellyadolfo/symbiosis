import { Link } from 'react-router-dom'

const columns = [
  {
    heading: 'Invest',
    links: [
      { label: 'Open offerings', to: '/invest' },
      { label: 'Featured projects', to: '/invest?filter=featured' },
      { label: 'Your portfolio', to: '/portfolio' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Risk and returns', to: '/how-it-works#risk' },
      { label: 'Fees', to: '/how-it-works#fees' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Our sponsors', to: '/how-it-works#sponsors' },
      { label: 'About', to: '/' },
      { label: 'Disclosures', to: '/how-it-works#disclosures' },
    ],
  },
]

export const Footer = () => (
  <footer className="mt-20 border-t border-ink-200 bg-white">
    <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_2fr]">
      <div>
        <Link to="/" className="flex items-center gap-2.5">
          <span className="font-display grid size-9 place-items-center rounded-xl bg-brand-800 text-base text-white">
            S
          </span>
          <span className="leading-tight">
            <span className="font-display block text-lg text-ink-950">Stonebridge</span>
            <span className="block text-[0.65rem] font-medium tracking-[0.18em] text-ink-500 uppercase">
              Capital
            </span>
          </span>
        </Link>
        <p className="mt-4 max-w-sm text-sm text-ink-600">
          Fractional ownership in professionally managed real estate. Reviewed offerings, clear
          financials, and monthly distributions.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        {columns.map((column) => (
          <div key={column.heading}>
            <h3 className="text-sm font-semibold text-ink-900">{column.heading}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-600 transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-ink-200">
      <div className="container-page flex flex-col gap-3 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Stonebridge Capital Management, LLC. All rights reserved.</p>
        <p className="max-w-xl sm:text-right">
          Demo interface. Not an offer to sell or a solicitation to buy securities. All figures are
          illustrative.
        </p>
      </div>
    </div>
  </footer>
)
