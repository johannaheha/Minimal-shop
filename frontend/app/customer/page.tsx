"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  orderIds?: string[];
};

const API_BASE_URL = "http://localhost:3000";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderIdsInput, setOrderIdsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/customers`);
        if (!res.ok) {
          throw new Error(`Failed to fetch customers: ${res.status}`);
        }
        const data: Customer[] = await res.json();
        setCustomers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error while fetching customers");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const orderIds =
      orderIdsInput.trim().length > 0
        ? orderIdsInput
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
        : undefined;

    try {
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          orderIds,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create customer: ${res.status}`);
      }

      const created: Customer = await res.json();

      setCustomers((prev) => [...prev, created]);
      setName("");
      setEmail("");
      setOrderIdsInput("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error while creating customer");
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
            Minimal Shop – Customers
          </h1>
          <Link
            href="/"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to products
          </Link>
        </header>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Add a new customer
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
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Order IDs (comma separated, optional)
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={orderIdsInput}
                onChange={(event) => setOrderIdsInput(event.target.value)}
                placeholder="e.g. order-1, order-2"
              />
              <p className="text-xs text-slate-500">
                For now just free text – later can be real order UUIDs.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Add customer"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Customers</h2>

          {isLoading ? (
            <p className="text-sm text-slate-600">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="text-sm text-slate-600">No customers yet.</p>
          ) : (
            <ul className="space-y-3">
              {customers.map((customer) => (
                <li
                  key={customer.id}
                  className="bg-white rounded-xl shadow p-4 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {customer.name}
                    </h3>
                    <span className="text-sm text-slate-700">
                      {customer.email}
                    </span>
                  </div>
                  {customer.orderIds && customer.orderIds.length > 0 && (
                    <p className="text-xs text-slate-600">
                      Orders: {customer.orderIds.join(", ")}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    ID: {customer.id}
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
