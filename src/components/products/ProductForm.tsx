import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Product, Category } from '@/types'
import Input from '@/components/shared/Input'
import Select from '@/components/shared/Select'
import Button from '@/components/shared/Button'
import ImageUploader from './ImageUploader'
import { useToast } from '@/components/shared/Toast'

interface Props {
  product?: Product
}

export default function ProductForm({ product }: Props) {
  const navigate = useNavigate()
  const toast    = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving]         = useState(false)

  const [name,        setName]        = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price,       setPrice]       = useState(product ? String(product.price) : '')
  const [categoryId,  setCategoryId]  = useState(product?.categoryId ?? '')
  const [type,        setType]        = useState<'standard' | 'sponsored'>(product?.type ?? 'standard')
  const [inStock,     setInStock]     = useState(product?.inStock ?? true)
  const [sponsorName, setSponsorName] = useState(product?.sponsorInfo?.name ?? '')
  const [sponsorLogo, setSponsorLogo] = useState(product?.sponsorInfo?.logoUrl ?? '')
  const [sponsorTag,  setSponsorTag]  = useState(product?.sponsorInfo?.tagline ?? '')

  const [existingUrls,    setExistingUrls]    = useState<string[]>(product?.imageUrls ?? [])
  const [newFiles,        setNewFiles]        = useState<File[]>([])

  useEffect(() => {
    api.get('/storefront/categories').then(({ data }) =>
      setCategories(data.data.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })))
    )
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('name',        name)
      formData.append('description', description)
      formData.append('price',       price)
      formData.append('category_id', categoryId)
      formData.append('type',        type)
      formData.append('in_stock',    String(inStock))

      existingUrls.forEach(url => formData.append('image_urls[]', url))
      newFiles.forEach(file => formData.append('images[]', file))

      if (type === 'sponsored') {
        formData.append('sponsor_name',    sponsorName)
        formData.append('sponsor_logo_url', sponsorLogo)
        formData.append('sponsor_tagline', sponsorTag)
      }

      if (product) {
        await api.put(`/admin/products/${product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast('Producto actualizado', 'success')
      } else {
        await api.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast('Producto creado', 'success')
      }
      navigate('/productos')
    } catch (err: any) {
      const errors = err.response?.data?.errors
      if (errors) {
        const msgs = Object.values(errors).flat().join(', ')
        toast(msgs, 'error')
      } else {
        toast('Error al guardar el producto', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 animate-fade-in">
      <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Información básica</h2>

        <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <Input
          label="Precio (COP)"
          type="number"
          min={1}
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <Select
          label="Categoría"
          placeholder="Seleccionar categoría..."
          options={categories.map(c => ({ value: c.id, label: c.name }))}
          value={categoryId}
          onValueChange={setCategoryId}
        />
        <Select
          label="Tipo"
          options={[
            { value: 'standard',  label: 'Estándar' },
            { value: 'sponsored', label: 'Patrocinado' },
          ]}
          value={type}
          onValueChange={v => setType(v as 'standard' | 'sponsored')}
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={e => setInStock(e.target.checked)}
            className="rounded accent-accent"
          />
          <span className="text-sm text-text-secondary">En stock</span>
        </label>
      </div>

      {/* Imágenes */}
      <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Imágenes</h2>
        <ImageUploader
          existingUrls={existingUrls}
          newFiles={newFiles}
          onAddFiles={files => setNewFiles(prev => [...prev, ...files])}
          onRemoveExisting={url => setExistingUrls(prev => prev.filter(u => u !== url))}
          onRemoveNew={i => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
        />
      </div>

      {/* Sponsor */}
      {type === 'sponsored' && (
        <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary">Información del patrocinador</h2>
          <Input label="Nombre" value={sponsorName} onChange={e => setSponsorName(e.target.value)} required />
          <Input label="URL del logo" value={sponsorLogo} onChange={e => setSponsorLogo(e.target.value)} />
          <Input label="Tagline" value={sponsorTag} onChange={e => setSponsorTag(e.target.value)} />
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" loading={saving}>
          {product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/productos')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
