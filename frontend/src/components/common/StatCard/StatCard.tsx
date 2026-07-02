import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'

type StatCardProps = {
  label: string
  value: string
  icon: IconSvgElement
  tone?: 'strong'
}

export function StatCard({ label, value, icon, tone }: StatCardProps) {
  return (
    <div className={tone === 'strong' ? 'stat-card strong' : 'stat-card'}>
      <span className="stat-icon" aria-hidden="true">
        <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}
