import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import api from '@/lib/api'
import { Order, PaginationMeta } from '@/types'
import OrderTable from '@/components/orders/OrderTable'
import Select from '@/components/shared/Select'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import Spinner from '@/components/shared/Spinner'
import { useToast } from '@/components/shared/Toast'

const STATUS_OPTS = [
  { value: '',          label: 'Todos los estados' },
  { value: 'received',  label: 'Recibida' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'shipped',   label: 'En camino' },
  { value: 'delivered', label: 'Entregada' },
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

export default function OrderHistoryPage() {
  const toast = useToast()
  const [orders,  setOrders]  = useState<Order[]>([])
  const [meta,    setMeta]    = useState<PaginationMeta>({ total: 0, page: 1, perPage: 20 })
  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState('')
  const [from,   setFrom]   = useState('')
  const [to,     setTo]     = useState('')
  const [query,  setQuery]  = useState('')
  const [page,   setPage]   = useState(1)

  const fetch = useCallback(async (s: string, f: string, t: string, q: string, p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(p))
      params.set('per_page', '20')
      if (s) params.set('status', s)
      if (f) params.set('from', f)
      if (t) params.set('to', t)
      if (q) params.set('q', q)

      const { data } = await api.get(`/admin/orders?${params.toString()}`)
      setOrders(data.data.map(mapOrder))
      setMeta({ total: data.meta.total, page: data.meta.page, perPage: data.meta.per_page })
    } catch {
      toast('Error al cargar historial', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch(status, from, to, query, page) }, [status, from, to, page])

  function handleSearch() { fetch(status, from, to, query, 1); setPage(1) }

  const totalPages = Math.ceil(meta.total / meta.perPage)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4">
        <Select
          label="Estado"
          options={STATUS_OPTS}
          value={status}
          onValueChange={v => { setStatus(v); setPage(1) }}
          className="w-44"
        />
        <Input
          label="Desde"
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="w-40"
        />
        <Input
          label="Hasta"
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          className="w-40"
        />
        <div className="flex flex-1 items-end gap-2">
          <Input
            label="Buscar"
            placeholder="Código o email..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button size="md" variant="secondary" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-text-secondary">{meta.total} órdenes</p>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>
      ) : (
        <OrderTable orders={orders} basePath="/historial" />
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
