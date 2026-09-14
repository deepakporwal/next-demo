"use client";

import { useState } from "react";

type LoginResponse = {
  token?: string;
  accessToken?: string;
  message?: string;
};

const TOKEN_STORAGE_KEY = "demo-auth-token";

export default function LoginCard() {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(TOKEN_STORAGE_KEY) || "";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateToken = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5165/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "admin",
          password: "password",
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      const generatedToken = data.token || data.accessToken || "";

      if (!generatedToken) {
        throw new Error("No token returned from the login endpoint.");
      }

      setToken(generatedToken);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, generatedToken);
      }
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Something went wrong while generating the token.",
      );
      setToken("");

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Authentication
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Login</h2>
      </div>

      <button
        type="button"
        onClick={handleGenerateToken}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-base font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {loading ? "Generating token..." : "Generate token"}
      </button>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Token
        </p>

        {token ? (
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950">
            {token}
          </pre>
        ) : (
          <p className="rounded-xl bg-zinc-200/60 p-4 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            No token generated yet.
          </p>
        )}
      </div>
    </section>
  );
}
