import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
