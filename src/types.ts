export type ProjectStatus = 'funding' | 'fully-funded' | 'in-development' | 'exited'

export type AssetType = 'multifamily' | 'single-family' | 'retail' | 'industrial' | 'hospitality'

export type Strategy = 'core' | 'value-add' | 'development' | 'opportunistic'

export interface Money {
  amount: number
  currency: 'USD'
}

export interface Project {
  id: string
  slug: string
  name: string
  tagline: string
  address: {
    line1: string
    city: string
    state: string
    postalCode: string
  }
  assetType: AssetType
  strategy: Strategy
  status: ProjectStatus
  sponsor: {
    name: string
    trackRecordDeals: number
    trackRecordYears: number
    realizedIrr: number
  }
  propertyManager: string
  units: number
  squareFeet: number
  yearBuilt: number
  /** Total equity the raise is targeting, in USD. */
  targetRaise: number
  /** Equity already committed, in USD. */
  raised: number
  minimumInvestment: number
  /** Annualized distribution yield on current rent, e.g. 0.065 for 6.5%. */
  projectedYield: number
  /** Annualized growth in net operating income, e.g. 0.032 for 3.2%. */
  projectedAppreciation: number
  holdPeriodYears: number
  /** Distribution payment frequency. */
  distribution: 'monthly' | 'quarterly'
  expenseRatio: number
  featured: boolean
  riskLevel: 'low' | 'moderate' | 'elevated'
  summary: string
  highlights: string[]
  useOfFunds: { label: string; percent: number }[]
  gallery: { label: string; tone: string }[]
  timeline: { milestone: string; date: string; status: 'done' | 'active' | 'upcoming' }[]
}

export type HoldingStatus = 'active' | 'distributing' | 'exited'

export interface Holding {
  id: string
  projectId: string
  unitsBought: number
  investedAmount: number
  currentValue: number
  distributionsReceived: number
  /** Cumulative annual return since purchase, e.g. 0.081 for 8.1%. */
  totalReturn: number
  purchasedAt: string
  status: HoldingStatus
}

export interface ActivityEvent {
  id: string
  holdingId?: string
  projectId: string
  type: 'investment' | 'distribution' | 'milestone' | 'valuation' | 'exit'
  title: string
  detail: string
  amount?: number
  occurredAt: string
}

export interface InvestorProfile {
  id: string
  name: string
  email: string
  joinedAt: string
  accreditation: 'none' | 'pending' | 'verified'
}
