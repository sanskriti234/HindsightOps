import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  gap-1
  rounded-full
  border
  px-2.5
  py-0.5
  text-xs
  font-medium
  whitespace-nowrap
  transition-colors

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2

  [&>svg]:size-3
  [&>svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",

        secondary:
          "bg-secondary text-secondary-foreground",

        outline:
          "border-border bg-transparent text-foreground",

        destructive:
          "bg-destructive text-destructive-foreground",

        ghost:
          "bg-transparent hover:bg-muted",

        success:
          "bg-green-500/15 text-green-600 border-green-500/20",

        warning:
          "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",

        info:
          "bg-blue-500/15 text-blue-600 border-blue-500/20",

        hindsight:
          "bg-primary/10 text-primary border-primary/20",

        incident:
          "bg-red-500/10 text-red-500 border-red-500/20",

        recall:
          "bg-violet-500/10 text-violet-500 border-violet-500/20",

        reflect:
          "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",

        model:
          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",

        diagnosis:
          "bg-orange-500/10 text-orange-500 border-orange-500/20",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>) {

  return useRender({
    defaultTagName: "span",

    props: mergeProps(
      {
        className: cn(
          badgeVariants({
            variant,
          }),
          className
        ),
      },
      props
    ),

    render,

    state: {
      slot: "badge",
      variant,
    },
  })
}

export {
  Badge,
  badgeVariants,
}