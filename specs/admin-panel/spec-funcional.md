# Especificacion Funcional: Admin Panel — Panel de Administración

**Fecha**: 2026-04-15
**Estado**: Aprobada

## Problema

Los administradores de Los Libros de Ivonnet necesitan una interfaz separada (diferente a la tienda pública) para gestionar productos, órdenes y visualizar estadísticas de ventas sin interferir con la experiencia del comprador.

## Objetivo

Proveer un panel de administración completo que permita: hacer CRUD de productos (incluyendo subida de imágenes), gestionar el estado de las órdenes activas e históricas, y visualizar métricas de ventas para tomar decisiones informadas. El panel tiene acceso restringido solo a usuarios con rol `admin`.

## Usuarios

- **Administrador**: usuario con rol `admin` en el backend. Tiene acceso completo a todas las funcionalidades del panel.

---

## Historias de Usuario

### HU-1: Acceder al panel de administración
**Como** administrador, **quiero** iniciar sesión en un portal separado de la tienda pública, **para** asegurar que el acceso administrativo esté aislado.

**Criterios de aceptación:**
- [ ] URL separada (`:5175` en desarrollo)
- [ ] Formulario de login: email + contraseña
- [ ] Solo usuarios con rol `admin` pueden acceder (backend valida)
- [ ] Tras login, redirige al dashboard
- [ ] Rutas del panel redirigen a login si no hay sesión activa

### HU-2: Ver dashboard resumen
**Como** administrador, **quiero** ver un resumen al entrar al panel, **para** tener contexto rápido del estado del negocio.

**Criterios de aceptación:**
- [ ] Tarjetas de métricas clave: total ventas del mes, órdenes activas, productos publicados
- [ ] Acceso rápido a "Órdenes pendientes de actualización"
- [ ] Link directo a crear nuevo producto

### HU-3: Gestionar productos (CRUD)
**Como** administrador, **quiero** crear, ver, editar y eliminar productos, **para** mantener el catálogo de la tienda actualizado.

**Criterios de aceptación:**
- [ ] Tabla/lista de todos los productos con: imagen miniatura, nombre, precio, tipo (estándar/patrocinado), estado (activo/eliminado)
- [ ] Crear producto: nombre, descripción, precio, categoría, tipo, múltiples imágenes, info del patrocinador si aplica
- [ ] Editar producto existente: mismos campos
- [ ] Subir múltiples fotos por producto
- [ ] Eliminar es **soft delete**: el producto no aparece en la tienda pero permanece en el sistema para reportes
- [ ] Indicador visual diferenciado para productos eliminados (soft-deleted) en la lista

### HU-4: Gestionar categorías
**Como** administrador, **quiero** crear y gestionar las categorías de productos, **para** organizar el catálogo.

**Criterios de aceptación:**
- [ ] Lista de categorías existentes
- [ ] Crear categoría: nombre, slug
- [ ] Editar nombre/slug
- [ ] Eliminar solo si no tiene productos activos asociados

### HU-5: Gestionar órdenes activas
**Como** administrador, **quiero** ver todas las órdenes activas y actualizar su estado, **para** hacer seguimiento del proceso de entrega.

**Criterios de aceptación:**
- [ ] Lista de órdenes con: código de tracking, cliente, fecha, total, estado actual
- [ ] Filtro por estado: `received`, `preparing`, `shipped`, `delivered`
- [ ] Al ver detalle de una orden: items, dirección, datos del cliente
- [ ] Botón para avanzar al siguiente estado (no puede retroceder)
- [ ] Estados posibles en orden: `received → preparing → shipped → delivered`

### HU-6: Ver historial de órdenes
**Como** administrador, **quiero** ver todas las órdenes históricas (incluidas las entregadas), **para** tener un registro completo.

**Criterios de aceptación:**
- [ ] Tabla paginada con todas las órdenes (activas + históricas)
- [ ] Filtros: por estado, por rango de fechas
- [ ] Búsqueda por código de tracking o email del cliente
- [ ] Detalle de orden accesible

### HU-7: Ver estadísticas de ventas
**Como** administrador, **quiero** visualizar métricas de ventas, **para** entender el rendimiento del negocio y comparar períodos.

**Criterios de aceptación:**
- [ ] Total de ventas en dinero por mes (gráfica de barras o línea)
- [ ] Productos más vendidos (en unidades y en dinero)
- [ ] Comparación entre meses (mes actual vs mes anterior)
- [ ] Los productos soft-deleted aparecen en las estadísticas históricas (no se borran de los reportes)
- [ ] Filtro por rango de fechas para las estadísticas

---

## Alcance

### Incluido
- Login exclusivo para admins
- Dashboard con métricas de resumen
- CRUD de productos con subida de imágenes
- CRUD de categorías
- Gestión de órdenes (ver + actualizar estado)
- Historial de órdenes con filtros
- Panel de estadísticas (ventas por mes, top productos)

### Excluido
- Gestión de usuarios/compradores (no es necesario para el MVP)
- Configuración de métodos de pago
- Integración con courier/mensajería
- Notificaciones push o en tiempo real (los cambios se guardan al hacer click)
- Multi-admin con roles diferenciados (todos los admins tienen el mismo acceso)
- Exportar reportes a Excel/PDF (iteración posterior)

## Reglas de Negocio

1. **Solo rol `admin`** puede acceder. El backend rechaza con 403 si el token es de un usuario regular.
2. **Soft delete**: eliminar un producto lo marca como `deleted_at: timestamp`. No aparece en la tienda pública ni en la lista activa del admin, pero sí en reportes de estadísticas.
3. **Avance unidireccional de estado**: `received → preparing → shipped → delivered`. El backend rechaza intentos de retroceder.
4. **Imágenes**: se suben al backend que las almacena (S3 o local). El producto guarda un array de `image_urls`.
5. **Estadísticas por soft-delete**: las ventas de productos eliminados siguen contando en los reportes históricos.
6. **Categorías con productos activos**: no se pueden eliminar si tienen productos activos asociados.

## Dependencias

- **ms_backend** (`http://localhost:4000/api/admin`): todos los endpoints admin requieren token JWT con rol `admin`
- **S3 / storage** (via backend): las imágenes se envían al backend como `multipart/form-data`
