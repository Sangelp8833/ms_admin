import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TopProduct } from '@/types'
import { formatCOP } from '@/lib/utils'
import Button from '@/components/shared/Button'

interface Props {
  data: TopProduct[]
}

export default function TopProductsChart({ data }: Props) {
  const [mode, setMode] = useState<'units' | 'revenue'>('units')

  const chartData = data.map(d => ({
    name:    d.name.length > 22 ? d.name.slice(0, 22) + '…' : d.name,
    units:   d.unitsSold,
    revenue: d.revenue,
  }))

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={mode === 'units' ? 'primary' : 'secondary'}
          onClick={() => setMode('units')}
        >
          Unidades
        </Button>
        <Button
          size="sm"
          variant={mode === 'revenue' ? 'primary' : 'secondary'}
          onClick={() => setMode('revenue')}
        >
          Revenue
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#30363D" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#7D8590', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={mode === 'revenue' ? v => `$${(v / 1000).toFixed(0)}k` : undefined}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: '#7D8590', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#E6EDF3' }}
            formatter={(value: number) => [
              mode === 'revenue' ? formatCOP(value) : `${value} uds`,
              mode === 'revenue' ? 'Revenue' : 'Unidades',
            ]}
          />
          <Bar dataKey={mode === 'units' ? 'units' : 'revenue'} fill="#C4522A" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
