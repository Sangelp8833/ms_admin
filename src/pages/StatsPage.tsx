import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'
import { SalesByMonth, TopProduct } from '@/types'
import SalesChart from '@/components/stats/SalesChart'
import TopProductsChart from '@/components/stats/TopProductsChart'
import { formatCOP } from '@/lib/utils'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import Spinner from '@/components/shared/Spinner'
import { useToast } from '@/components/shared/Toast'

function defaultFrom() {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  return d.toISOString().split('T')[0]
}

function defaultTo() {
  return new Date().toISOString().split('T')[0]
}

export default function StatsPage() {
  const toast = useToast()
  const [from, setFrom] = useState(defaultFrom())
  const [to,   setTo]   = useState(defaultTo())

  const [sales,    setSales]    = useState<SalesByMonth[]>([])
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading,  setLoading]  = useState(true)

  const fetchStats = useCallback(async (f: string, t: string) => {
    setLoading(true)
    try {
      const [salesRes, productsRes] = await Promise.all([
        api.get(`/admin/stats/sales?from=${f}&to=${t}`),
        api.get(`/admin/stats/products?from=${f}&to=${t}&limit=10`),
      ])
      setSales(salesRes.data.data.map((d: any) => ({
        month:       d.month,
        totalAmount: d.total_amount,
        orderCount:  d.order_count,
      })))
      setProducts(productsRes.data.data.map((d: any) => ({
        productId: d.product_id,
        name:      d.name,
        unitsSold: d.units_sold,
        revenue:   d.revenue,
      })))
    } catch {
      toast('Error al cargar estadísticas', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats(from, to) }, [])

  const totalSales   = sales.reduce((acc, d) => acc + d.totalAmount, 0)
  const totalOrders  = sales.reduce((acc, d) => acc + d.orderCount,  0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filtro de fechas */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4">
        <Input label="Desde" type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-40" />
        <Input label="Hasta" type="date" value={to}   onChange={e => setTo(e.target.value)}   className="w-40" />
        <Button onClick={() => fetchStats(from, to)} variant="secondary">
          Aplicar
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs text-text-secondary uppercase tracking-wide">Ventas en el período</p>
              <p className="mt-2 text-2xl font-bold text-accent">{formatCOP(totalSales)}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs text-text-secondary uppercase tracking-wide">Órdenes en el período</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">{totalOrders}</p>
            </div>
          </div>

          {/* Gráfica ventas */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold text-text-primary">Ventas por mes</h2>
            {sales.length === 0 ? (
              <p className="py-10 text-center text-text-secondary">Sin datos para este período</p>
            ) : (
              <SalesChart data={sales} />
            )}
          </div>

          {/* Top productos */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold text-text-primary">Top 10 productos</h2>
            {products.length === 0 ? (
              <p className="py-10 text-center text-text-secondary">Sin datos para este período</p>
            ) : (
              <TopProductsChart data={products} />
            )}
          </div>
        </>
      )}
    </div>
  )
}
