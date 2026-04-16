import { Link } from 'react-router-dom'
import { Order } from '@/types'
import { formatCOP, formatDate } from '@/lib/utils'
import OrderStatusBadge from './OrderStatusBadge'
import Button from '@/components/shared/Button'

interface Props {
  orders: Order[]
  basePath?: string
}

export default function OrderTable({ orders, basePath = '/ordenes' }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 text-xs font-medium text-text-secondary">Código</th>
            <th className="px-4 py-3 text-xs font-medium text-text-secondary hidden md:table-cell">Cliente</th>
            <th className="px-4 py-3 text-xs font-medium text-text-secondary">Total</th>
            <th className="px-4 py-3 text-xs font-medium text-text-secondary">Estado</th>
            <th className="px-4 py-3 text-xs font-medium text-text-secondary hidden sm:table-cell">Fecha</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-text-secondary">
                No hay órdenes
              </td>
            </tr>
          ) : (
            orders.map(o => (
              <tr key={o.id} className="border-b border-border/50 hover:bg-hover-row">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-accent">{o.trackingCode}</span>
                </td>
                <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                  <div className="leading-tight">
                    <p>{o.customerName}</p>
                    <p className="text-xs opacity-70">{o.customerEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-primary">{formatCOP(o.total)}</td>
                <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`${basePath}/${o.id}`}>
                    <Button size="sm" variant="ghost">Ver</Button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
