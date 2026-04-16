import * as RadixToast from '@radix-ui/react-toast'
import { create } from 'zustand'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: ToastItem[]
  add: (message: string, type?: ToastType) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000)
  },
  remove: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

export const useToast = () => useToastStore(s => s.add)

const colors: Record<ToastType, string> = {
  success: 'border-success/30 bg-surface text-success',
  error:   'border-danger/30  bg-surface text-danger',
  info:    'border-border      bg-surface text-text-primary',
}

export function ToastProvider() {
  const { toasts, remove } = useToastStore()
  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map(t => (
        <RadixToast.Root
          key={t.id}
          open
          onOpenChange={(open) => { if (!open) remove(t.id) }}
          className={cn(
            'flex items-center justify-between gap-4 rounded-lg border px-4 py-3 shadow-lg',
            'data-[state=open]:animate-slide-up',
            colors[t.type],
          )}
        >
          <RadixToast.Description className="text-sm">{t.message}</RadixToast.Description>
          <RadixToast.Close onClick={() => remove(t.id)}>
            <X className="w-4 h-4 opacity-60 hover:opacity-100" />
          </RadixToast.Close>
        </RadixToast.Root>
      ))}
      <RadixToast.Viewport className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80" />
    </RadixToast.Provider>
  )
}
