import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"} in the warehouse.
          Click one to view or edit its details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
