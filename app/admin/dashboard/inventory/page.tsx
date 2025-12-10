"use client";

import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
export default function page() {
  const { fetchProducts, products, loading } = useProducts();

  useEffect(() => {
    fetchProducts(); // fetch products when component mounts
  }, []);

  return (
    <div className="w-full ">
      <h1 className="page-heading">Inventory Management</h1>
      <p className="page-subheading">Manage products and stock levels</p>

      <div className="mt-8">
        {loading ? (
          <Skeleton className=" w-full h-42 rounded-md animate-pulse" />
        ) : (
          <DataTable data={products} columns={columns} />
        )}
      </div>
    </div>
  );
}
