import type { ReactNode } from 'react'

type BadgeTone = 'default' | 'success' | 'muted'

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`badge ${tone}`}>{children}</span>
}
