import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  flat?: boolean
}

export function Card({ children, flat, className = '', ...rest }: CardProps) {
  const base = flat ? 'spark-card-flat' : 'spark-card'
  return (
    <div className={`${base} ${className}`} {...rest}>
      {children}
    </div>
  )
}
