import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '@/lib/api'
import { Product } from '@/types'
import ProductForm from '@/components/products/ProductForm'
import Spinner from '@/components/shared/Spinner'

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit  = !!id

  const [product, setProduct] = useState<Product | undefined>(undefined)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/products?include_deleted=true`).then(({ data }) => {
      const found = data.data.find((p: any) => p.id === id)
      if (found) setProduct({
        id:           found.id,
        name:         found.name,
        description:  found.description,
        price:        found.price,
        imageUrls:    found.image_urls ?? [],
        categoryId:   found.category_id,
        categoryName: found.category_name ?? '',
        type:         found.type,
        sponsorInfo:  found.sponsor_info ? {
          name:    found.sponsor_info.name,
          logoUrl: found.sponsor_info.logo_url,
          tagline: found.sponsor_info.tagline,
        } : undefined,
        inStock:   found.in_stock,
        deletedAt: found.deleted_at ?? null,
      })
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>
  }

  return (
    <div>
      <h2 className="mb-6 text-sm font-semibold text-text-primary">
        {isEdit ? 'Editar producto' : 'Nuevo producto'}
      </h2>
      <ProductForm product={product} />
    </div>
  )
}
