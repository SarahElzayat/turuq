"use client";

import { useActionState, useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import {
  updateProduct,
  type UpdateProductState,
} from "@/app/products/[id]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: UpdateProductState = { status: "idle" };

export function ProductDetail({
  product: initialProduct,
}: {
  product: Product;
}) {
  // Holds the currently-displayed product so the summary card can update the
  // moment a save completes, independent of whether the backend PUT itself
  // succeeded (see the comment in actions.ts on this mock API's broken
  // single-resource route).
  const [product, setProduct] = useState(initialProduct);
  const updateThisProduct = updateProduct.bind(null, initialProduct.id);
  const [state, formAction, isPending] = useActionState(
    updateThisProduct,
    initialState,
  );

  // Whether the fields currently differ from the saved product, so Cancel can
  // stay disabled when there's nothing to discard.
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (state.product) {
      setProduct((current) => ({ ...current, ...state.product }));
      // A save re-keys the form, remounting it with the new values as its
      // defaults, so there are no pending edits left to cancel.
      setDirty(false);
    }
  }, [state]);

  /**
   * Compares the live field values against the saved product rather than just
   * flagging "a key was pressed", so typing a character and deleting it again
   * correctly returns the form to its pristine state.
   */
  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    setDirty(
      data.get("productName") !== product.productName ||
        data.get("productVariant") !== product.productVariant ||
        Number(data.get("productPrice")) !== product.productPrice,
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{product.productName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between border-b py-2">
            <span className="text-muted-foreground">ID</span>
            <span className="font-medium">{product.id}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{product.productName}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-muted-foreground">Variant</span>
            <span className="font-medium">{product.productVariant}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">
              ${product.productPrice.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit product details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Keyed on the current product values so the (uncontrolled) inputs'
              defaultValue resets to match state after each successful save. */}
          <form
            key={`${product.productName}-${product.productVariant}-${product.productPrice}`}
            action={formAction}
            onInput={handleInput}
            onReset={() => setDirty(false)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="id">ID</Label>
              {/* Product ID is not editable, it's the record's identity, not a detail. */}
              <Input id="id" value={product.id} disabled />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productName">Name</Label>
              <Input
                id="productName"
                name="productName"
                defaultValue={product.productName}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productVariant">Variant</Label>
              <Input
                id="productVariant"
                name="productVariant"
                defaultValue={product.productVariant}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productPrice">Price</Label>
              <Input
                id="productPrice"
                name="productPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product.productPrice}
                required
              />
            </div>

            {/* flex-wrap so the buttons and status message don't overflow on
                narrow phones. */}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : "Save changes"}
              </Button>
              {/* A native reset restores each input to its defaultValue. Since
                  the form is keyed on the current product, that's the last
                  saved state, so Cancel discards in-progress edits without
                  undoing a save the moderator already confirmed. */}
              <Button
                type="reset"
                variant="outline"
                disabled={isPending || !dirty}
              >
                Cancel
              </Button>
              {state.status === "success" && (
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  {state.message}
                </span>
              )}
              {state.status === "warning" && (
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  {state.message}
                </span>
              )}
              {state.status === "error" && (
                <span className="text-sm text-destructive">
                  {state.message}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
