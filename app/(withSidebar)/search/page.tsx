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
import { Product } from "@/lib/types/products";
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [searchTerm, setSearchTerm] = useState(queryParam);

  const { products, fetchProducts, loading } = useProducts();

  const filteredProducts: Product[] = queryParam
    ? products.filter((product) =>
        product.name.toLowerCase().includes(queryParam.toLowerCase().trim()),
      )
    : products;
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

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
      {!loading && filteredProducts.length === 0 && (
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
          : filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}
