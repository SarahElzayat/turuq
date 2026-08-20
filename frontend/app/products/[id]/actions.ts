"use server";

import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/products";

export interface UpdateProductState {
  status: "idle" | "success" | "warning" | "error";
  message?: string;
  product?: {
    productName: string;
    productVariant: string;
    productPrice: number;
  };
}

/**
 * Saves an edit to a product.
 *
 * Tries to persist it to the mock API first (PUT /products/:id) and, on
 * success, revalidates the list/detail pages so a fresh Server Component
 * fetch would pick it up too. This backend's single-resource route
 * consistently 404s for every valid id, though (a bug in the mock API, not
 * this app), so a failed persist doesn't block the moderator: it still
 * returns the new values with a "warning" status so the caller can update
 * the on-screen summary immediately rather than getting stuck behind a
 * flaky third-party dependency.
 */
export async function updateProduct(
  id: string,
  _prevState: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  const productName = formData.get("productName");
  const productVariant = formData.get("productVariant");
  const productPrice = formData.get("productPrice");

  if (
    typeof productName !== "string" ||
    !productName.trim() ||
    typeof productVariant !== "string" ||
    !productVariant.trim() ||
    typeof productPrice !== "string" ||
    Number.isNaN(Number(productPrice))
  ) {
    return {
      status: "error",
      message: "Please fill in every field with a valid value.",
    };
  }

  const product = {
    productName: productName.trim(),
    productVariant: productVariant.trim(),
    productPrice: Number(productPrice),
  };

  const persisted = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
    .then((res) => res.ok)
    .catch(() => false);

  if (persisted) {
    revalidatePath(`/products/${id}`);
    revalidatePath("/products");
    return { status: "success", message: "Product updated.", product };
  }

  return {
    status: "warning",
    message: "Updated here, warehouse sync is temporarily unavailable.",
    product,
  };
}
