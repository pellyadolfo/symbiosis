const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const preciseCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat('en-US')

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export const formatCurrency = (value: number): string => currencyFormatter.format(value)

export const formatPreciseCurrency = (value: number): string =>
  preciseCurrencyFormatter.format(value)

export const formatCompactCurrency = (value: number): string =>
  compactCurrencyFormatter.format(value)

export const formatNumber = (value: number): string => numberFormatter.format(value)

export const formatPercent = (value: number, fractionDigits = 1): string =>
  `${(value * 100).toFixed(fractionDigits)}%`

export const formatDate = (value: string): string => dateFormatter.format(new Date(value))

export const formatAddress = (address: {
  line1: string
  city: string
  state: string
}): string => `${address.line1}, ${address.city}, ${address.state}`

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)
