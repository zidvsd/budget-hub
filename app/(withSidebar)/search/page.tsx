"use client";

import { useEffect, useState, useRef } from "react";
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
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";
export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const { products, fetchProducts, loading } = useProducts();
  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (searchTerm.trim() !== queryParam) {
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, router, queryParam]);
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
      <StaggerContainer
        // The key ensures the animation restarts when results change
        key={`${queryParam}-${products.length}`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8"
        inView={false}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCard loading />)
          : filteredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
      </StaggerContainer>
    </div>
  );
}
