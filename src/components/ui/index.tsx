/**
 * UI Components Library - Autism Care Platform
 *
 * Comprehensive set of reusable UI components with accessibility,
 * animations, and responsive design built-in.
 */

import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, useState } from "react";
import { cn } from "~/lib/utils";

// ============================================================================
// Button Component
// ============================================================================

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline:
          "border-2 border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 text-gray-700",
        link: "text-indigo-600 underline-offset-4 hover:underline",
        success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
        warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
        soft: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin text-current"
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
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);
Button.displayName = "Button";

// ============================================================================
// Card Component
// ============================================================================

const cardVariants = cva(
  "rounded-xl border bg-white transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-gray-200 shadow-sm hover:shadow-md",
        ghost: "border-transparent shadow-none hover:bg-gray-50",
        interactive:
          "border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        elevated: "border-gray-200 shadow-lg",
        outline: "border-2 border-gray-200 shadow-none",
      },
      padding: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      header,
      footer,
      noPadding,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          cardVariants({
            variant,
            padding: noPadding ? "none" : padding,
            className,
          }),
        )}
        ref={ref}
        {...props}
      >
        {header && (
          <div
            className={cn(
              "border-b border-gray-100",
              noPadding ? "px-6 py-4" : "pb-4 mb-4",
            )}
          >
            {header}
          </div>
        )}
        <div className={noPadding ? "px-6 py-4" : ""}>{children}</div>
        {footer && (
          <div
            className={cn(
              "border-t border-gray-100",
              noPadding ? "px-6 py-4" : "pt-4 mt-4",
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);
Card.displayName = "Card";

// ============================================================================
// Badge Component
// ============================================================================

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-indigo-100 text-indigo-700",
        secondary: "bg-gray-100 text-gray-700",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        destructive: "bg-red-100 text-red-700",
        info: "bg-sky-100 text-sky-700",
        outline: "border border-gray-200 bg-transparent text-gray-700",
        subtle: "bg-gray-50 text-gray-600",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, dotColor, children, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "mr-1.5 h-1.5 w-1.5 rounded-full",
              dotColor || "bg-current",
            )}
          />
        )}
        {children}
      </span>
    );
  },
);
Badge.displayName = "Badge";

// ============================================================================
// Input Component
// ============================================================================

const inputVariants = cva(
  "flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-300 focus:border-red-500 focus:ring-red-500/20",
        success:
          "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      error,
      label,
      helperText,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: error ? "error" : variant, size }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

// ============================================================================
// Progress Component
// ============================================================================

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "success" | "warning" | "danger" | "info";
  showValue?: boolean;
  animated?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size = "default",
      variant = "default",
      showValue,
      animated,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: "bg-indigo-500",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
      info: "bg-sky-500",
    };

    const sizes = {
      sm: "h-1.5",
      default: "h-2.5",
      lg: "h-4",
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div
          className={cn(
            "w-full overflow-hidden rounded-full bg-gray-100",
            sizes[size],
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              variants[variant],
              animated && "animate-pulse",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <div className="mt-1 flex justify-between text-xs text-gray-600">
            <span>{Math.round(percentage)}%</span>
            <span>
              {value} / {max}
            </span>
          </div>
        )}
      </div>
    );
  },
);
Progress.displayName = "Progress";

// ============================================================================
// Avatar Component
// ============================================================================

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-20 w-20 text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  status?: "online" | "offline" | "away" | "busy";
}

const Avatar = ({
  size,
  src,
  alt,
  fallback,
  className,
  status,
}: AvatarProps) => {
  const [error, setError] = useState(false);
  const initials = fallback
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    away: "bg-amber-500",
    busy: "bg-red-500",
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className={cn(
          avatarVariants({ size }),
          "flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white",
        )}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <span>{initials || fallback?.[0]?.toUpperCase() || "?"}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-white",
            statusColors[status],
            size === "xs" && "bottom-0 right-0 h-1.5 w-1.5",
            size === "sm" && "bottom-0 right-0 h-2 w-2",
            size === "default" && "bottom-0 right-0 h-2.5 w-2.5",
            size === "lg" && "bottom-0.5 right-0.5 h-3 w-3",
            size === "xl" && "bottom-0.5 right-0.5 h-3.5 w-3.5",
            size === "2xl" && "bottom-1 right-1 h-4 w-4",
          )}
        />
      )}
    </div>
  );
};

// ============================================================================
// Skeleton Component
// ============================================================================

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-lg bg-gray-200", className)} />
  );
};

// ============================================================================
// Empty State Component
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-gray-500 text-sm">{description}</p>
      )}
      {action}
    </div>
  );
};

// ============================================================================
// Tooltip Component (Simple)
// ============================================================================

const Tooltip = ({
  children,
  content,
}: { children: React.ReactNode; content: string }) => {
  return (
    <div className="group relative">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          {content}
        </div>
        <div className="absolute left-1/2 top-full -mt-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
};

// ============================================================================
// Stat Card Component
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  trend?: "up" | "down" | "flat";
  subtitle?: string;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  trend,
  subtitle,
  onClick,
}: StatCardProps) => {
  const changeColors = {
    positive: "text-emerald-600 bg-emerald-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  };

  return (
    <Card
      variant={onClick ? "interactive" : "default"}
      className={onClick ? "cursor-pointer" : ""}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="mt-1 font-bold text-2xl text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              changeColors[changeType],
            )}
          >
            {trend === "up" && "↑ "}
            {trend === "down" && "↓ "}
            {change}
          </span>
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// Select Component
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "default" | "lg";
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      label,
      error,
      helperText,
      size = "default",
      ...props
    },
    ref,
  ) => {
    const selectId =
      props.id || props.name || Math.random().toString(36).substr(2, 9);

    const sizes = {
      sm: "h-9 px-3 text-xs",
      default: "h-11 px-4 text-sm",
      lg: "h-12 px-5 text-base",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            "flex w-full rounded-xl border border-gray-200 bg-white transition-all duration-200",
            "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizes[size],
            error &&
              "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            className,
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";

// ============================================================================
// Spinner Component
// ============================================================================

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "primary" | "white";
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "default", variant = "default", ...props }, ref) => {
    const sizes = {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    };

    const variants = {
      default: "text-gray-400",
      primary: "text-indigo-600",
      white: "text-white",
    };

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          "animate-spin",
          sizes[size],
          variants[variant],
          className,
        )}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-full w-full"
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
      </div>
    );
  },
);
Spinner.displayName = "Spinner";

// ============================================================================
// Export all components
// ============================================================================

export {
  Button,
  buttonVariants,
  Card,
  cardVariants,
  Badge,
  badgeVariants,
  Input,
  inputVariants,
  Select,
  Spinner,
  Progress,
  Avatar,
  Skeleton,
  EmptyState,
  Tooltip,
  StatCard,
};

export type {
  CardProps,
  BadgeProps,
  InputProps,
  SelectProps,
  SpinnerProps,
  ProgressProps,
  AvatarProps,
  StatCardProps,
};
