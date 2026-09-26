import { PRODUCTS } from "../data/products";

export default function sitemap() {
  const baseUrl = "https://indiesummer.in";

  // Static routes
  const routes = [
    "",
    "/shop",
    "/lookbook",
    "/journal",
    "/about",
    "/faq",
    "/track",
    "/privacy",
    "/terms",
    "/shipping-returns"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.7
  }));

  // Dynamic products
  const productRoutes = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.8
  }));

  return [...routes, ...productRoutes];
}
