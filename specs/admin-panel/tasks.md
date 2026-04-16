# Tareas: Admin Panel — Panel de Administración

**Fecha**: 2026-04-15
**Spec Funcional**: spec-funcional.md
**Spec Técnica**: spec-tecnica.md

## Resumen

- **Total tareas**: 12
- **Progreso**: 0/12 completadas

---

## Tareas

### T1. Infraestructura base: tipos, API client y shared components
**Capa**: infraestructura
**Tamaño**: M
**Depende de**: Ninguna

**Qué hacer:**
- [ ] Crear `src/types/index.ts` con todos los tipos: `Product`, `Order`, `OrderStatus`, `Category`, `SponsorInfo`, `DashboardStats`, `SalesByMonth`, `TopProduct`
- [ ] Crear `src/lib/api.ts` con instancia Axios, interceptor de token y interceptor 401/403 → redirect a login
- [ ] Crear `src/components/shared/Button.tsx` variantes: `primary`, `secondary`, `danger`, `ghost`
- [ ] Crear `src/components/shared/Input.tsx` con label + mensaje de error
- [ ] Crear `src/components/shared/Select.tsx` wrapper de Radix Select
- [ ] Crear `src/components/shared/Badge.tsx` con variantes por color (success, warning, danger, neutral)
- [ ] Crear `src/components/shared/Spinner.tsx`
- [ ] Crear `src/components/shared/ConfirmDialog.tsx` con Radix Dialog: título, descripción, "Confirmar" (danger) / "Cancelar"

**Archivos involucrados:**
- `src/types/index.ts`, `src/lib/api.ts`, `src/components/shared/*`

**Criterio de completado:** Todos los shared components renderizan en aislamiento; tipos compilan sin error.

---

### T2. Auth store y Login page
**Capa**: auth
**Tamaño**: M
**Depende de**: T1

**Qué hacer:**
- [ ] Completar `src/store/authStore.ts`: `token`, `adminId`, `email` desde localStorage; `setAuth()` + `clearAuth()`
- [ ] Crear `src/pages/LoginPage.tsx`:
  - Formulario: email + contraseña
  - POST `/api/auth/admin/login` → en éxito: `authStore.setAuth()` + redirect a `/dashboard`
  - Error 401: "Credenciales incorrectas"; Error 403: "No tienes permisos de administrador"
  - Diseño centrado con el branding oscuro del admin

**Archivos involucrados:**
- `src/store/authStore.ts`, `src/pages/LoginPage.tsx`

**Criterio de completado:** Login con credenciales admin válidas redirige a dashboard; errores 401/403 muestran mensajes claros.

---

### T3. Layout admin: Sidebar, TopBar y AdminLayout
**Capa**: layout
**Tamaño**: M
**Depende de**: T2

**Qué hacer:**
- [ ] Crear `src/components/layout/Sidebar.tsx`:
  - Links: Dashboard, Productos, Órdenes, Historial, Estadísticas
  - Logo "Los Libros de Ivonnet — Admin" en la parte superior
  - Link activo resaltado con `accent`
  - En tablet: colapsable a drawer con ícono hamburger
- [ ] Crear `src/components/layout/TopBar.tsx`:
  - Título de la sección actual
  - Email del admin logueado + botón "Cerrar sesión" (llama `clearAuth()` + redirect a `/login`)
- [ ] Crear `src/components/layout/AdminLayout.tsx`: `Sidebar` + `TopBar` + `<main>{children}</main>`
- [ ] Crear `PrivateRoute` en `App.tsx` que envuelve el layout
- [ ] Actualizar `App.tsx` con rutas reales usando `PrivateRoute`

**Archivos involucrados:**
- `src/components/layout/*.tsx`, `src/App.tsx`

**Criterio de completado:** Todas las rutas protegidas redirigen a `/login` si no hay token; sidebar muestra la ruta activa correctamente.

---

### T4. Dashboard page
**Capa**: páginas
**Tamaño**: M
**Depende de**: T3

**Qué hacer:**
- [ ] Crear `src/components/stats/MetricCard.tsx`: tarjeta con ícono, label, valor numérico grande, variante de color
- [ ] Crear `src/pages/DashboardPage.tsx`:
  - GET `/api/admin/stats/monthly` al montar
  - 4 `MetricCard`: "Ventas del mes" (dinero), "Órdenes activas", "Productos publicados", "Pendientes de actualizar"
  - Sección "Órdenes recientes" con mini-tabla de las últimas 5 órdenes (link a `/ordenes/:id`)
  - Botón "Crear nuevo producto" (link a `/productos/nuevo`)

**Archivos involucrados:**
- `src/components/stats/MetricCard.tsx`, `src/pages/DashboardPage.tsx`

**Criterio de completado:** Las 4 métricas cargan desde la API y muestran valores formateados (dinero en COP).

---

### T5. Gestión de categorías
**Capa**: páginas
**Tamaño**: S
**Depende de**: T3

