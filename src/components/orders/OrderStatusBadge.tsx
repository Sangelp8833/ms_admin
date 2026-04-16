import { OrderStatus } from '@/types'
import Badge from '@/components/shared/Badge'

const config: Record<OrderStatus, { label: string; variant: 'neutral' | 'warning' | 'info' | 'success' }> = {
  received:  { label: 'Recibida',    variant: 'neutral'  },
  preparing: { label: 'Preparando',  variant: 'warning'  },
  shipped:   { label: 'En camino',   variant: 'info'     },
  delivered: { label: 'Entregada',   variant: 'success'  },
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = config[status] ?? { label: status, variant: 'neutral' }
  return <Badge variant={variant}>{label}</Badge>
}
