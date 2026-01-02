import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-neutral-500 dark:bg-muted animate-pulse rounded",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
