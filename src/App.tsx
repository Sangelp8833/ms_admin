import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Login Admin — TODO</div>} />
        <Route path="/dashboard" element={<div>Dashboard — TODO</div>} />
        <Route path="/productos" element={<div>Productos CRUD — TODO</div>} />
        <Route path="/ordenes" element={<div>Órdenes activas — TODO</div>} />
        <Route path="/historial" element={<div>Historial — TODO</div>} />
        <Route path="/estadisticas" element={<div>Estadísticas — TODO</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
