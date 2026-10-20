import type { Lang, Order, Product, Totals } from '@/types'

const MONTHS: Record<Lang, string[]> = {
  ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  uk: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}

const WEEKDAYS: Record<Lang, string[]> = {
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  uk: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
}

const pad = (n: number) => String(n).padStart(2, '0')

export const parseDate = (str: string): Date => new Date(str.replace(' ', 'T'))

/** 06 / 04 */
export const shortDate = (str: string): string => {
  const d = parseDate(str)
  return `${pad(d.getDate())} / ${pad(d.getMonth() + 1)}`
}

/** 06 / Апр / 2017 */
export const longDate = (str: string, lang: Lang = 'ru'): string => {
  const d = parseDate(str)
  return `${pad(d.getDate())} / ${MONTHS[lang][d.getMonth()]} / ${d.getFullYear()}`
}

/** 06 / 04 / 2017 */
export const numericDate = (str: string): string => {
  const d = parseDate(str)
  return `${pad(d.getDate())} / ${pad(d.getMonth() + 1)} / ${d.getFullYear()}`
}

export const weekday = (d: Date, lang: Lang = 'ru'): string => WEEKDAYS[lang][d.getDay()]
export const topDate = (d: Date, lang: Lang = 'ru'): string =>
  `${pad(d.getDate())} ${MONTHS[lang][d.getMonth()]}, ${d.getFullYear()}`
export const clock = (d: Date): string => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

export const money = (n: number): string =>
  Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

export const sumPrices = (products: Product[]): Totals =>
  products.reduce<Totals>(
    (acc, p) => {
      p.price.forEach(({ symbol, value }) => {
        acc[symbol] = (acc[symbol] || 0) + value
      })
      return acc
    },
    { USD: 0, UAH: 0 }
  )

export const priceOf = (product: Product, symbol: 'USD' | 'UAH'): number =>
  product.price.find(p => p.symbol === symbol)?.value ?? 0

export const groupByOrder = (products: Product[]): Record<number, Product[]> => {
  const map: Record<number, Product[]> = {}
  products.forEach(p => (map[p.order] ||= []).push(p))
  return map
}

export const orderTotals = (orders: Order[], products: Product[]) => {
  const grouped = groupByOrder(products)
  return orders.map(order => ({ order, products: grouped[order.id] || [], totals: sumPrices(grouped[order.id] || []) }))
}
