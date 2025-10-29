// apps/client/src/components/home/Newsletter.jsx

"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Integrate with backend (e.g., api.post("/api/newsletter", { email }))
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <section className="py-12 bg-primary-600 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Join our newsletter</h2>
        <p className="text-xl mb-8">For latest updates, discount & offers</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-white text-primary-600 rounded-md hover:bg-gray-100 transition-colors font-semibold"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
