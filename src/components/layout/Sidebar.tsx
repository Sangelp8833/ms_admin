import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, History, BarChart2, BookOpen, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/productos',   label: 'Productos',    icon: Package },
  { to: '/ordenes',     label: 'Órdenes',      icon: ShoppingBag },
  { to: '/historial',   label: 'Historial',    icon: History },
  { to: '/estadisticas',label: 'Estadísticas', icon: BarChart2 },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-surface',
          'transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0',
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-text-primary leading-tight">
              LLI Admin
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-secondary hover:text-text-primary md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-text-secondary hover:bg-hover-row hover:text-text-primary',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
