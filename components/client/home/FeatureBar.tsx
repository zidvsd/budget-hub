"use client";

import { Truck, CreditCard, Headphones, Repeat } from "lucide-react";
import featuresData from "@/lib/json/featuredData.json";

// Map string icon names to actual components
const iconMap: Record<string, any> = {
  Truck,
  CreditCard,
  Headphones,
  Repeat,
};

export default function FeatureBar() {
  return (
    <div className="w-full bg-sidebar py-12 border-b">
      <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-4 place-items-center gap-8 max-w-[1440px] mx-auto">
        {featuresData.map((feature, idx) => {
          const Icon = iconMap[feature.icon];
          return (
            <div key={idx} className="flex items-center  gap-4 ">
              <div className=" rounded-full bg-muted p-2">
                <Icon className="text-accent size-8 p-1  " />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">{feature.title}</span>
                <span className="text-sm text-muted-foreground">
                  {feature.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
