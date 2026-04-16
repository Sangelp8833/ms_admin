import { useEffect, useState, FormEvent } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import api from '@/lib/api'
import { Category } from '@/types'
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Spinner from '@/components/shared/Spinner'
import { useToast } from '@/components/shared/Toast'

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function CategoriesPage() {
  const toast = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)

  // crear
  const [newName, setNewName]   = useState('')
  const [newSlug, setNewSlug]   = useState('')
  const [creating, setCreating] = useState(false)

  // editar
  const [editId,   setEditId]   = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [saving,   setSaving]   = useState(false)

  // eliminar
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleting, setDeleting]         = useState(false)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    try {
      const { data } = await api.get('/storefront/categories')
      setCategories(data.data.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })))
    } catch {
      toast('Error al cargar categorías', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      const { data } = await api.post('/admin/categories', {
        name: newName.trim(),
        slug: newSlug.trim() || toSlug(newName),
      })
      setCategories(prev => [...prev, { id: data.data.id, name: data.data.name, slug: data.data.slug }])
      setNewName('')
      setNewSlug('')
      toast('Categoría creada', 'success')
    } catch (err: any) {
      toast(err.response?.data?.errors?.slug?.[0] ?? 'Error al crear categoría', 'error')
    } finally {
      setCreating(false)
    }
  }

  async function handleSaveEdit() {
    if (!editId) return
    setSaving(true)
    try {
      const { data } = await api.put(`/admin/categories/${editId}`, {
        name: editName.trim(),
        slug: editSlug.trim() || toSlug(editName),
      })
      setCategories(prev =>
        prev.map(c => c.id === editId ? { id: data.data.id, name: data.data.name, slug: data.data.slug } : c)
      )
      setEditId(null)
      toast('Categoría actualizada', 'success')
    } catch {
      toast('Error al actualizar', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/admin/categories/${deleteTarget.id}`)
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id))
      toast('Categoría eliminada', 'success')
    } catch (err: any) {
      const msg = err.response?.status === 422
        ? 'Esta categoría tiene productos asociados'
        : 'Error al eliminar'
      toast(msg, 'error')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Crear */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Nueva categoría</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <Input
            placeholder="Nombre"
            value={newName}
            onChange={e => { setNewName(e.target.value); setNewSlug(toSlug(e.target.value)) }}
            className="flex-1"
          />
          <Input
            placeholder="slug-auto"
            value={newSlug}
            onChange={e => setNewSlug(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" loading={creating} size="md">
            <Plus className="h-4 w-4" />
            Crear
          </Button>
        </form>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Slug</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-text-secondary">
                  No hay categorías
                </td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="border-b border-border/50 hover:bg-hover-row">
                  <td className="px-4 py-3">
                    {editId === cat.id ? (
                      <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-7 text-xs" />
                    ) : (
                      <span className="text-text-primary">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editId === cat.id ? (
                      <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="h-7 text-xs" />
                    ) : (
                      <span className="font-mono text-xs text-text-secondary">{cat.slug}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {editId === cat.id ? (
                        <>
                          <Button size="sm" variant="secondary" onClick={handleSaveEdit} loading={saving}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditSlug(cat.slug) }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(cat)}>
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
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="Eliminar categoría"
        description={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
