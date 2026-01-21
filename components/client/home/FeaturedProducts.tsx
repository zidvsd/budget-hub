"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "../ProductCard";
export default function FeaturedProducts() {
  const { products, fetchProducts, loading } = useProducts();
  console.log(products);
  const featuredProducts = products.filter((p) => p.is_featured);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const router = useRouter();

  return (
    <section className="bg-sidebar dark:bg-muted py-16">
      <div className="custom-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Featured Products</h1>
            <span className="text-xl text-neutral-500 dark:text-neutral-400">
              Our top picks just for you
            </span>
          </div>
          <Link className="hidden md:block" href="/categories">
            <Button className="flex items-center gap-2" variant="ghost">
              View All
              <ArrowRight />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {loading
            ? // Show 6 skeleton cards while loading
              Array.from({ length: 6 }).map((_, i) => (
                <ProductCard key={i} loading />
              ))
            : // Render actual products
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
