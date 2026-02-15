// Button Component - Based on existing shared-ui patterns

import * as React from 'react'
import {Slot} from '@radix-ui/react-slot'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '../../lib/index'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500',
        secondary: 'bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-700 focus-visible:ring-gray-500 dark:focus-visible:ring-gray-500',
        outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 focus-visible:ring-gray-500 dark:focus-visible:ring-gray-500',
        ghost: 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white focus-visible:ring-gray-500 dark:focus-visible:ring-gray-500',
        danger: 'bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 focus-visible:ring-red-500 dark:focus-visible:ring-red-500',
        success: 'bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700 focus-visible:ring-green-500 dark:focus-visible:ring-green-500',
        warning: 'bg-yellow-500 dark:bg-yellow-500 text-white hover:bg-yellow-600 dark:hover:bg-yellow-600 focus-visible:ring-yellow-500 dark:focus-visible:ring-yellow-500',
        link: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-lg',
        xl: 'h-14 px-10 text-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
     VariantProps<typeof buttonVariants> {
   asChild?: boolean
   loading?: boolean
   isLoading?: boolean // Alias for loading (for backward compatibility)
   leftIcon?: React.ReactNode
   rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({className, variant, size, asChild = false, loading, isLoading, leftIcon, rightIcon, children, disabled, 'aria-label': ariaLabel, ...props}, ref) => {
     // Use isLoading as fallback if loading is not provided
     const isLoadingState = loading ?? isLoading ?? false
     const Comp = asChild ? Slot : 'button'
     const isIconOnly = !children && (leftIcon || rightIcon)
     const computedAriaLabel = isIconOnly ? ariaLabel || (leftIcon ? 'Action' : 'Action') : ariaLabel

     // Filter out custom props that shouldn't be passed to DOM elements
     const domProps = Object.fromEntries(
       Object.entries(props).filter(([key]) => 
         !['loading', 'isLoading', 'leftIcon', 'rightIcon', 'variant', 'size', 'asChild'].includes(key)
       )
     )

     return (
       <Comp
         className={cn(buttonVariants({variant, size}), className)}
         ref={ref}
         disabled={disabled || isLoadingState}
         aria-label={computedAriaLabel}
         aria-disabled={disabled || isLoadingState ? 'true' : undefined}
         aria-busy={isLoadingState ? 'true' : undefined}
         {...domProps}
       >
         {isLoadingState ? (
           <>
             <svg
               className="mr-2 h-4 w-4 animate-spin"
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               aria-hidden="true"
             >
               <circle
                 className="opacity-25"
                 cx="12"
                 cy="12"
                 r="10"
                 stroke="currentColor"
                 strokeWidth="4"
               />
               <path
                 className="opacity-75"
                 fill="currentColor"
                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
               />
             </svg>
             <span className="sr-only">Loading...</span>
           </>
         ) : (
           <>
             {leftIcon && <span className="mr-2" aria-hidden="true">{leftIcon}</span>}
             {children}
             {rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
           </>
         )}
       </Comp>
     )
   }
)
Button.displayName = 'Button'

export {Button, buttonVariants}
