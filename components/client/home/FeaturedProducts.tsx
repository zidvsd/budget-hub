"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";

export default function FeaturedProducts() {
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return (
    <section className="bg-sidebar dark:bg-muted py-16">
      <div className="custom-container">
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="text-3xl font-bold ">Top Selling Products</h1>
            <span className="text-xl text-neutral-500 dark:text-neutral-400">
              Discover the gadgets our customers love the most
            </span>
          </div>
          <Link className="hidden md:block" href={"/categories"}>
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
