import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import buttonStyles from './Button.module.css'

type ButtonOrAnchor = 'button' | 'a'
type ButtonProps = React.ComponentPropsWithoutRef<'button'>
type AnchorProps = React.ComponentPropsWithoutRef<'a'>
type SharedProps = {
  as?: ButtonOrAnchor
  accent?: boolean
  subtle?: boolean
  className?: string
  children: React.ReactNode
}

type PillButtonProps =
  | (SharedProps & { as?: 'button' } & ButtonProps)
  | (SharedProps & { as: 'a' } & AnchorProps)

export const PillButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, PillButtonProps>(
  ({ as = 'button', accent, subtle, className = '', children, ...rest }, ref) => {
    const Comp = motion[as as ButtonOrAnchor] as React.ElementType
    const variantClass = accent ? buttonStyles.accent : subtle ? buttonStyles.subtle : ''
    return (
      <Comp
        ref={ref}
        className={`${buttonStyles.pillButton} ${variantClass} ${className}`.trim()}
        whileTap={{ scale: 0.96 }}
        whileHover={{ y: -1 }}
        style={{ whiteSpace: 'normal', ...(rest.style || {}) }}
        {...rest}
      >
        {children}
      </Comp>
    )
  },
)
