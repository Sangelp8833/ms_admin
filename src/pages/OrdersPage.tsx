import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'
import { Order, OrderStatus, PaginationMeta } from '@/types'
import OrderTable from '@/components/orders/OrderTable'
import Select from '@/components/shared/Select'
import Button from '@/components/shared/Button'
import Spinner from '@/components/shared/Spinner'
import { useToast } from '@/components/shared/Toast'

const STATUS_OPTS = [
  { value: '',          label: 'Todas las activas' },
  { value: 'received',  label: 'Recibidas' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'shipped',   label: 'En camino' },
]

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

export default function OrdersPage() {
  const toast = useToast()
  const [orders,  setOrders]  = useState<Order[]>([])
  const [meta,    setMeta]    = useState<PaginationMeta>({ total: 0, page: 1, perPage: 20 })
  const [loading, setLoading] = useState(true)
  const [status,  setStatus]  = useState('')
  const [page,    setPage]    = useState(1)

  const fetch = useCallback(async (s: string, p: number) => {
    setLoading(true)
    try {
      // activas = excluye delivered
      const statusParam = s || 'received,preparing,shipped'
      const { data } = await api.get(`/admin/orders?status=${statusParam}&page=${p}&per_page=20`)
      setOrders(data.data.map(mapOrder))
      setMeta({ total: data.meta.total, page: data.meta.page, perPage: data.meta.per_page })
    } catch {
      toast('Error al cargar órdenes', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch(status, page) }, [status, page])

  const totalPages = Math.ceil(meta.total / meta.perPage)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Select
          options={STATUS_OPTS}
          value={status}
          onValueChange={v => { setStatus(v); setPage(1) }}
          className="w-48"
        />
        <p className="text-sm text-text-secondary">{meta.total} órdenes</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>
      ) : (
        <OrderTable orders={orders} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
          <span className="text-sm text-text-secondary">{page} / {totalPages}</span>
          <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
        </div>
      )}
    </div>
  )
}
