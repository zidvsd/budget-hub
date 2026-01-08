"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
export default function FeaturedProducts() {
  const { products, fetchProducts, loading } = useProducts();
  const featuredProducts = products.filter((p) => p.is_featured);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const router = useRouter();

  function handleAddToCart(productId: string) {
    console.log("Add to cart:", productId);
  }

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
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="group relative block rounded-xl bg-white dark:bg-card shadow-md overflow-hidden"
                >
                  <Skeleton className="h-62 w-full dark:bg-sidebar" />{" "}
                  {/* Image */}
                </div>
              ))
            : // Render actual products
              featuredProducts.map((product) => (
                <div key={product.id} className=" product-card group">
                  {/* Featured Badge */}
                  <span className="product-card-featured">Featured</span>

                  {/* Image */}
                  <div
                    className="product-card-image"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <Image
                      src={product.image_path || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Hover overlay */}
                    <div className="product-card-hover">
                      <Button
                        variant={"accent"}
                        className="w-full flex items-center gap-2 hover:bg-accent/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                      >
                        <ShoppingCart className="size-4" />
                        Add to Cart
                      </Button>

                      <Link
                        href={`/products/${product.id}`}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                      >
                        <Button className="w-full h-full p-0 flex items-center justify-center border bg-white dark:bg-sidebar text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-sidebar/90">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h2
                        className="product-card-title"
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h2>
                      <span className="product-card-stock">
                        {product.stock} in stock
                      </span>
                    </div>
                    <span className="product-card-price">
                      ${product.price.toFixed(2)}
                    </span>
                    <p className="product-card-desc">{product.description}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
