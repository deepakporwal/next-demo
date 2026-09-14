type Product = {
  name: string;
  price: number;
  category: string;
};

type GraphQLProductsResponse = {
  data?: {
    products?: Product[];
  };
  errors?: Array<{
    message: string;
  }>;
};

const PRODUCTS_QUERY = `
  query {
    products {
      name
      price
      category
    }
  }
`;

async function getProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:5165/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const json = (await response.json()) as GraphQLProductsResponse;

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  console.log("Fetched products:", json.data?.products);
  return json.data?.products ?? [];
}

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Product[] = [];
  let errorMessage = "";

  try {
    products = await getProducts();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load products from the external GraphQL API.";
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Catalog
            </p>
            <h1 className="mt-2 text-4xl font-bold">Products</h1>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">Unable to load products</p>
            <p className="mt-2">{errorMessage}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={`${product.name}-${product.category}`}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {product.category}
                  </span>
                  <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <h2 className="text-2xl font-semibold">{product.name}</h2>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
