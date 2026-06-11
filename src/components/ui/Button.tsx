import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'accent'

interface ButtonBaseProps {
  variant?: Variant
  children: ReactNode
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'anchor' }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClass: Record<Variant, string> = {
  primary: 'spark-btn-primary',
  secondary: 'spark-btn-secondary',
  accent: 'spark-btn-accent',
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', children, ...rest } = props
  const cls = `spark-btn ${variantClass[variant]}`

  if ('as' in rest && rest.as === 'anchor') {
    const { as: _as, ...anchorRest } = rest as ButtonAsAnchor
    return (
      <a className={cls} {...anchorRest}>
        {children}
      </a>
    )
  }

  const { as: _as, ...buttonRest } = rest as ButtonAsButton
  return (
    <button className={cls} {...buttonRest}>
      {children}
    </button>
  )
}
