import { HugeiconsIcon } from '@hugeicons/react'
import Search01Icon from '@hugeicons/core-free-icons/Search01Icon'

export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <label className="search-field">
      <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.8} aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input type="search" placeholder={placeholder} />
    </label>
  )
}
