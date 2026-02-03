"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const { products, fetchProducts, loading } = useProducts();
  const relatedProducts = products
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 6);

  if (relatedProducts.length === 0) return null;

  const router = useRouter();

  return (
    <section>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Related Products</h1>
            <span className="text-xl text-neutral-500 dark:text-neutral-400">
              Browse other related products
            </span>
          </div>
          <Link className="hidden md:block" href="/categories">
            <Button className="flex items-center gap-2" variant="ghost">
              View All
              <ArrowRight />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCard key={i} loading />
              ))
            : relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
