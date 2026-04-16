import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '@/lib/api'
import { Order, OrderStatus } from '@/types'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import OrderStatusStepper from '@/components/orders/OrderStatusStepper'
import { formatCOP, formatDate } from '@/lib/utils'
import Spinner from '@/components/shared/Spinner'
import { useToast } from '@/components/shared/Toast'

function mapOrder(o: any): Order {
  return {
    id:            o.id,
    trackingCode:  o.tracking_code,
    status:        o.status,
    items:         (o.items ?? []).map((i: any) => ({ productId: i.product_id, name: i.name, price: i.price, quantity: i.quantity, imageUrl: i.image_url })),
    total:         o.total,
    address:       o.address ?? '',
    customerName:  o.customer_name ?? '',
    customerEmail: o.customer_email ?? '',
    createdAt:     o.created_at,
    updatedAt:     o.updated_at,
  }
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const toast  = useToast()
  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/admin/orders?per_page=200`).then(({ data }) => {
      const found = data.data.find((o: any) => o.id === id)
      if (found) setOrder(mapOrder(found))
    }).catch(() => toast('Error al cargar la orden', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>
  if (!order)  return <p className="text-text-secondary">Orden no encontrada</p>

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <Link to="/ordenes" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" /> Volver a órdenes
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-lg font-bold text-accent">{order.trackingCode}</p>
            <p className="text-xs text-text-secondary">{formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="pt-2">
          <OrderStatusStepper
            orderId={order.id}
            status={order.status}
            onStatusChange={s => setOrder(prev => prev ? { ...prev, status: s as OrderStatus } : prev)}
          />
        </div>
      </div>

      {/* Cliente */}
      <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">Cliente</h3>
        <p className="text-sm text-text-secondary">{order.customerName}</p>
        <p className="text-sm text-text-secondary">{order.customerEmail}</p>
        <p className="text-sm text-text-secondary">{order.address}</p>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">Productos</h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    )}
                    <span className="text-text-primary">{item.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-text-secondary text-center">× {item.quantity}</td>
                <td className="px-5 py-3 text-right text-text-primary">{formatCOP(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td colSpan={2} className="px-5 py-3 text-sm font-semibold text-text-primary">Total</td>
              <td className="px-5 py-3 text-right text-sm font-bold text-accent">{formatCOP(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
