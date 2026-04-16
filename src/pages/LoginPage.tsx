import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'

export default function LoginPage() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore(s => s.setAuth)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/admin/login', { email, password })
      setAuth(data.token, data.admin.id, data.admin.email)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const status = err.response?.status
      if (status === 403) setError('No tienes permisos de administrador')
      else setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-text-primary">Los Libros de Ivonnet</h1>
            <p className="text-sm text-text-secondary">Panel de administración</p>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-surface p-6 shadow-xl"
        >
          <h2 className="mb-5 text-base font-semibold text-text-primary">Iniciar sesión</h2>

          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} className="mt-1 w-full">
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
