import Link from "next/link";
import LoginCard from "@/components/login-card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Demo app
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Products catalog
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            View products from the external GraphQL endpoint.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Open products
            </Link>
            <Link
              href="/pizzas"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Open pizzas
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <LoginCard />
        </div>
      </div>
    </main>
  );
}
