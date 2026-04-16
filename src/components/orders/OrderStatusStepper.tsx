import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { OrderStatus } from '@/types'
import api from '@/lib/api'
import Button from '@/components/shared/Button'
import { useToast } from '@/components/shared/Toast'

const NEXT: Record<OrderStatus, OrderStatus | null> = {
  received:  'preparing',
  preparing: 'shipped',
  shipped:   'delivered',
  delivered: null,
}

const LABELS: Record<OrderStatus, string> = {
  received:  'Recibida',
  preparing: 'Preparando',
  shipped:   'En camino',
  delivered: 'Entregada',
}

interface Props {
  orderId: string
  status: OrderStatus
  onStatusChange: (newStatus: OrderStatus) => void
}

export default function OrderStatusStepper({ orderId, status, onStatusChange }: Props) {
  const toast    = useToast()
  const [loading, setLoading] = useState(false)
  const next = NEXT[status]

  if (!next) {
    return <p className="text-sm text-success">Orden entregada ✓</p>
  }

  async function handleAdvance() {
    setLoading(true)
    const prev = status
    onStatusChange(next!) // optimistic
    try {
      const { data } = await api.put(`/admin/orders/${orderId}/status`, { status: next })
      onStatusChange(data.order.status)
      toast(`Estado actualizado: ${LABELS[next!]}`, 'success')
    } catch (err: any) {
      onStatusChange(prev) // revert
      toast(err.response?.data?.error ?? 'Error al actualizar estado', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAdvance} loading={loading} size="sm">
      <ArrowRight className="h-3.5 w-3.5" />
      Avanzar a: {LABELS[next]}
    </Button>
  )
}