**Qué hacer:**
- [ ] Crear una sección de categorías (puede ser un tab dentro de ProductsPage o página propia `/categorias`):
  - Lista de categorías existentes
  - Formulario inline para crear: nombre + slug (auto-generado desde nombre)
  - Botón editar → actualiza inline
  - Botón eliminar → `ConfirmDialog` → DELETE; si 422 mostrar "Esta categoría tiene productos asociados"

**Archivos involucrados:**
- Nueva sección en `src/pages/ProductsPage.tsx` o `src/pages/CategoriesPage.tsx`

**Criterio de completado:** CRUD de categorías funcional; errores de eliminación con productos asociados manejados.

---

### T6. CRUD de productos — Lista y formulario
**Capa**: páginas
**Tamaño**: L
**Depende de**: T5

**Qué hacer:**
- [ ] Crear `src/components/products/ProductTable.tsx`:
  - Columnas: imagen miniatura, nombre, categoría, precio, tipo (badge), estado (activo/eliminado)
  - Filas de productos eliminados con `opacity-50` + etiqueta "Eliminado"
  - Acciones: "Editar" (link a `/productos/:id/editar`), "Eliminar" (abre ConfirmDialog)
- [ ] Crear `src/components/products/ImageUploader.tsx`:
  - Input `multiple` para subir imágenes
  - Preview de imágenes seleccionadas (URL.createObjectURL)
  - Botón para quitar una imagen de la selección
  - Para productos existentes: muestra imágenes actuales + permite agregar nuevas o quitar existentes
- [ ] Crear `src/components/products/ProductForm.tsx`:
  - Campos: nombre, descripción, precio, categoría (Select), tipo (standard/sponsored), en stock (toggle)
  - Si tipo = `sponsored`: campos adicionales: nombre patrocinador, logo URL, tagline
  - `ImageUploader` integrado
  - Submit envía `FormData` (multipart) al backend
- [ ] Crear `src/pages/ProductsPage.tsx`: GET productos paginados + `ProductTable` + botón "Nuevo producto"
- [ ] Crear `src/pages/ProductFormPage.tsx`:
  - Si ruta es `/productos/nuevo` → POST `/api/admin/products`
  - Si ruta es `/productos/:id/editar` → GET producto + PUT `/api/admin/products/:id`
  - Usa `ProductForm`

**Archivos involucrados:**
- `src/components/products/*.tsx`, `src/pages/ProductsPage.tsx`, `src/pages/ProductFormPage.tsx`

**Criterio de completado:** Crear, editar y eliminar producto funciona end-to-end; imágenes se suben correctamente; productos eliminados visualmente diferenciados.

---

### T7. Gestión de órdenes activas
**Capa**: páginas
**Tamaño**: M
**Depende de**: T3

**Qué hacer:**
- [ ] Crear `src/components/orders/OrderStatusBadge.tsx`:
  - `received` → badge gris "Recibida"
  - `preparing` → badge amarillo "Preparando"
  - `shipped` → badge azul "En camino"
  - `delivered` → badge verde "Entregada"
- [ ] Crear `src/components/orders/OrderStatusStepper.tsx`:
  - Botón "Avanzar a: [siguiente estado]"
  - Deshabilitado si ya está en `delivered`
  - Llama PUT `/api/admin/orders/:id/status`
  - Actualización optimista: actualiza la UI inmediatamente, revierte en error
- [ ] Crear `src/components/orders/OrderTable.tsx`: tabla con columnas: código, cliente, fecha, total, estado, acción "Ver detalle"
- [ ] Crear `src/pages/OrdersPage.tsx`:
  - GET `/api/admin/orders?status=received,preparing,shipped` (excluir `delivered`)
  - Tabs o filtro por estado
  - `OrderTable` paginada
- [ ] Crear `src/pages/OrderDetailPage.tsx`:
  - GET `/api/admin/orders/:id` al montar
  - Muestra: items del pedido, dirección, datos del cliente, estado actual
  - `OrderStatusStepper` para avanzar estado

**Archivos involucrados:**
- `src/components/orders/*.tsx`, `src/pages/OrdersPage.tsx`, `src/pages/OrderDetailPage.tsx`

**Criterio de completado:** Avanzar estado de una orden actualiza la UI inmediatamente y persiste en backend; badge de estado colorea correctamente.

---

### T8. Historial de órdenes
**Capa**: páginas
**Tamaño**: M
**Depende de**: T7

**Qué hacer:**
- [ ] Crear `src/pages/OrderHistoryPage.tsx`:
  - GET `/api/admin/orders` con todos los estados (activas + entregadas)
  - Filtros:
    - Select de estado: Todas / Recibida / Preparando / En camino / Entregada
    - Date pickers para rango `from` y `to`
    - Input de búsqueda por código de tracking o email
  - `OrderTable` con paginación server-side
  - Link a detalle de cada orden

**Archivos involucrados:**
- `src/pages/OrderHistoryPage.tsx`

**Criterio de completado:** Filtros funcionan y actualizan la tabla; búsqueda por código encuentra órdenes correctamente.

