import { HugeiconsIcon } from '@hugeicons/react'
import Search01Icon from '@hugeicons/core-free-icons/Search01Icon'

type SearchFieldProps = {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function SearchField({ placeholder, value, onChange }: SearchFieldProps) {
  return (
    <label className="search-field">
      <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.8} aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
