import { notFound } from "next/navigation";
import { PRODUCTS } from "../../../data/products";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return PRODUCTS.map((prod) => ({
    id: prod.id
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Piece Not Found | INDIE SUMMER",
      description: "This 1-of-1 piece has entered the archive or is unavailable."
    };
  }

  return {
    title: `${product.name} — 1 of 1 | INDIE SUMMER`,
    description: product.description,
    openGraph: {
      title: `${product.name} | INDIE SUMMER — One Design. One Piece. Never Again.`,
      description: product.description,
      images: [
        {
          url: product.imagePrimary,
          alt: product.name
        }
      ]
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
