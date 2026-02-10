"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface ProcessingOverlayProps {
  isOpen: boolean;
}

export function ProcessingOverlay({ isOpen }: ProcessingOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        // Prevent closing by clicking outside or pressing escape
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[425px] flex flex-col items-center justify-center py-10 gap-6 border-none bg-card shadow-2xl"
      >
        <DialogHeader className="items-center text-center">
          <div className="bg-accent/10 p-4 rounded-full mb-2">
            <Spinner className="h-10 w-10 text-accent animate-spin" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Finalizing Order
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Please hold on while we secure your items.
            <br />
            This usually takes just a few seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full max-w-[200px] h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent animate-progress-loading" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
