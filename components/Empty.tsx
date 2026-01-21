import * as LucideIcon from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

type EmptyStateProps = {
  icon?: React.ElementType; // Optional icon
  title?: string; // Optional custom title
  description?: string; // Optional custom description
};

export function EmptyState({
  icon: Icon = LucideIcon.Box,
  title = "No Products Found",
  description = "Try adding more products.",
}: EmptyStateProps) {
  return (
    <Empty className="min-h-screen">
      <EmptyHeader>
        <EmptyMedia variant="default">
          {Icon && (
            <Icon className="size-24 text-muted-foreground rounded-full bg-sidebar p-6" />
          )}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
