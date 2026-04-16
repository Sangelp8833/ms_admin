import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const titles: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/productos':    'Productos',
  '/categorias':   'Categorías',
  '/ordenes':      'Órdenes activas',
  '/historial':    'Historial de órdenes',
  '/estadisticas': 'Estadísticas',
}

interface Props {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: Props) {
  const navigate   = useNavigate()
  const { pathname } = useLocation()
  const { email, clearAuth } = useAuthStore()

  const title = Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Admin'

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1.5 text-text-secondary hover:text-text-primary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-text-secondary sm:block">{email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-text-secondary hover:bg-hover-row hover:text-danger transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
