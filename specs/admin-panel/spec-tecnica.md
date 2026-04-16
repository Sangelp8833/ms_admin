# Especificacion Técnica: Admin Panel — Panel de Administración

**Fecha**: 2026-04-15
**Estado**: Aprobada
**Base**: spec-funcional.md

---

## Stack

- **Framework**: React 18 + Vite 5 + TypeScript 5.3
- **Estilos**: Tailwind CSS 3.4 (tema oscuro oscuro/terracota definido en `tailwind.config.ts`)
- **Routing**: React Router v6
- **Estado global**: Zustand 4.5
- **Gráficas**: Recharts 2.12 (barras y líneas para estadísticas)
- **UI Primitives**: Radix UI (Dialog, Select, Toast, DropdownMenu)
- **Iconos**: Lucide React
- **HTTP**: Axios (instancia base con prefijo `/api/admin`)
- **Fuentes**: Inter — Google Fonts en `index.html`

---

## Arquitectura

```
src/
├── App.tsx                         # Router con rutas protegidas
├── main.tsx
├── index.css
├── lib/
│   ├── utils.ts                    # cn() helper
│   └── api.ts                      # Instancia Axios con interceptores
├── store/
│   └── authStore.ts                # Admin auth (token, adminId, email)
├── types/
│   └── index.ts                    # Tipos globales admin
├── pages/
│   ├── LoginPage.tsx               # "/login"
│   ├── DashboardPage.tsx           # "/dashboard"
│   ├── ProductsPage.tsx            # "/productos" — lista
│   ├── ProductFormPage.tsx         # "/productos/nuevo" y "/productos/:id/editar"
│   ├── OrdersPage.tsx              # "/ordenes" — activas
│   ├── OrderDetailPage.tsx         # "/ordenes/:id"
│   ├── OrderHistoryPage.tsx        # "/historial"
│   └── StatsPage.tsx               # "/estadisticas"
└── components/
    ├── layout/
    │   ├── Sidebar.tsx             # Navegación lateral
    │   ├── TopBar.tsx              # Header con usuario + logout
    │   └── AdminLayout.tsx         # Wrapper: Sidebar + TopBar + Outlet
    ├── products/
    │   ├── ProductTable.tsx        # Tabla de productos
    │   ├── ProductForm.tsx         # Formulario crear/editar
    │   └── ImageUploader.tsx       # Subida múltiple de imágenes
    ├── orders/
    │   ├── OrderTable.tsx          # Tabla de órdenes
    │   ├── OrderStatusBadge.tsx    # Badge de estado con color
    │   └── OrderStatusStepper.tsx  # Botón avanzar estado
    ├── stats/
    │   ├── SalesChart.tsx          # Gráfica ventas por mes (Recharts BarChart)
    │   ├── TopProductsChart.tsx    # Gráfica top productos (Recharts BarChart horizontal)
    │   └── MetricCard.tsx          # Tarjeta de métrica única
    └── shared/
        ├── Button.tsx
        ├── Input.tsx
        ├── Select.tsx
        ├── Badge.tsx
        ├── Spinner.tsx
        └── ConfirmDialog.tsx       # Dialog de confirmación para acciones destructivas
```

---

## Tipos TypeScript Principales

```typescript
// src/types/index.ts

export type OrderStatus = 'received' | 'preparing' | 'shipped' | 'delivered'
export type ProductType = 'standard' | 'sponsored'

export interface SponsorInfo {
  name: string
  logoUrl: string
  tagline: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrls: string[]
  categoryId: string
  categoryName: string
  type: ProductType
  sponsorInfo?: SponsorInfo
  inStock: boolean
  deletedAt: string | null  // null = activo, string = soft-deleted
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Order {
  id: string
  trackingCode: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  address: string
  customerName: string
  customerEmail: string
  createdAt: string
  updatedAt: string
}

export interface SalesByMonth {
  month: string        // "2026-03"
  totalAmount: number
  orderCount: number
}

export interface TopProduct {
  productId: string
  name: string
  unitsSold: number
  revenue: number
}

export interface DashboardStats {
  monthlySales: number
  activeOrders: number
  activeProducts: number
  pendingOrders: number
}
```

---

## API Endpoints Consumidos (desde ms_backend)

### POST /api/auth/admin/login
Login exclusivo admin.

**Request**: `{ "email": "...", "password": "..." }`
**Response 200**: `{ "token": "jwt...", "admin": { "id": "uuid", "email": "...", "role": "admin" } }`
**Errores**: 401 (credenciales inválidas), 403 (usuario no es admin)

---

### GET /api/admin/products
Lista de productos (activos + soft-deleted).

**Query params**: `?page=1&per_page=20&include_deleted=true`
**Response 200**:
```json
{
  "data": [ { ...Product, "deleted_at": null } ],
  "meta": { "total": 50, "page": 1 }
}
```

### POST /api/admin/products
Crear producto. `Content-Type: multipart/form-data`

**Form fields**: `name`, `description`, `price`, `category_id`, `type`, `in_stock`, `images[]`, `sponsor_name`?, `sponsor_logo`?, `sponsor_tagline`?
**Response 201**: `{ "product": { ...Product } }`

### PUT /api/admin/products/:id
Editar producto. Mismo contrato que POST.
**Response 200**: `{ "product": { ...Product } }`

### DELETE /api/admin/products/:id
Soft delete.
**Response 200**: `{ "product": { ...Product, "deleted_at": "timestamp" } }`

---

