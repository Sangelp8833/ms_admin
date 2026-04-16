import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import api from '@/lib/api'
import { Product, PaginationMeta } from '@/types'
import ProductTable from '@/components/products/ProductTable'
import Button from '@/components/shared/Button'
import Spinner from '@/components/shared/Spinner'
import { useToast } from '@/components/shared/Toast'

function mapProduct(p: any): Product {
  return {
    id:           p.id,
    name:         p.name,
    description:  p.description,
    price:        p.price,
    imageUrls:    p.image_urls ?? [],
    categoryId:   p.category_id,
    categoryName: p.category_name ?? '',
    type:         p.type,
    sponsorInfo:  p.sponsor_info ? {
      name:    p.sponsor_info.name,
      logoUrl: p.sponsor_info.logo_url,
      tagline: p.sponsor_info.tagline,
    } : undefined,
    inStock:   p.in_stock,
    deletedAt: p.deleted_at ?? null,
  }
}

export default function ProductsPage() {
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [meta,     setMeta]     = useState<PaginationMeta>({ total: 0, page: 1, perPage: 20 })
  const [loading,  setLoading]  = useState(true)
  const [page,     setPage]     = useState(1)

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/admin/products?page=${p}&per_page=20&include_deleted=true`)
      setProducts(data.data.map(mapProduct))
      setMeta({ total: data.meta.total, page: data.meta.page, perPage: data.meta.per_page })
    } catch {
      toast('Error al cargar productos', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts(page) }, [page])

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/products/${id}`)
      toast('Producto eliminado', 'success')
      fetchProducts(page)
    } catch {
      toast('Error al eliminar el producto', 'error')
    }
  }

  const totalPages = Math.ceil(meta.total / meta.perPage)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{meta.total} productos en total</p>
        <Link to="/productos/nuevo">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm" variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-text-secondary">
            {page} / {totalPages}
          </span>
          <Button
            size="sm" variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
