"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
export default function FeaturedProducts() {
  return (
    <section className="bg-sidebar">
      <div className="custom-container">
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="text-3xl font-bold ">Top Selling Products</h1>
            <span className="text-xl text-neutral-500 dark:text-neutral-400">
              Discover the gadgets our customers love the most
            </span>
          </div>
          <Link href={"/categories"}>
            <Button className="flex items-center gap-2 " variant={"ghost"}>
              View All
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
