import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Product } from '@/types'
import { formatCOP } from '@/lib/utils'
import Badge from '@/components/shared/Badge'
import Button from '@/components/shared/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface Props {
  products: Product[]
  onDelete: (id: string) => Promise<void>
}

export default function ProductTable({ products, onDelete }: Props) {
  const [target,   setTarget]   = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleConfirmDelete() {
    if (!target) return
    setDeleting(true)
    await onDelete(target.id)
    setDeleting(false)
    setTarget(null)
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Producto</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary hidden md:table-cell">Categoría</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Precio</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary hidden sm:table-cell">Tipo</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-text-secondary">
                  No hay productos
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr
                  key={p.id}
                  className={`border-b border-border/50 hover:bg-hover-row ${p.deletedAt ? 'opacity-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrls[0] ? (
                        <img src={p.imageUrls[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-hover-row" />
                      )}
                      <span className="font-medium text-text-primary line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{p.categoryName}</td>
                  <td className="px-4 py-3 text-text-primary">{formatCOP(p.price)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={p.type === 'sponsored' ? 'warning' : 'neutral'}>
                      {p.type === 'sponsored' ? 'Patrocinado' : 'Estándar'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {p.deletedAt ? (
                      <Badge variant="danger">Eliminado</Badge>
                    ) : p.inStock ? (
                      <Badge variant="success">En stock</Badge>
                    ) : (
                      <Badge variant="neutral">Agotado</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {!p.deletedAt && (
                        <>
                          <Link to={`/productos/${p.id}/editar`}>
                            <Button size="sm" variant="ghost">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="danger" onClick={() => setTarget(p)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!target}
        onOpenChange={open => { if (!open) setTarget(null) }}
        title="Eliminar producto"
        description={`¿Eliminar "${target?.name}"? El producto quedará desactivado (soft delete).`}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  )
}
