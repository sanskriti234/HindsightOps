import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  whitespace-nowrap
  rounded-lg
  text-sm
  font-medium
  transition-all

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2

  disabled:pointer-events-none
  disabled:opacity-50

  [&_svg]:pointer-events-none
  [&_svg]:shrink-0
  [&_svg]:size-4
  `,
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90',

        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90',

        outline:
          'border border-border bg-background hover:bg-muted',

        ghost:
          'hover:bg-muted',

        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',

        link:
          'text-primary underline-offset-4 hover:underline',

        success:
          'bg-green-600 text-white hover:bg-green-700',

        warning:
          'bg-yellow-500 text-black hover:bg-yellow-600',

        hindsight:
          'bg-primary text-primary-foreground hover:bg-primary/90',

        diagnosis:
          'bg-orange-500 text-white hover:bg-orange-600',

        reflect:
          'bg-cyan-600 text-white hover:bg-cyan-700',

        incident:
          'bg-red-600 text-white hover:bg-red-700',
      },

      size: {
        xs: 'h-7 px-2 text-xs',

        sm: 'h-8 px-3 text-sm',

        default: 'h-10 px-4',

        lg: 'h-11 px-6 text-base',

        xl: 'h-12 px-8 text-lg',

        icon: 'h-10 w-10',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

export {
  buttonVariants,
}