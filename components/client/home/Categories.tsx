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
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    <section id="categories" className=" py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">Browse Categories</h1>
          <span className="text-xl text-neutral-500 dark:text-neutral-400">
            Find exactly what you're looking for
          </span>
        </div>
        <Link className="hidden md:block" href={"/categories"}>
          <Button className="flex items-center gap-2 " variant={"ghost"}>
            View All
            <ArrowRight />
          </Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto md:overflow-x-visible scrollbar-none">
        <ul className="flex md:grid md:grid-cols-2 sm:grid-cols-3  gap-6 min-w-max">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] ?? Package;
            return (
              <li key={category.slug} className="shrink-0 md:flex-shrink-auto">
                <Link
                  href={`/categories/${category.slug}`}
                  className="group hover-utility relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-linear-to-br from-muted/80 to-muted/50 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  {/* Floating Icon */}
                  <div className="p-3 hover-utility rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon className="size-8 text-accent group-hover:text-accent-dark transition-colors duration-300" />
                  </div>

                  {/* Category Name */}
                  <span className="font-semibold text-center text-lg text-foreground group-hover:text-accent-dark transition-colors duration-300">
                    {category.name}
                  </span>

                  {/* overlay */}
                  <div className="hover-utility absolute inset-0 rounded-xl bg-linear-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="md:hidden w-full flex justify-center mt-6 items-center ">
        <Link href={"/categories"}>
          <Button variant={"accent"} className="self-center w-fit">
            View All Categories
          </Button>
        </Link>
      </div>
    </section>
  );
}