### GET /api/admin/categories
**Response 200**: `{ "data": [ ...Category ] }`

### POST /api/admin/categories
**Request**: `{ "name": "...", "slug": "..." }`

### PUT /api/admin/categories/:id
**Request**: `{ "name": "...", "slug": "..." }`

### DELETE /api/admin/categories/:id
**Response**: 200 OK | 422 (tiene productos activos asociados)

---

### GET /api/admin/orders
Lista de órdenes.

**Query params**: `?status=received&page=1&per_page=20&from=2026-01-01&to=2026-04-15&q=LIV-A3F9`
**Response 200**: `{ "data": [ ...Order ], "meta": { "total": N, "page": N } }`

### PUT /api/admin/orders/:id/status
Avanzar estado de una orden.

**Request**: `{ "status": "preparing" }`
**Response 200**: `{ "order": { ...Order } }`
**Errores**: 422 (estado inválido o retroceso no permitido)

---

### GET /api/admin/stats/sales
Ventas por mes.

**Query params**: `?from=2026-01-01&to=2026-04-30`
**Response 200**: `{ "data": [ { "month": "2026-01", "total_amount": 850000, "order_count": 10 } ] }`

### GET /api/admin/stats/products
Top productos más vendidos.

**Query params**: `?from=...&to=...&limit=10`
**Response 200**: `{ "data": [ { "product_id": "...", "name": "...", "units_sold": 42, "revenue": 3570000 } ] }`

### GET /api/admin/stats/monthly
Métricas del dashboard (mes actual).

**Response 200**:
```json
{
  "monthly_sales": 1250000,
  "active_orders": 8,
  "active_products": 24,
  "pending_orders": 3
}
```

---

## Configuración Axios (`src/lib/api.ts`)

```typescript
const api = axios.create({ baseURL: 'http://localhost:4000/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
```

---

## Rutas Protegidas

```typescript
// PrivateRoute: si no hay token → <Navigate to="/login" />
function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <AdminLayout>{children}</AdminLayout>
}
```

---

## Archivos a Crear/Modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/types/index.ts` | Crear | Tipos globales admin |
| `src/lib/api.ts` | Crear | Axios con interceptores admin |
| `src/store/authStore.ts` | Modificar | Ya existe scaffold, completar |
| `src/components/shared/Button.tsx` | Crear | Botón con variantes dark |
| `src/components/shared/Input.tsx` | Crear | Input con label y error |
| `src/components/shared/Select.tsx` | Crear | Select basado en Radix |
| `src/components/shared/Badge.tsx` | Crear | Badge de estado con colores |
| `src/components/shared/Spinner.tsx` | Crear | Spinner loading |
| `src/components/shared/ConfirmDialog.tsx` | Crear | Dialog confirmación destructiva |
| `src/components/layout/Sidebar.tsx` | Crear | Nav lateral con links |
| `src/components/layout/TopBar.tsx` | Crear | Header con usuario + logout |
| `src/components/layout/AdminLayout.tsx` | Crear | Layout wrapper |
| `src/components/products/ProductTable.tsx` | Crear | Tabla productos |
| `src/components/products/ProductForm.tsx` | Crear | Formulario CRUD |
| `src/components/products/ImageUploader.tsx` | Crear | Subida múltiple imágenes |
| `src/components/orders/OrderTable.tsx` | Crear | Tabla órdenes |
| `src/components/orders/OrderStatusBadge.tsx` | Crear | Badge estado colored |
| `src/components/orders/OrderStatusStepper.tsx` | Crear | Botón avanzar estado |
| `src/components/stats/MetricCard.tsx` | Crear | Tarjeta métrica |
| `src/components/stats/SalesChart.tsx` | Crear | BarChart ventas mensuales |
| `src/components/stats/TopProductsChart.tsx` | Crear | BarChart horizontal top productos |
| `src/pages/LoginPage.tsx` | Crear | Login admin |
| `src/pages/DashboardPage.tsx` | Crear | Dashboard con métricas |
| `src/pages/ProductsPage.tsx` | Crear | Lista productos |
| `src/pages/ProductFormPage.tsx` | Crear | Crear/editar producto |
| `src/pages/OrdersPage.tsx` | Crear | Órdenes activas |
| `src/pages/OrderDetailPage.tsx` | Crear | Detalle + update estado |
| `src/pages/OrderHistoryPage.tsx` | Crear | Historial con filtros |
| `src/pages/StatsPage.tsx` | Crear | Panel estadísticas |
| `src/App.tsx` | Modificar | Rutas reales con PrivateRoute |

---

## Consideraciones

- **Subida de imágenes**: `ImageUploader` usa `<input type="file" multiple>` + preview local (URL.createObjectURL). Al submit del formulario, las imágenes van en `FormData` como `images[]`.
- **Soft delete visual**: en `ProductTable`, las filas de productos eliminados tienen `opacity-50` y una etiqueta "Eliminado"; el botón de acción cambia a "Restaurar" (si se implementa en el futuro).
- **Paginación**: todas las tablas usan paginación server-side con `page` y `per_page`.
- **Fechas**: mostrar todas las fechas en formato local colombiano (`es-CO`): `15 abr 2026`.
- **Optimistic updates**: al cambiar estado de una orden, actualizar la UI inmediatamente y revertir en caso de error del servidor.
- **Responsive mínimo**: el panel está pensado para uso en desktop; en tablet el sidebar colapsa a un drawer; mobile no es prioridad para el MVP admin.
