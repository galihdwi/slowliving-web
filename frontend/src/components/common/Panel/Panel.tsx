import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  subtitle: string
  toolbar?: ReactNode
  className?: string
  children: ReactNode
}

export function Panel({ title, subtitle, toolbar, className = '', children }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {toolbar}
      </div>
      {children}
    </section>
  )
}
