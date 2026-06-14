'use client'

import * as React from 'react'

import {
  Dialog as DialogPrimitive,
} from '@base-ui/react/dialog'

import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

export function Dialog(
  props: DialogPrimitive.Root.Props
) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
    />
  )
}

export function DialogTrigger(
  props: DialogPrimitive.Trigger.Props
) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
    />
  )
}

export function DialogPortal(
  props: DialogPrimitive.Portal.Props
) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      {...props}
    />
  )
}

export function DialogClose(
  props: DialogPrimitive.Close.Props
) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
    />
  )
}

export function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        `
        fixed
        inset-0
        z-50
        bg-black/40
        backdrop-blur-sm

        data-open:animate-in
        data-open:fade-in-0

        data-closed:animate-out
        data-closed:fade-out-0
        `,
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps
  extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean
}

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>

      <DialogOverlay />

      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          `
          fixed
          left-1/2
          top-1/2
          z-50

          w-full
          max-w-3xl

          -translate-x-1/2
          -translate-y-1/2

          rounded-xl
          border
          bg-background

          shadow-xl

          p-6

          max-h-[90vh]
          overflow-y-auto

          data-open:animate-in
          data-open:zoom-in-95

          data-closed:animate-out
          data-closed:zoom-out-95
          `,
          className
        )}
        {...props}
      >

        {children}

        {showCloseButton && (

          <DialogPrimitive.Close
            render={
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 top-4"
              />
            }
          >

            <X />

            <span className="sr-only">
              Close
            </span>

          </DialogPrimitive.Close>

        )}

      </DialogPrimitive.Popup>

    </DialogPortal>
  )
}

export function DialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col gap-2',
        className
      )}
      {...props}
    />
  )
}

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        `
        text-xl
        font-semibold
        `,
        className
      )}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        `
        text-sm
        text-muted-foreground
        `,
        className
      )}
      {...props}
    />
  )
}

interface DialogFooterProps
  extends React.ComponentProps<'div'> {
  showCloseButton?: boolean
}

export function DialogFooter({
  className,
  children,
  showCloseButton = false,
  ...props
}: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        `
        mt-6
        flex
        flex-col-reverse
        gap-2

        sm:flex-row
        sm:justify-end

        border-t
        pt-4
        `,
        className
      )}
      {...props}
    >

      {children}

      {showCloseButton && (

        <DialogPrimitive.Close
          render={
            <Button variant="outline" />
          }
        >

          Close

        </DialogPrimitive.Close>

      )}

    </div>
  )
}

export {
  DialogPrimitive,
}