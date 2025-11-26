"use client"; // mark as client component

import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";

export default function ProductsList() {
  const { fetchProducts, products } = useProducts();

  useEffect(() => {
    fetchProducts(); // fetch products when component mounts
  }, [fetchProducts]);

  return (
    <div className="custom-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="mt-2">${product.price}</p>
            <p className="mt-1 text-gray-700">{product.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
