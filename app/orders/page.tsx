"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";

const statusColor: Record<Order["status"], string> = {
  PENDING: "text-muted",
  CONFIRMED: "text-primary",
  SHIPPED: "text-accent",
  DELIVERED: "text-success",
  CANCELLED: "text-error",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      api
        .get<Order[]>("/orders")
        .then((res) => setOrders(res.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-muted">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold mb-6">My orders</h1>

      {error && <p className="text-error text-sm mb-4">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-muted">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface border border-border rounded-lg p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono text-xs text-muted">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-medium ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="receipt-dash pt-3 space-y-1">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-dash mt-2 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="font-mono">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
