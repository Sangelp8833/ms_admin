import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import AdminLayout from '@/components/layout/AdminLayout'
import { ToastProvider } from '@/components/shared/Toast'

import LoginPage        from '@/pages/LoginPage'
import DashboardPage    from '@/pages/DashboardPage'
import ProductsPage     from '@/pages/ProductsPage'
import ProductFormPage  from '@/pages/ProductFormPage'
import CategoriesPage   from '@/pages/CategoriesPage'
import OrdersPage       from '@/pages/OrdersPage'
import OrderDetailPage  from '@/pages/OrderDetailPage'
import OrderHistoryPage from '@/pages/OrderHistoryPage'
import StatsPage        from '@/pages/StatsPage'

// Redirige a /login si no hay token; si hay, renderiza AdminLayout (con Outlet)
function PrivateLayout() {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <AdminLayout />
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateLayout />}>
          <Route path="/dashboard"            element={<DashboardPage />} />
          <Route path="/productos"            element={<ProductsPage />} />
          <Route path="/productos/nuevo"      element={<ProductFormPage />} />
          <Route path="/productos/:id/editar" element={<ProductFormPage />} />
          <Route path="/categorias"           element={<CategoriesPage />} />
          <Route path="/ordenes"              element={<OrdersPage />} />
          <Route path="/ordenes/:id"          element={<OrderDetailPage />} />
          <Route path="/historial"            element={<OrderHistoryPage />} />
          <Route path="/historial/:id"        element={<OrderDetailPage />} />
          <Route path="/estadisticas"         element={<StatsPage />} />
          <Route path="/"                     element={<Navigate to="/dashboard" replace />} />
          <Route path="*"                     element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
