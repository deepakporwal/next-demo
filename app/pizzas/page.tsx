"use client";

import { useEffect, useState } from "react";

const TOKEN_STORAGE_KEY = "demo-auth-token";

type Pizza = {
  id?: number;
  name?: string;
  price?: number;
  ingredients?: string[];
  description?: string;
};

export default function PizzasPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPizzas() {
      try {
        const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

        if (!token) {
          throw new Error("No token found. Please generate a token first.");
        }

        const response = await fetch("http://localhost:5165/pizzas", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            errorText || `Failed to fetch pizzas: ${response.status}`,
          );
        }

        const data = (await response.json()) as Pizza[];
        setPizzas(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load pizzas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPizzas();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Protected endpoint
          </p>
          <h1 className="mt-2 text-4xl font-bold">Pizzas</h1>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Loading pizzas...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">Unable to load pizzas</p>
            <p className="mt-2">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pizzas.map((pizza, index) => (
              <article
                key={pizza.id ?? `${pizza.name ?? "pizza"}-${index}`}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold">{pizza.name ?? "Pizza"}</h2>
                  <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    {pizza.price !== undefined ? `$${pizza.price}` : "N/A"}
                  </span>
                </div>

                {pizza.description ? (
                  <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {pizza.description}
                  </p>
                ) : null}

                {pizza.ingredients && pizza.ingredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pizza.ingredients.map((ingredient, ingredientIndex) => (
                      <span
                        key={`${ingredient}-${ingredientIndex}`}
                        className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
