export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"]
      }
    ],
    sitemap: "https://indiesummer.in/sitemap.xml"
  };
}
