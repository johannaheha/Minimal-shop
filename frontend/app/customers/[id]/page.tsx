"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  email: string;
  orderIds?: string[];
};

const API_BASE_URL = "http://localhost:3000";

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/customers/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch customer: ${res.status}`);
        }
        const data: Customer = await res.json();
        setCustomer(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error while fetching customer");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading customer...</p>
      </main>
    );
  }

  if (error || !customer) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow p-6 space-y-3 max-w-md w-full text-center">
          <p className="text-sm text-red-700">
            {error ?? "Customer not found"}
          </p>
          <Link
            href="/customers"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to customers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
          <Link
            href="/customers"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to customers
          </Link>
        </header>

        <div className="space-y-2">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Email:</span> {customer.email}
          </p>

          {customer.orderIds && customer.orderIds.length > 0 && (
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Orders:</span>{" "}
              {customer.orderIds.join(", ")}
            </p>
          )}
        </div>

        <div className="text-xs text-slate-500 space-y-1 break-all">
          <p>
            <span className="font-semibold">ID:</span> {customer.id}
          </p>
        </div>
      </div>
    </main>
  );
}
