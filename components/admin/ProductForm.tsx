"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/store/useProducts";
import { Product } from "@/lib/types/products";
import { toast } from "sonner";
export default function ProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, fetchProducts } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const found = products.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setLoading(false);
    }
  }, [products, id]);

  if (loading || !product) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const updateField = (key: keyof Product, value: any) => {
    setProduct((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!product) return;
    try {
      setSaving(true);

      const payload = {
        ...product,
        price: Number(product?.price) || 0,
        stock: Number(product?.stock) || 0,
        is_active: Boolean(product?.is_active),
      };

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update product");

      toast.success("Product updated successfully");
      router.push(`/admin/dashboard/inventory/${product.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="space-y-1">
        <Label>Name</Label>
        <Input
          value={product.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Price</Label>
          <Input
            type="number"
            value={product.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
          />
        </div>

        <div className="space-y-1">
          <Label>Stock</Label>
          <Input
            type="number"
            value={product.stock}
            onChange={(e) => updateField("stock", e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label>Category</Label>
        <Input
          value={product.category}
          onChange={(e) => updateField("category", e.target.value)}
        />
      </div>

      {/* Image */}
      <div className="space-y-1">
        <Label>Image URL</Label>
        <Input
          value={product.image_path}
          onChange={(e) => updateField("image_path", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea
          rows={4}
          value={product.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label>Product Status</Label>
          <p className="text-sm text-muted-foreground">
            Inactive products won’t appear in the client store
          </p>
        </div>
        <Switch
          checked={product.is_active}
          onCheckedChange={(v) => updateField("is_active", v)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button variant={"accent"} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
