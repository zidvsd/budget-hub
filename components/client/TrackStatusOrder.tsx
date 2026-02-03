"use client";

import { ShoppingBag, Package, Truck, CircleX } from "lucide-react";

interface TrackStatusOrderProps {
  status: string;
}

export default function TrackStatusOrder({ status }: TrackStatusOrderProps) {
  const isCancelled = status?.toLowerCase() === "cancelled";

  const steps = [
    {
      id: "pending",
      label: "Order Placed",
      icon: ShoppingBag,
      msg: "Your order has been received and is awaiting processing.",
    },
    {
      id: isCancelled ? "cancelled" : "processing",
      label: isCancelled ? "Cancelled" : "Processing",
      icon: isCancelled ? CircleX : Package,
      msg: isCancelled
        ? "This order has been cancelled and will not be fulfilled."
        : "We are currently preparing your items for shipment.",
    },
    {
      id: "completed",
      label: "Delivered",
      icon: Truck,
      msg: "Your order has been delivered successfully!",
    },
  ];

  const currentStepIndex = steps.findIndex(
    (s) => s.id === status?.toLowerCase(),
  );
  const effectiveIndex = isCancelled ? 1 : currentStepIndex;
  const activeStep = steps[effectiveIndex] || steps[0];

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 text-foreground shadow-sm transition-colors">
      <div className="relative mb-10">
        {/* Progress Line Container */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-[22px] z-0">
          {/* FIXED: Background Line 
              Now uses a faint destructive red when cancelled to stay consistent 
          */}
          <div
            className={`w-full h-full rounded-full transition-colors duration-500 ${
              isCancelled ? "bg-destructive/30" : "bg-muted"
            }`}
          />

          {/* Active/Cancelled Solid Line */}
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-in-out ${
              isCancelled ? "bg-destructive" : "bg-accent"
            }`}
            style={{
              width: `${(Math.max(0, effectiveIndex) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="relative flex justify-between items-start max-w-full mx-auto z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === effectiveIndex;
            const isCompleted = index < effectiveIndex;

            let iconStyles = "";
            let textStyles = "";

            if (isCancelled) {
              if (index <= effectiveIndex) {
                // Red theme for Placed and Cancelled
                iconStyles = isActive
                  ? "bg-destructive text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] scale-110"
                  : "bg-destructive/40 text-white";
                textStyles = "text-destructive ";
              } else {
                // Consistency for Delivered tab: Faded destructive red
                iconStyles =
                  "bg-destructive/10 text-destructive/30 border border-destructive/20";
                textStyles = "text-destructive/40 italic";
              }
            } else {
              // Standard Active/Completed/Pending logic
              iconStyles = isActive
                ? "bg-accent text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-110"
                : isCompleted
                  ? "bg-accent text-white opacity-80"
                  : "bg-muted text-muted-foreground";
              textStyles = isActive
                ? "text-foreground font-bold"
                : "text-muted-foreground opacity-60";
            }

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-3 w-20 md:w-32"
              >
                <div
                  className={`p-3 rounded-full transition-all duration-500 flex items-center justify-center ${iconStyles}`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <span
                  className={`text-xs md:text-sm text-center transition-colors ${textStyles}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Box */}
      <div
        className={`rounded-lg p-4 text-center border transition-all ${
          isCancelled
            ? "bg-destructive/10 border-destructive/20"
            : "bg-accent/5 border-accent/10"
        }`}
      >
        <p
          className={`${isCancelled ? "text-destructive" : "text-accent"} text-sm md:text-base font-semibold`}
        >
          {activeStep.msg}
        </p>
      </div>
    </div>
  );
}
