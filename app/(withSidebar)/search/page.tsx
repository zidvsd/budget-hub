"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/store/useProducts";
import { BreadCrumb } from "@/components/client/BreadCrumb";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/client/ProductCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => {
    fetchProducts(query || undefined);
  }, [fetchProducts, query]);

  return (
    <div className="custom-container mt-8">
      {/* Breadcrumb */}
      <BreadCrumb />
      {/* Heading */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <span className="text-sm text-neutral-600">
          {query
            ? `Showing results matching "${query}"`
            : "Showing all available products"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {loading
          ? // Show 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, i) => (
              <ProductCard key={i} loading />
            ))
          : // Render actual products
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}
