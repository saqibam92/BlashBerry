//  File: apps/client/src/hooks/useRecentSearches.js
import { useState, useEffect } from "react";

const RECENT_KEY = "orderRecentPhones";
const MAX_RECENT = 5;

export function useRecentSearches() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const add = (phone) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p !== phone);
      const updated = [phone, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const remove = (phone) => {
    setRecent((prev) => {
      const updated = prev.filter((p) => p !== phone);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recent, add, remove };
}
