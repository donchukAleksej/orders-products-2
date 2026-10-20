import { describe, expect, it } from 'vitest'
import { groupByOrder, longDate, money, numericDate, priceOf, shortDate, sumPrices, topDate, weekday } from './format'
import type { Product } from '@/types'

const product = (id: number, order: number, usd: number, uah: number): Product => ({
  id,
  serialNumber: 1000 + id,
  isNew: 1,
  photo: '',
  title: `Product ${id}`,
  type: 'Monitors',
  specification: '',
  status: 'free',
  guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
  price: [
    { value: usd, symbol: 'USD', isDefault: 0 },
    { value: uah, symbol: 'UAH', isDefault: 1 }
  ],
  order,
  date: '2017-06-29 12:09:33'
})

describe('date formatting', () => {
  const date = '2017-04-06 12:09:33'

  it('formats the short numeric date', () => {
    expect(shortDate(date)).toBe('06 / 04')
  })

  it('formats the numeric date', () => {
    expect(numericDate(date)).toBe('06 / 04 / 2017')
  })

  it('formats the long date in every language', () => {
    expect(longDate(date, 'ru')).toBe('06 / Апр / 2017')
    expect(longDate(date, 'uk')).toBe('06 / Кві / 2017')
    expect(longDate(date, 'en')).toBe('06 / Apr / 2017')
  })

  it('formats the top menu date and weekday', () => {
    const d = new Date(2017, 3, 6)
    expect(topDate(d, 'en')).toBe('06 Apr, 2017')
    expect(weekday(d, 'en')).toBe('Thursday')
    expect(weekday(d, 'ru')).toBe('Четверг')
  })
})

describe('prices', () => {
  const products = [product(1, 1, 100, 2600), product(2, 1, 50, 1300), product(3, 2, 10, 260)]

  it('sums prices in both currencies', () => {
    expect(sumPrices(products.slice(0, 2))).toEqual({ USD: 150, UAH: 3900 })
  })

  it('returns zeros for an empty list', () => {
    expect(sumPrices([])).toEqual({ USD: 0, UAH: 0 })
  })

  it('reads a price by currency', () => {
    expect(priceOf(products[0], 'USD')).toBe(100)
    expect(priceOf(products[0], 'UAH')).toBe(2600)
  })

  it('groups products by order', () => {
    const grouped = groupByOrder(products)
    expect(grouped[1]).toHaveLength(2)
    expect(grouped[2]).toHaveLength(1)
  })

  it('formats money with thousand separators', () => {
    expect(money(2500).replace(/\s/g, ' ')).toBe('2 500')
    expect(money(250000.5).replace(/\s/g, ' ')).toBe('250 000,5')
  })
})
