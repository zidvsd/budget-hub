"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/store/useProducts";
import { BreadCrumb } from "@/components/client/BreadCrumb";
import ProductCard from "@/components/client/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/Empty";
import { Button } from "@/components/ui/button";
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") ?? "";

  const [searchTerm, setSearchTerm] = useState(queryParam);

  const { products, fetchProducts, loading } = useProducts();

  // Fetch products when the query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchTerm.trim()) return;

      const params = new URLSearchParams();
      params.set("q", searchTerm.trim());
      router.push(`/search?${params.toString()}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler); // cleanup if user types again
  }, [searchTerm, router]);

  return (
    <div className="custom-container mt-8">
      {/* Breadcrumb */}
      <BreadCrumb />

      {/* Page Search bar for mobile */}
      <div className="mt-4 block md:hidden">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Heading */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <span className="text-sm text-neutral-600">
          {queryParam
            ? `Showing results matching "${queryParam}"`
            : "Showing all available products"}
        </span>
      </div>

      {/* Empty state if no results */}
      {!loading && products.length === 0 && (
        <div className="w-full items-center justify-center flex flex-col">
          <EmptyState
            icon={Search}
            title="No results found"
            description={
              queryParam
                ? `We couldn't find any products matching "${queryParam}". Try different keywords or browse our categories.`
                : "We couldn't find any products. Try browsing our categories."
            }
          />
          <Link href="/categories" className="self-center ">
            <Button variant={"accent"}> Browse Categories</Button>
          </Link>
        </div>
      )}
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ProductCard key={i} loading />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}
