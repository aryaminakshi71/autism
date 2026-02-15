import { cn } from "~/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "heading";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    heading: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        variantStyles[variant],
        className,
      )}
      style={{
        width: width ?? (variant === "heading" ? "60%" : undefined),
        height: height ?? (variant === "text" ? "1rem" : undefined),
      }}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="heading" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={100} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton variant="circular" width={48} height={48} />
              <Skeleton variant="text" width={60} height={20} />
            </div>
            <Skeleton variant="heading" width="50%" />
            <Skeleton variant="text" width="80%" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-100 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === 0 ? 120 : "100%"} />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <Skeleton variant="heading" width="30%" />
      <div className="space-y-4">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
      </div>
      <div className="flex justify-end space-x-4">
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </div>
    </div>
  );
}
