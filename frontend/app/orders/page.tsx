"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Order = {
  id: string;
  productIds: string[];
  totalPrice: number;
  customerId: string;
};

const API_BASE_URL = "http://localhost:3000";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productIdsInput, setProductIdsInput] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/orders`);
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.status}`);
        }
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error while fetching orders");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const productIds =
      productIdsInput.trim().length > 0
        ? productIdsInput
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
        : [];

    const totalPriceNumber = Number(totalPrice);
    if (Number.isNaN(totalPriceNumber)) {
      setError("Total price must be a number");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds,
          totalPrice: totalPriceNumber,
          customerId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create order: ${res.status}`);
      }

      const created: Order = await res.json();
      setOrders((prev) => [...prev, created]);

      setProductIdsInput("");
      setTotalPrice("");
      setCustomerId("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error while creating order");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Minimal Shop – Orders
          </h1>
          <Link
            href="/"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to Homepage
          </Link>
        </header>

        {/* Formular */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Add a new order
          </h2>

          {error && (
            <div className="rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Product IDs (comma separated)
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={productIdsInput}
                onChange={(e) => setProductIdsInput(e.target.value)}
                placeholder="product-id-1, product-id-2"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Total Price
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Customer ID
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="customer UUID"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Add order"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Orders</h2>

          {isLoading ? (
            <p className="text-sm text-slate-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-slate-600">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="bg-white rounded-xl shadow p-4 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Order {order.id.slice(0, 8)}…
                    </h3>
                    <span className="text-sm font-medium text-slate-800">
                      € {order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 break-all">
                    Product IDs: {order.productIds.join(", ")}
                  </p>
                  <p className="text-xs text-slate-600 break-all">
                    Customer ID: {order.customerId}
                  </p>
                  <p className="text-[11px] text-slate-400 break-all">
                    ID: {order.id}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
