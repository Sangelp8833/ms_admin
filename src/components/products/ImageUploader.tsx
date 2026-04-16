import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  existingUrls: string[]
  newFiles: File[]
  onAddFiles: (files: File[]) => void
  onRemoveExisting: (url: string) => void
  onRemoveNew: (index: number) => void
}

export default function ImageUploader({
  existingUrls, newFiles, onAddFiles, onRemoveExisting, onRemoveNew,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onAddFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {/* Previews */}
      {(existingUrls.length > 0 || newFiles.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {existingUrls.map(url => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt=""
                className="h-20 w-20 rounded-lg object-cover border border-border"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(url)}
                className={cn(
                  'absolute -top-1.5 -right-1.5 rounded-full bg-danger p-0.5',
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                )}
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
          {newFiles.map((file, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-20 w-20 rounded-lg object-cover border border-accent/50"
              />
              <button
                type="button"
                onClick={() => onRemoveNew(i)}
                className={cn(
                  'absolute -top-1.5 -right-1.5 rounded-full bg-danger p-0.5',
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                )}
              >
                <X className="h-3 w-3 text-white" />
              </button>
              <span className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/50 px-1 py-0.5 text-[10px] text-white text-center truncate">
                nueva
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border',
          'py-4 text-sm text-text-secondary hover:border-accent hover:text-text-primary transition-colors',
        )}
      >
        <Upload className="h-4 w-4" />
        Subir imágenes
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
