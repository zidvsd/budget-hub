"use client";

import { BreadCrumb } from "@/components/client/BreadCrumb";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/store/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { upperCaseFirstLetter } from "@/lib/utils";
import categories from "@/lib/json/categories.json";
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

  const categoryParam = searchParams.get("category") || "all Products";
  const [category, setCategory] = useState(categoryParam);

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);

    // Update URL: remove query if "all Products", otherwise set ?category=
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

  return (
    <div className="custom-container pt-12">
      <BreadCrumb />

      <div className="mt-4">
        <h1 className="text-2xl font-bold">{upperCaseFirstLetter(category)}</h1>
        {/* Category description */}
        <span className="text-gray-600">{categoryInfo?.description}</span>
      </div>

      {/* Dropdown for categories */}
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 border rounded-md mt-4">
          {upperCaseFirstLetter(category)}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {["all Products", ...categories.map((c) => c.name)].map((cat) => (
            <DropdownMenuItem
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="cursor-pointer"
            >
              {upperCaseFirstLetter(cat)}
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
