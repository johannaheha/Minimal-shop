"use client";

import { useEffect, useState, FormEvent } from "react";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

const API_BASE_URL = "http://localhost:3000";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error while fetching products"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber)) {
      setError("Price must be a number");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description || null,
          price: priceNumber,
          imageUrl: imageUrl || null,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create product: ${res.status}`);
      }

      const created: Product = await res.json();

      setProducts((prev) => [...prev, created]);

      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Unknown error while creating product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Minimal Shop – Products
        </h1>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Add a new product
          </h2>

          {error && (
            <div className="rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                type="number"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Image URL (optional)
              </label>
              <input
                type="url"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Add product"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Products</h2>

          {isLoading ? (
            <p className="text-sm text-slate-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-slate-600">No products yet.</p>
          ) : (
            <ul className="space-y-3">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="bg-white rounded-xl shadow p-4 flex gap-4"
                >
                  {product.imageUrl && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <span className="text-sm font-medium text-slate-800">
                        € {product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-sm text-slate-600">
                        {product.description}
                      </p>
                    )}
                    {product.imageUrl && (
                      <p className="text-xs text-slate-400 break-all">
                        {product.imageUrl}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      ID: {product.id}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
