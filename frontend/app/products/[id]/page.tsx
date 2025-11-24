"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

const API_BASE_URL = "http://localhost:3000";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }
        const data: Product = await res.json();
        setProduct(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error while fetching product"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow p-6 space-y-3 max-w-md w-full text-center">
          <p className="text-sm text-red-700">{error ?? "Product not found"}</p>
          <Link
            href="/products"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <Link
            href="/products"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to products
          </Link>
        </header>

        {product.imageUrl && (
          <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {product.description && (
          <p className="text-sm text-slate-700">{product.description}</p>
        )}

        <p className="text-lg font-semibold text-slate-900">
          Price: € {product.price.toFixed(2)}
        </p>

        <div className="text-xs text-slate-500 space-y-1 break-all">
          <p>
            <span className="font-semibold">ID:</span> {product.id}
          </p>
          {product.imageUrl && (
            <p>
              <span className="font-semibold">Image URL:</span>{" "}
              {product.imageUrl}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
