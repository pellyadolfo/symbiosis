import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, LinkButton } from '../ui/Button'

const navLinks = [
  { to: '/invest', label: 'Invest' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/portfolio', label: 'Portfolio' },
]

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

export const Header = () => {
  const { investor, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const close = () => setOpen(false)

  const handleSignOut = () => {
    signOut()
    close()
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-ink-50/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" onClick={close} className="flex items-center gap-2.5">
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

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {investor ? (
            <>
              <Link
                to="/portfolio"
                className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 ring-1 ring-ink-200 transition hover:ring-ink-300 hover:bg-white"
              >
                <span className="font-display grid size-8 place-items-center rounded-full bg-brand-100 text-sm text-brand-800">
                  {initials(investor.name)}
                </span>
                <span className="text-sm font-medium text-ink-800">{investor.name.split(' ')[0]}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <LinkButton to="/login" variant="ghost" size="sm">
                Log in
              </LinkButton>
              <LinkButton to="/signup" size="sm">
                Open an account
              </LinkButton>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl text-ink-700 ring-1 ring-ink-200 transition hover:bg-white md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="animate-fade-in border-t border-ink-200 bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={close}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
              {investor ? (
                <>
                  <span className="px-3 text-sm text-ink-500">Signed in as {investor.email}</span>
                  <Button variant="secondary" fullWidth onClick={handleSignOut}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <LinkButton
                    to="/login"
                    variant="secondary"
                    fullWidth
                    onClick={close}
                    className={location.pathname === '/login' ? 'ring-2 ring-brand-400' : ''}
                  >
                    Log in
                  </LinkButton>
                  <LinkButton to="/signup" fullWidth onClick={close}>
                    Open an account
                  </LinkButton>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