---

### T9. Panel de estadísticas
**Capa**: páginas
**Tamaño**: M
**Depende de**: T4

**Qué hacer:**
- [ ] Crear `src/components/stats/SalesChart.tsx`:
  - Recharts `BarChart` con ventas mensuales
  - Eje X: mes (`ene`, `feb`, ...), Eje Y: monto en COP
  - Tooltip con monto formateado + cantidad de órdenes
- [ ] Crear `src/components/stats/TopProductsChart.tsx`:
  - Recharts `BarChart` horizontal con top 10 productos
  - Muestra unidades vendidas o revenue (toggle)
  - Productos soft-deleted marcados con `(eliminado)` en el nombre pero incluidos en el gráfico
- [ ] Crear `src/pages/StatsPage.tsx`:
  - Date range picker para filtrar período
  - `SalesChart` con datos de GET `/api/admin/stats/sales`
  - Métricas de comparación: mes actual vs mes anterior (% de cambio)
  - `TopProductsChart` con datos de GET `/api/admin/stats/products`
  - Todos los charts usan el color `accent` (#C4522A) como color principal

**Archivos involucrados:**
- `src/components/stats/SalesChart.tsx`, `src/components/stats/TopProductsChart.tsx`, `src/pages/StatsPage.tsx`

**Criterio de completado:** Gráficas cargan con datos reales; el toggle revenue/unidades en top productos funciona; productos eliminados aparecen en el histórico.

---

### T10. Ensamblar App.tsx con rutas reales
**Capa**: routing
**Tamaño**: S
**Depende de**: T2, T3, T4, T5, T6, T7, T8, T9

**Qué hacer:**
- [ ] Actualizar `src/App.tsx`:
  - Ruta `/login` → `LoginPage` (pública)
  - Todas las demás rutas → `PrivateRoute` con `AdminLayout`
  - `/dashboard`, `/productos`, `/productos/nuevo`, `/productos/:id/editar`
  - `/ordenes`, `/ordenes/:id`
  - `/historial`
  - `/estadisticas`
  - `/` → redirect a `/dashboard`
  - `*` → redirect a `/dashboard`

**Archivos involucrados:**
- `src/App.tsx`

**Criterio de completado:** Navegación entre todas las secciones funciona sin error; redirect a login si no autenticado.

---

### T11. Formateo y UX detalles
**Capa**: UI
**Tamaño**: S
**Depende de**: T10

**Qué hacer:**
- [ ] Crear helper `formatCOP(amount: number): string` → `$1.250.000` en `src/lib/utils.ts`
- [ ] Crear helper `formatDate(iso: string): string` → `15 abr 2026` (locale `es-CO`)
- [ ] Asegurar que todos los precios en tablas y formularios usan `formatCOP`
- [ ] Asegurar que todas las fechas usan `formatDate`
- [ ] Verificar que el estado vacío de tablas (sin productos, sin órdenes) muestra un mensaje útil
- [ ] Toast de confirmación tras acciones (crear producto, cambiar estado de orden, etc.) usando Radix Toast

**Archivos involucrados:**
- `src/lib/utils.ts`, múltiples componentes

**Criterio de completado:** Todos los montos aparecen en formato COP; fechas en español; acciones importantes muestran feedback toast.

---

### T12. QA y responsive tablet
**Capa**: QA
**Tamaño**: M
**Depende de**: T11

**Qué hacer:**
- [ ] Verificar que en tablet (768px) el sidebar colapsa correctamente
- [ ] Probar flujo completo: login → crear producto → ver órdenes → avanzar estado → ver estadísticas
- [ ] Verificar que soft-delete no aparece en la tienda pública (coordinado con ms_backend)
- [ ] Verificar que un token de usuario regular (no admin) es rechazado con mensaje claro
- [ ] Verificar que subida de imágenes funciona con archivos reales

**Archivos involucrados:**
- Múltiples

**Criterio de completado:** Flujo completo end-to-end funcional; restricción de rol admin validada.

---

## Orden Sugerido de Implementación

1. **T1** — Infraestructura base (sin dependencias)
2. **T2** — Auth store + Login
3. **T3** — Layout (Sidebar + TopBar + AdminLayout)
4. **T4** — Dashboard (primera pantalla tras login)
5. **T5** — Categorías (necesarias para formulario de producto)
6. **T6** — CRUD Productos (core del negocio)
7. **T7** — Órdenes activas
8. **T8** — Historial de órdenes
9. **T9** — Estadísticas
10. **T10** — Ensamblar App.tsx
11. **T11** — Formateo y UX detalles
12. **T12** — QA y responsive

## Notas

- El panel admin no necesita ser mobile-friendly para el MVP; desktop y tablet son suficientes.
- Las imágenes de productos en el MVP pueden ser URLs externas (no es obligatorio implementar storage S3 desde el inicio; el backend puede guardar la URL directamente si se pasa como string).
- Las estadísticas pueden usar datos simulados mientras el backend implementa los endpoints de stats.
