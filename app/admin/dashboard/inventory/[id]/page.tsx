"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/types/products";

export default function Page() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSingleProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product data.");

      const resData = await res.json();
      setProduct(resData.data); // <-- match your API response
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) fetchSingleProduct(productId);
  }, [productId, fetchSingleProduct]);

  if (loading)
    return <div className="custom-container">Loading product details...</div>;
  if (error)
    return <div className="custom-container text-red-500">Error: {error}</div>;
  if (!product)
    return <div className="custom-container">Product not found.</div>;

  return (
    <div className="custom-container">
      <h1 className="text-2xl font-bold mb-4">Edit {product.name}</h1>
      <p>Product ID: {product.id}</p>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      {/* Add your editing form components here */}
    </div>
  );
}
