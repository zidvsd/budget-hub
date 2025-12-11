import * as LucideIcon from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
type EmptyDemoProps = {
  icon: React.ElementType; // Accept a React component for the icon
};

export function EmptyDemo({ icon: Icon }: EmptyDemoProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Icon className="w-12 h-12 text-muted-foreground" />{" "}
          {/* Render the icon */}
        </EmptyMedia>

        <EmptyTitle>No Products Found</EmptyTitle>
        <EmptyDescription>Try adding more products.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
