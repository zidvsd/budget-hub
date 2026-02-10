import { ReactNode } from "react";

interface DetailBoxProps {
  label: string;
  icon: ReactNode;
  value?: string;
}

export function DetailBox({ label, icon, value }: DetailBoxProps) {
  return (
    <div className="space-y-1">
      <span className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2 font-medium text-sm md:text-base">
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className="truncate">{value || "Not Provided"}</span>
      </div>
    </div>
  );
}
