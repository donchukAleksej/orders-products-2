export type Lang = 'ru' | 'uk' | 'en'
export type Currency = 'USD' | 'UAH'

export interface Price {
  value: number
  symbol: Currency
  isDefault: 0 | 1
}

export interface Product {
  id: number
  serialNumber: number
  isNew: 0 | 1
  photo: string
  title: string
  type: string
  specification: string
  status: 'free' | 'repair'
  guarantee: { start: string; end: string }
  price: Price[]
  order: number
  date: string
}

export interface Order {
  id: number
  title: string
  date: string
  description: string
  location?: { city: string; lat: number; lng: number }
}

export type Totals = Record<Currency, number>
