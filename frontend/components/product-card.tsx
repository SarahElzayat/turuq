import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * A single product tile on the products list, linking to its detail page.
 *
 * The whole tile is the click target, a big, obvious hit area suits a
 * moderator working quickly, rather than a small "view" link. `group` on the
 * anchor lets the inner pieces (icon chip, title) react to hovering anywhere
 * on the card.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Card
        className={cn(
          "h-full",
          // `transition` (not `transition-shadow`) so the lift, the shadow and
          // the ring colour all ease together, Tailwind renders rings as
          // box-shadow, so both land on the same timing curve.
          "transition duration-200 ease-out",
          "group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/15",
          "group-hover:ring-primary/10",
          // Slight press-down so a tap/click feels physical.
          "group-active:translate-y-0 group-active:shadow-md group-active:duration-75",
          // Respect users who've asked for less motion, keep the colour and
          // shadow feedback, drop the movement.
          "motion-reduce:transform-none motion-reduce:group-hover:translate-y-0",
        )}
      >
        <CardHeader className="flex flex-row items-start gap-4  pb-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
            <Package className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col">
            <CardTitle className="truncate text-base font-semibold leading-tight">
              {product.productName}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {product.productVariant}
            </span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">ID</span>
            <span className="font-medium text-card-foreground">
              {product.id}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-semibold text-primary">
              ${product.productPrice.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
