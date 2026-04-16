import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Color = 'accent' | 'success' | 'warning' | 'info'

const colors: Record<Color, { icon: string; value: string }> = {
  accent:  { icon: 'bg-accent/10 text-accent',   value: 'text-accent' },
  success: { icon: 'bg-success/10 text-success',  value: 'text-success' },
  warning: { icon: 'bg-warning/10 text-warning',  value: 'text-warning' },
  info:    { icon: 'bg-blue-500/10 text-blue-400', value: 'text-blue-400' },
}

interface Props {
  label: string
  value: string | number
  icon: LucideIcon
  color?: Color
  className?: string
}

export default function MetricCard({ label, value, icon: Icon, color = 'accent', className }: Props) {
  const c = colors[color]
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">{label}</p>
          <p className={cn('mt-2 text-2xl font-bold', c.value)}>{value}</p>
        </div>
        <div className={cn('rounded-lg p-2.5', c.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
