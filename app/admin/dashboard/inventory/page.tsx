"use client";

import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./data-table";
import { toast } from "sonner";

export default function page() {
  const { fetchProducts, products, loading } = useProducts();
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("failed to delete");
      }
      toast.success("Item deleted successfully");

      await fetchProducts();
    } catch (error) {
      toast.error("Failed to delete item");

      console.log(error);
    }
  }
  useEffect(() => {
    fetchProducts(); // fetch products when component mounts
  }, []);

  return (
    <div className="w-full ">
      {loading ? (
        <div className="flex flex-col gap-2 items-start">
          <Skeleton className=" w-92 h-18 rounded-md animate-pulse" />
          <Skeleton className=" w-48 h-16 rounded-md animate-pulse" />
          <Skeleton className=" w-92 h-14 rounded-md animate-pulse" />
        </div>
      ) : (
        <>
          <h1 className="page-heading">Inventory Management</h1>
          <p className="page-subheading">Manage products and stock levels</p>
        </>
      )}

      <div className="mt-8">
        {loading ? (
          <Skeleton className=" w-full h-42 rounded-md animate-pulse" />
        ) : (
          <DataTable
            data={products}
            columns={columns}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
