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
    <div className="product-card group relative">
      {/* <-- add relative here */}
      {product.is_featured && (
        <span className="absolute top-4 left-4 rounded-full px-2 py-1 text-xs font-bold bg-accent text-white shadow-md z-5">
          Featured
        </span>
      )}
      {/* Image */}
      <div className="product-card-image relative cursor-pointer">
        <Image
          src={product.image_path || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Full image overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Buttons at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant={"accent"}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-accent/90"
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
            <Button className="w-full h-full p-0 flex items-center justify-center border bg-white text-gray-700 hover:bg-gray-200">
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
