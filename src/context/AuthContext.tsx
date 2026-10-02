import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { demoInvestor } from '../data/investor'
import type { InvestorProfile } from '../types'

const STORAGE_KEY = 'stonebridge.session'

export interface SignUpInput {
  name: string
  email: string
  password: string
}

interface AuthContextValue {
  investor: InvestorProfile | null
  isReady: boolean
  signIn: (email: string, password: string) => Promise<InvestorProfile>
  signUp: (input: SignUpInput) => Promise<InvestorProfile>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const readStoredSession = (): InvestorProfile | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as InvestorProfile
    return typeof parsed?.id === 'string' && typeof parsed?.email === 'string' ? parsed : null
  } catch {
    return null
  }
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [investor, setInvestor] = useState<InvestorProfile | null>(readStoredSession)
  const isReady = true

  const persist = useCallback((profile: InvestorProfile) => {
    setInvestor(profile)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      await wait(550)

      if (!isEmail(email)) throw new Error('Enter a valid email address.')
      if (password.length < 6) throw new Error('Your password must be at least 6 characters.')

      const profile: InvestorProfile = {
        ...demoInvestor,
        email: email.trim().toLowerCase(),
      }
      persist(profile)
      return profile
    },
    [persist],
  )

  const signUp = useCallback(
    async ({ name, email, password }: SignUpInput) => {
      await wait(650)

      if (name.trim().length < 2) throw new Error('Enter your full name.')
      if (!isEmail(email)) throw new Error('Enter a valid email address.')
      if (password.length < 8) throw new Error('Choose a password of at least 8 characters.')

      const profile: InvestorProfile = {
        id: `inv_${Date.now().toString(36)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        joinedAt: new Date().toISOString().slice(0, 10),
        accreditation: 'none',
      }
      persist(profile)
      return profile
    },
    [persist],
  )

  const signOut = useCallback(() => {
    setInvestor(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ investor, isReady, signIn, signUp, signOut }),
    [investor, isReady, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}
