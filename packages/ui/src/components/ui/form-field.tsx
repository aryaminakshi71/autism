'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { cn } from '../../lib/index'

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

/**
 * FormField component with React 19 useFormStatus integration
 * Automatically shows loading state during form submission
 */
const FormFieldInput = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, error, helperText, required, id, ...props }, ref) => {
    const { pending } = useFormStatus()
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${fieldId}-error` : undefined
    const helperId = helperText ? `${fieldId}-helper` : undefined

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          id={fieldId}
          ref={ref}
          disabled={pending || props.disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || helperId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        {pending && (
          <p className="text-xs text-muted-foreground">Submitting...</p>
        )}
      </div>
    )
  }
)
FormFieldInput.displayName = 'FormFieldInput'

export interface FormFieldTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

const FormFieldTextarea = React.forwardRef<HTMLTextAreaElement, FormFieldTextareaProps>(
  ({ className, label, error, helperText, required, id, ...props }, ref) => {
    const { pending } = useFormStatus()
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${fieldId}-error` : undefined
    const helperId = helperText ? `${fieldId}-helper` : undefined

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          disabled={pending || props.disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || helperId}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        {pending && (
          <p className="text-xs text-muted-foreground">Submitting...</p>
        )}
      </div>
    )
  }
)
FormFieldTextarea.displayName = 'FormFieldTextarea'

export interface FormFieldSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  options: Array<{ value: string; label: string }>
}

const FormFieldSelect = React.forwardRef<HTMLSelectElement, FormFieldSelectProps>(
  ({ className, label, error, helperText, required, id, options, ...props }, ref) => {
    const { pending } = useFormStatus()
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${fieldId}-error` : undefined
    const helperId = helperText ? `${fieldId}-helper` : undefined

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <select
          id={fieldId}
          ref={ref}
          disabled={pending || props.disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || helperId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        {pending && (
          <p className="text-xs text-muted-foreground">Submitting...</p>
        )}
      </div>
    )
  }
)
FormFieldSelect.displayName = 'FormFieldSelect'

/**
 * SubmitButton component that uses useFormStatus
 * Automatically shows loading state during form submission
 */
export function SubmitButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
        'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {pending ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
          {children || 'Submitting...'}
        </>
      ) : (
        children
      )}
    </button>
  )
}

// Compound component for advanced use cases
export const FormFieldCompound = {
  Input: FormFieldInput,
  Textarea: FormFieldTextarea,
  Select: FormFieldSelect,
  SubmitButton,
}

// Simple wrapper component for basic label + children pattern
export interface SimpleFormFieldProps {
  label: string
  required?: boolean
  error?: string
  helperText?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  required,
  error,
  helperText,
  children,
  className,
}: SimpleFormFieldProps) {
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${fieldId}-error` : undefined
  const helperId = helperText ? `${fieldId}-helper` : undefined

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
