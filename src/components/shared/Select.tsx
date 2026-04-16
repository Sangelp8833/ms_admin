import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  error?: string
  disabled?: boolean
  className?: string
}

export default function Select({
  label, placeholder = 'Seleccionar...', options, value, onValueChange, error, disabled, className,
}: Props) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-border',
            'bg-surface px-3 text-sm text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger',
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon><ChevronDown className="w-4 h-4 text-text-secondary" /></RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-surface shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map(opt => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded px-8 py-2 text-sm',
                    'text-text-primary outline-none',
                    'data-[highlighted]:bg-hover-row data-[highlighted]:text-text-primary',
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2">
                    <Check className="w-4 h-4 text-accent" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
