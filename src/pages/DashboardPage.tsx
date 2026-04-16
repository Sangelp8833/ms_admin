import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Package, Clock, Plus } from 'lucide-react'
import api from '@/lib/api'
import { DashboardStats, Order } from '@/types'
import MetricCard from '@/components/stats/MetricCard'
import { formatCOP, formatDate } from '@/lib/utils'
import Spinner from '@/components/shared/Spinner'
import Button from '@/components/shared/Button'
import { useToast } from '@/components/shared/Toast'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'

export default function DashboardPage() {
  const toast = useToast()
  const [stats,   setStats]   = useState<DashboardStats | null>(null)
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats/monthly'),
          api.get('/admin/orders?per_page=5'),
        ])
        const s = statsRes.data.data
        setStats({
          monthlySales:   s.monthly_sales,
          activeOrders:   s.active_orders,
          activeProducts: s.active_products,
          pendingOrders:  s.pending_orders,
        })
        setOrders(ordersRes.data.data.map(mapOrder))
      } catch {
        toast('Error al cargar el dashboard', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ventas del mes"
          value={stats ? formatCOP(stats.monthlySales) : '—'}
          icon={TrendingUp}
          color="accent"
        />
        <MetricCard
          label="Órdenes activas"
          value={stats?.activeOrders ?? '—'}
          icon={ShoppingBag}
          color="info"
        />
        <MetricCard
          label="Productos publicados"
          value={stats?.activeProducts ?? '—'}
          icon={Package}
          color="success"
        />
        <MetricCard
          label="Pendientes de gestión"
          value={stats?.pendingOrders ?? '—'}
          icon={Clock}
          color="warning"
        />
      </div>

      {/* Órdenes recientes + acción rápida */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Órdenes recientes</h2>
        <Link to="/productos/nuevo">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Código</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Cliente</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Total</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Estado</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                  No hay órdenes todavía
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-hover-row">
                  <td className="px-4 py-3">
                    <Link to={`/ordenes/${order.id}`} className="font-mono text-accent hover:underline">
                      {order.trackingCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{order.customerName || order.customerEmail}</td>
                  <td className="px-4 py-3 text-text-primary">{formatCOP(order.total)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function mapOrder(o: any): Order {
  return {
    id:            o.id,
    trackingCode:  o.tracking_code,
    status:        o.status,
    items:         (o.items ?? []).map((i: any) => ({
      productId: i.product_id,
      name:      i.name,
      price:     i.price,
      quantity:  i.quantity,
      imageUrl:  i.image_url,
    })),
    total:         o.total,
    address:       o.address,
    customerName:  o.customer_name ?? '',
    customerEmail: o.customer_email ?? '',
    createdAt:     o.created_at,
    updatedAt:     o.updated_at,
  }
}
