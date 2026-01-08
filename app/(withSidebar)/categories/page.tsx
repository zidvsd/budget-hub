"use client";

import { BreadCrumb } from "@/components/client/BreadCrumb";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/store/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { upperCaseFirstLetter } from "@/lib/utils";
import categories from "@/lib/json/categories.json";
import { BreadCrumbLink } from "@/components/client/BreadCrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CategoriesPage() {
  const { products, loading } = useProducts();

  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam =
    searchParams.get("category") || "all Products".toLowerCase();

  const [category, setCategory] = useState(categoryParam);

  const selectedCategory = categories.find(
    (c) => c.slug.toLowerCase() === categoryParam
  );

  const breadcrumbLinks: BreadCrumbLink[] = [
    { label: "Categories", href: "/categories" },
  ];

  if (category !== "all-products" && selectedCategory) {
    breadcrumbLinks.push({ label: selectedCategory.name });
  }

  useEffect(() => {
    setCategory(categoryParam.toLowerCase());
  }, [categoryParam]);

  const handleCategoryChange = (newCategory: string) => {
    // If 'all Products' clicked, clear query param, else set it
    const url =
      newCategory === "all Products"
        ? "/categories"
        : `/categories?category=${newCategory}`;
    router.push(url);
  };
  // Find the description from categories.json
  const categoryInfo =
    category === "all Products"
      ? { description: "Browse all available products." }
      : categories.find((c) => c.name === category);

  // Filter products (compare lowercase)
  const filteredProducts = products.filter(
    (p) => category === "all products" || p.category.toLowerCase() === category
  );

  return (
    <div className="custom-container pt-12">
      <BreadCrumb links={breadcrumbLinks} />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{upperCaseFirstLetter(category)}</h1>
        {/* Category description */}
        <span className="text-gray-600">{categoryInfo?.description}</span>
      </div>
      {/* Dropdown for categories */}
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 border rounded-md mt-4">
          {selectedCategory?.name || "All Products"} {/* display name */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {/* First, "All Products" */}
          <DropdownMenuItem
            key="all-products"
            onClick={() => handleCategoryChange("all-products")} // slug, lowercase
            className="cursor-pointer"
          >
            All Products
          </DropdownMenuItem>

          {/* Map categories from JSON */}
          {categories.map((c) => (
            <DropdownMenuItem
              key={c.slug}
              onClick={() => handleCategoryChange(c.slug)} // slug, lowercase
              className="cursor-pointer"
            >
              {c.name} {/* display name */}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Products section */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))
          : products
              .filter(
                (p) => category === "all Products" || p.category === category
              )
              .map((p) => (
                <div
                  key={p.id}
                  className="p-4 border rounded-lg hover:shadow-md"
                >
                  <h2 className="font-bold">{p.name}</h2>
                  <p>{p.description}</p>
                </div>
              ))}
      </div>
    </div>
  );
}
