"use client";

import {
  Cpu,
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Camera,
  Package,
} from "lucide-react";
import categories from "@/lib/json/categories.json";
import Link from "next/link";

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
    <section id="categories" className="custom-container py-32">
      <h1 className="text-3xl font-bold mb-2">Browse Categories</h1>
      <span className="text-xl text-neutral-500 dark:text-neutral-400">
        Find exactly what you're looking for
      </span>

      <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] ?? Package;
          return (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="flex flex-col items-center justify-center gap-2 bg-muted rounded-lg h-32 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Icon className="h-8 w-8 text-accent" />
                <span className="font-medium">{category.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
