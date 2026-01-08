"use client";

import * as React from "react";
import Link from "next/link";
import {
  Cpu,
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Camera,
  Package,
  ArrowRight,
} from "lucide-react";

import categories from "@/lib/json/categories.json";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Map icon string to actual Lucide icon component
const iconMap: Record<string, any> = {
  Cpu,
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Camera,
  Package,
};

export default function Categories() {
  return (
    <section id="categories" className="py-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Categories</h1>
          <span className="text-xl text-neutral-500 dark:text-neutral-400">
            Find exactly what you're looking for
          </span>
        </div>

        <Link className="hidden md:block" href="/categories">
          <Button variant="ghost" className="flex items-center gap-2">
            View All <ArrowRight />
          </Button>
        </Link>
      </div>

      {/* Carousel */}
      <div className="mt-8">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {categories.map((category) => {
              const Icon = iconMap[category.icon] ?? Package;

              return (
                <CarouselItem
                  key={category.slug}
                  className="
        basis-1/2
        sm:basis-1/3
        md:basis-1/4
        lg:basis-1/5
      "
                >
                  <Link
                    // Updated href with query param instead of slug path
                    href={`/categories?category=${category.slug}`}
                    className="group hover-utility relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl
          bg-linear-to-br from-muted/80 to-muted/50
          shadow-md hover:shadow-xl hover:scale-105
          transition-transform duration-300 cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Icon className="size-8 text-accent group-hover:text-accent-dark transition-colors" />
                    </div>

                    {/* Name */}
                    <span className="font-semibold text-center text-lg">
                      {category.name}
                    </span>

                    {/* Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-linear-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Arrows (hidden on mobile if you want) */}
          <CarouselPrevious className="hidden xl:flex" />
          <CarouselNext className="hidden xl:flex" />
        </Carousel>
      </div>

      {/* Mobile View All */}
      <div className="md:hidden w-full flex justify-center mt-6">
        <Link href="/categories">
          <Button variant="accent">View All Categories</Button>
        </Link>
      </div>
    </section>
  );
}
