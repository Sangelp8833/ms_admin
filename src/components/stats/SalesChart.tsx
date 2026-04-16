import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SalesByMonth } from '@/types'
import { formatCOP } from '@/lib/utils'

const MONTH_LABELS: Record<string, string> = {
  '01': 'ene', '02': 'feb', '03': 'mar', '04': 'abr',
  '05': 'may', '06': 'jun', '07': 'jul', '08': 'ago',
  '09': 'sep', '10': 'oct', '11': 'nov', '12': 'dic',
}

function shortMonth(month: string) {
  const [, m] = month.split('-')
  return MONTH_LABELS[m] ?? month
}

interface Props {
  data: SalesByMonth[]
}

export default function SalesChart({ data }: Props) {
  const chartData = data.map(d => ({
    month:      shortMonth(d.month),
    total:      d.totalAmount,
    orders:     d.orderCount,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
        <XAxis dataKey="month" tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: '#7D8590', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          width={52}
        />
        <Tooltip
          contentStyle={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#E6EDF3' }}
          formatter={(value: number, name: string) => [
            name === 'total' ? formatCOP(value) : value,
            name === 'total' ? 'Ventas' : 'Órdenes',
          ]}
        />
        <Bar dataKey="total" fill="#C4522A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
