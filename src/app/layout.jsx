import "./globals.css";
import { StoreProvider } from "../context/StoreContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import WishlistDrawer from "../components/WishlistDrawer";
import SearchModal from "../components/SearchModal";
import CheckoutModal from "../components/CheckoutModal";
import ProductDetailModal from "../components/ProductDetailModal";

export const metadata = {
  metadataBase: new URL("https://indiesummer.in"),
  title: "INDIE SUMMER — One Design. One Piece. Never Again.",
  description: "One piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Slow batches. Singular pieces. Zero waste. A second life for beautiful things.",
  keywords: "Indie Summer, vintage saree resort wear, one-of-one silk dress, upcycled Indian textiles, Banarasi silk gown, luxury slow fashion India",
  openGraph: {
    title: "INDIE SUMMER — One Design. One Piece. Never Again.",
    description: "Crafted from vintage Indian sarees, dupattas and handworked textiles. Once it's gone, that exact piece will never exist again.",
    url: "https://indiesummer.in",
    siteName: "INDIE SUMMER",
    images: [
      {
        url: "/images/logo.png",
        width: 1774,
        height: 887,
        alt: "INDIE SUMMER"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          {/* Top Announcement Bar */}
          <div className="top-marquee">
            <div className="marquee-track">
              <span>ONE DESIGN. ONE PIECE. NEVER AGAIN.</span>
              <span>•</span>
              <span>CRAFTED FROM VINTAGE INDIAN SAREES, DUPATTAS & HANDWORKED TEXTILES</span>
              <span>•</span>
              <span>SLOW BATCHES · SINGULAR PIECES · ZERO WASTE</span>
              <span>•</span>
              <span>A SECOND LIFE FOR BEAUTIFUL THINGS</span>
              <span>•</span>
              <span>COMPLIMENTARY EXPRESS DELIVERY ACROSS INDIA ON ORDERS OVER ₹5,000</span>
              <span>•</span>
              <span>ONE DESIGN. ONE PIECE. NEVER AGAIN.</span>
            </div>
          </div>

          {/* Universal Header */}
          <Navbar />

          {/* Page View */}
          <div style={{ minHeight: "80vh" }}>
            {children}
          </div>

          {/* Universal Footer */}
          <Footer />

          {/* Client Overlays & Modals */}
          <CartDrawer />
          <WishlistDrawer />
          <SearchModal />
          <CheckoutModal />
          <ProductDetailModal />
        </StoreProvider>
      </body>
    </html>
  );
}
