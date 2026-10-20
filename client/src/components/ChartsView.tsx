'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '@/store/hooks'
import { orderTotals } from '@/lib/format'

const COLORS = ['#82b844', '#4a90a4', '#e5a23a', '#8e6bbf', '#e5384f', '#5c6b77']

export default function ChartsView() {
  const { t } = useTranslation()
  const orders = useAppSelector(s => s.orders.items)
  const products = useAppSelector(s => s.products.items)

  const totalsData = useMemo(
    () =>
      orderTotals(orders, products).map(({ order, totals }) => ({
        name: order.title.length > 22 ? `${order.title.slice(0, 22)}…` : order.title,
        UAH: totals.UAH
      })),
    [orders, products]
  )

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(p => (counts[p.type] = (counts[p.type] || 0) + 1))
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [products])

  return (
    <div className="charts">
      <div className="charts__card">
        <h2 className="charts__title">{t('charts.ordersTotal')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="UAH" fill="#82b844" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="charts__card">
        <h2 className="charts__title">{t('charts.productsByType')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={100} label>
              {typeData.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
