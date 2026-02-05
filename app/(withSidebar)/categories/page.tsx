"use client";

import { BreadCrumb } from "@/components/client/BreadCrumb";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/store/useProducts";
import { upperCaseFirstLetter } from "@/lib/utils";
import categories from "@/lib/json/categories.json";
import { BreadCrumbLink } from "@/components/client/BreadCrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from "@/components/client/ProductCard";
import { ChevronDown, X, Funnel } from "lucide-react";
import { EmptyState } from "@/components/Empty";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";
export default function CategoriesPage() {
  const { products, loading, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") || "all-products";

  const [category, setCategory] = useState(categoryParam);
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "low" | "out">(
    "all",
  );
  const [sortOption, setSortOption] = useState<
    "a-z" | "price-asc" | "price-desc" | "stock-desc"
  >("a-z");
  const [filters, setFilters] = useState(false);
  const selectedCategory = categories.find(
    (c) => c.slug.toLowerCase() === categoryParam,
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
    setCategory(newCategory);
    const url =
      newCategory === "all-products"
        ? "/categories"
        : `/categories?category=${newCategory}`;
    router.push(url);
  };

  const handleStockChange = (option: "all" | "in" | "low" | "out") => {
    setStockFilter(option);
  };

  const handleSortChange = (
    option: "a-z" | "price-asc" | "price-desc" | "stock-desc",
  ) => {
    setSortOption(option);
  };

  const categoryInfo =
    category === "all-products"
      ? { description: "Browse all available products." }
      : categories.find((c) => c.slug === category);

  const categoryDisplay =
    category === "all-products"
      ? "All Products"
      : categories.find((c) => c.slug === category)?.name || category;

  const normalizedCategory = category.replace("-", " ");

  // Filter by category
  let filteredProducts = products.filter(
    (p) =>
      normalizedCategory === "all products" ||
      p.category.toLowerCase() === category,
  );

  // Filter by stock
  filteredProducts = filteredProducts.filter((p) => {
    if (stockFilter === "all") return true;
    if (stockFilter === "in") return p.stock > 10;
    if (stockFilter === "low") return p.stock > 0 && p.stock <= 10;
    if (stockFilter === "out") return p.stock === 0;
    return true;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortOption) {
      case "a-z":
        return a.name.localeCompare(b.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "stock-desc":
        return b.stock - a.stock;
      default:
        return 0;
    }
  });

  const totalProducts = filteredProducts.length;

  const handleClearFilter = () => {
    setCategory("all-products");
    setStockFilter("all");
    setSortOption("a-z");
    router.push("/categories"); // reset URL to default
  };

  return (
    <div className="custom-container pt-8 pb-12">
      <BreadCrumb links={breadcrumbLinks} />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">
          {upperCaseFirstLetter(categoryDisplay)}
        </h1>
        <span className="text-gray-600">{categoryInfo?.description}</span>
      </div>

      <div className="w-full md:w-fit flex items-center justify-between mt-4">
        <div className="flex flex-col  items-center justify-between w-full gap-4 md:flex-row md:justify-start">
          <div className="w-full flex items-center justify-between">
            <span className="text-muted-foreground">
              {totalProducts} Products
            </span>
            {/* Filters toggle button - visible only on sm -> md screens */}
            <div className=" md:hidden">
              <Button
                variant={"outline"}
                className="flex items-center gap-2 px-4 py-2 border rounded-md "
                onClick={() => setFilters(!filters)}
              >
                <Funnel className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    filters ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Filters shown on small->md when toggled */}
          {filters && (
            <div className="flex md:hidden items-center w-full gap-4">
              {/* Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className=" px-4 py-2 border rounded-md flex items-center justify-between whitespace-nowrap cursor-pointer ">
                  <span>
                    {category === "all-products"
                      ? "All Products"
                      : categories.find((c) => c.slug === category)?.name}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem
                    key="all-products"
                    onClick={() => handleCategoryChange("all-products")}
                    className="cursor-pointer"
                  >
                    All Products
                  </DropdownMenuItem>
                  {categories.map((c) => (
                    <DropdownMenuItem
                      key={c.slug}
                      onClick={() => handleCategoryChange(c.slug)}
                      className="cursor-pointer"
                    >
                      {c.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Stock Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 border cursor-pointer rounded-md flex items-center justify-between whitespace-nowrap">
                  <span>
                    {stockFilter === "all"
                      ? "All Stock"
                      : stockFilter === "in"
                        ? "In Stock"
                        : stockFilter === "low"
                          ? "Low Stock"
                          : "Out of Stock"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleStockChange("all")}
                    className="cursor-pointer"
                  >
                    All Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStockChange("in")}
                    className="cursor-pointer"
                  >
                    In Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStockChange("low")}
                    className="cursor-pointer"
                  >
                    Low Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStockChange("out")}
                    className="cursor-pointer"
                  >
                    Out of Stock
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 border cursor-pointer rounded-md flex items-center justify-between whitespace-nowrap">
                  <span>
                    {sortOption === "a-z"
                      ? "A-Z"
                      : sortOption === "price-asc"
                        ? "Price: Low → High"
                        : sortOption === "price-desc"
                          ? "Price: High → Low"
                          : "Stock: High → Low"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleSortChange("a-z")}
                    className="cursor-pointer"
                  >
                    A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("price-asc")}
                    className="cursor-pointer"
                  >
                    Price: Low → High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("price-desc")}
                    className="cursor-pointer"
                  >
                    Price: High → Low
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("stock-desc")}
                    className="cursor-pointer"
                  >
                    Stock: High → Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Desktop (md+) - always visible filters */}
          <div className="hidden md:flex items-center gap-4">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 border rounded-md flex items-center  justify-between whitespace-nowrap cursor-pointer">
                <span>
                  {category === "all-products"
                    ? "All Products"
                    : categories.find((c) => c.slug === category)?.name}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                  key="all-products"
                  onClick={() => handleCategoryChange("all-products")}
                  className="cursor-pointer"
                >
                  All Products
                </DropdownMenuItem>
                {categories.map((c) => (
                  <DropdownMenuItem
                    key={c.slug}
                    onClick={() => handleCategoryChange(c.slug)}
                    className="cursor-pointer"
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stock Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 border rounded-md flex items-center justify-between whitespace-nowrap cursor-pointer">
                <span>
                  {stockFilter === "all"
                    ? "All Stock"
                    : stockFilter === "in"
                      ? "In Stock"
                      : stockFilter === "low"
                        ? "Low Stock"
                        : "Out of Stock"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                  onClick={() => handleStockChange("all")}
                  className="cursor-pointer"
                >
                  All Stock
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStockChange("in")}
                  className="cursor-pointer"
                >
                  In Stock
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStockChange("low")}
                  className="cursor-pointer"
                >
                  Low Stock
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStockChange("out")}
                  className="cursor-pointer"
                >
                  Out of Stock
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 nowrap py-2 border rounded-md flex items-center justify-between whitespace-nowrap cursor-pointer">
                <span>
                  {sortOption === "a-z"
                    ? "A-Z"
                    : sortOption === "price-asc"
                      ? "Price: Low → High"
                      : sortOption === "price-desc"
                        ? "Price: High → Low"
                        : "Stock: High → Low"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                  onClick={() => handleSortChange("a-z")}
                  className="cursor-pointer"
                >
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("price-asc")}
                  className="cursor-pointer"
                >
                  Price: Low → High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("price-desc")}
                  className="cursor-pointer"
                >
                  Price: High → Low
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("stock-desc")}
                  className="cursor-pointer"
                >
                  Stock: High → Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Active filters tab */}
      {(category !== "all-products" ||
        stockFilter !== "all" ||
        sortOption !== "a-z") && (
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-muted-foreground">Active Filters:</span>

          {category !== "all-products" && (
            <button
              className="px-2 bg-muted rounded-full py-1 flex items-center gap-2 cursor-pointer  hover-utility  hover:bg-muted/40 text-sm"
              onClick={() => handleCategoryChange("all-products")}
            >
              {categories.find((c) => c.slug === category)?.name || category}
              <X className="size-4" />
            </button>
          )}

          {stockFilter !== "all" && (
            <button
              className="px-2 bg-muted rounded-full py-1 flex items-center gap-2 cursor-pointer  hover-utility  hover:bg-muted/40 text-sm"
              onClick={() => handleStockChange("all")}
            >
              {stockFilter === "in"
                ? "In Stock"
                : stockFilter === "low"
                  ? "Low Stock"
                  : "Out of Stock"}
              <X className="size-4" />
            </button>
          )}

          {sortOption !== "a-z" && (
            <button
              className="px-2 bg-muted rounded-full py-1 flex items-center gap-2 cursor-pointer  hover-utility  hover:bg-muted/40 text-sm"
              onClick={() => handleSortChange("a-z")}
            >
              {sortOption === "price-asc"
                ? "Price: Low → High"
                : sortOption === "price-desc"
                  ? "Price: High → Low"
                  : "Stock: High → Low"}
              <X className="size-4" />
            </button>
          )}

          <button
            className="px-2 py-1 rounded-full cursor-pointer bg-destructive/20 hover-utility text-destructive hover:bg-destructive/40 text-sm"
            onClick={handleClearFilter}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Products Section */}
      <div className="mt-6 border-t pt-6">
        {loading ? (
          /* Skeletons appear in a static grid (no stagger) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCard key={i} loading />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          /* StaggerContainer handles the waterfall entrance */
          <StaggerContainer key={`${category}-${stockFilter}-${sortOption}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="No Products Found"
              description="Try adjusting your filters or adding new products."
            />
          </div>
        )}
      </div>
    </div>
  );
}
