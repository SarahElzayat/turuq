"use client";

import { Button } from "@/components/ui/button";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <h2 className="text-lg font-semibold">Couldn&apos;t load products</h2>
      <p className="text-sm text-muted-foreground">
        Something went wrong while fetching the warehouse product list.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
