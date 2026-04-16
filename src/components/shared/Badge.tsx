import { cn } from '@/lib/utils'

type Variant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

const variants: Record<Variant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger:  'bg-danger/10  text-danger  border-danger/20',
  neutral: 'bg-surface    text-text-secondary border-border',
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

interface Props {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'neutral', children, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
