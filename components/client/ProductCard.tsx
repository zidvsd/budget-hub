"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_path?: string;
    is_featured?: boolean;
  };
  loading?: boolean; // <-- add loading prop
  handleAddToCart?: (productId: string) => void;
}

export default function ProductCard({
  product,
  handleAddToCart,
  loading = false,
}: ProductCardProps) {
  const router = useRouter();

  if (loading || !product) {
    // Skeleton version
    return (
      <div className="product-card group">
        <Skeleton className="h-62 w-full dark:bg-sidebar" /> {/* Image */}
      </div>
    );
  }

  return (
    <div className="product-card group">
      {product.is_featured && (
        <span className="product-card-featured">Featured</span>
      )}

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
              handleAddToCart?.(product.id);
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
          <span className="product-card-stock">{product.stock} in stock</span>
        </div>
        <span className="product-card-price">${product.price.toFixed(2)}</span>
        <p className="product-card-desc">{product.description}</p>
      </div>
    </div>
  );
}
