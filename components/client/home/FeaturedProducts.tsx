"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FeaturedProducts() {
  const { products, fetchProducts } = useProducts();
  const featuredProducts = products.filter((p) => p.is_featured);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleAddToCart(productId: string) {
    // TODO: Implement add to cart logic
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
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative block rounded-xl bg-white dark:bg-card shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Featured Badge */}
              <span className="absolute z-20 top-4 left-4 rounded-full px-2 py-1 text-xs font-bold bg-accent text-white shadow-md">
                Featured
              </span>

              {/* Image */}
              <div
                className="aspect-video w-full overflow-hidden relative cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <Image
                  src={product.image_path || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute w-full bottom-1 px-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 rounded-b-xl">
                  <Button
                    variant={"accent"}
                    className="w-full flex items-center gap-2 hover:bg-accent/90"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigating to product page
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
                    className="text-lg font-semibold text-foreground dark:text-foreground-dark transition-colors duration-300 group-hover:text-accent cursor-pointer"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h2>
                  <span className="text-muted-foreground text-sm ">
                    {product.stock} in stock
                  </span>
                </div>
                <span className="text-accent font-bold text-md">
                  ${product.price.toFixed(2)}
                </span>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
