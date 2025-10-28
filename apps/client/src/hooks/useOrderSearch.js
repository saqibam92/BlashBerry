// File: apps/client/src/hooks/useOrderSearch.js

import { useState, useEffect } from "react";
import { getOrdersByPhone } from "@/lib/orderApi";
import toast from "react-hot-toast";

export function useOrderSearch(debouncedPhone) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedPhone) {
      setOrders([]);
      return;
    }

    const phoneRegex = /^(\+8801\d{9}|01\d{9})$/;
    if (!phoneRegex.test(debouncedPhone)) {
      setError("Invalid phone format");
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    getOrdersByPhone(debouncedPhone)
      .then((res) => {
        const list = res.data.data || [];
        setOrders(list);
        if (list.length === 0) {
          toast("No orders found");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Failed to fetch orders";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [debouncedPhone]);

  return { orders, loading, error, setOrders };
}
