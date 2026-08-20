import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-start gap-3">
      <h2 className="text-lg font-semibold">Product not found</h2>
      <p className="text-sm text-muted-foreground">
        This product doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild>
        <Link href="/products">Back to products</Link>
      </Button>
    </div>
  );
}
