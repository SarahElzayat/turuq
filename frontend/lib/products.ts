const API_URL = "https://6776992512a55a9a7d0c4868.mockapi.io/products";

export interface Product {
  id: string;
  productName: string;
  productVariant: string;
  productPrice: number;
}

/**
 * Fetches the full product list from the warehouse API.
 * `cache: "no-store"` because stock/pricing data should always be current
 * for a moderator working the floor, not served from a stale cache.
 */
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch products (status ${res.status})`);
  }

  return res.json();
}

/**
 * Fetches a single product by id.
 *
 * This mock API's single-resource route (`/products/:id`) 404s even for
 * ids that exist in the list response, so we fetch the list and find the
 * match there instead, reliable, and cheap enough at this dataset size.
 * Returns null when the product isn't found, so callers can render a
 * not-found state instead of throwing.
 */
export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => String(product.id) === id) ?? null;
}

export { API_URL };
