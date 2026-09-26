"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data/products";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { saveLocalOrder } from "../lib/orderStorage";
import { logger } from "../lib/logger";

const StoreContext = createContext(null);

const DEFAULT_SETTINGS = {
  marqueeTicker: "ONE DESIGN. ONE PIECE. NEVER AGAIN. · COMPLIMENTARY BLUEDART AIR SHIPPING ACROSS INDIA · SLOW BATCHES · DISCOVERED VINTAGE SILKS · ZERO WASTE ATELIER",
  heroTitle: "A SECOND LIFE FOR BEAUTIFUL THINGS.",
  heroSubtitle: "Crafted from vintage Indian sarees, dupattas and handworked textiles. Once it’s gone, that exact piece will never exist again.",
  heroTagline: "SLOW BATCHES · SINGULAR PIECES · ZERO WASTE",
  currentVolume: "VOL. 001",
  dropStatus: "LIVE FOR ACQUISITION",
  promoCode: "INDIE10",
  promoDiscount: 10,
  phoneContact: "+91 98200 45892",
  emailContact: "atelier@indiesummer.in"
};

export function StoreProvider({ children }) {
  const [currency, setCurrency] = useState("INR");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Products & Site Settings
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);

  // Safe client-side storage hydration
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bidsData, setBidsData] = useState({});

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("indie_summer_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("indie_summer_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedBids = localStorage.getItem("indie_summer_bids");
      if (savedBids) setBidsData(JSON.parse(savedBids));

      const savedSettings = localStorage.getItem("indie_summer_settings");
      if (savedSettings) setSiteSettings(JSON.parse(savedSettings));

      const savedProducts = localStorage.getItem("indie_summer_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch (e) {
      console.warn("Storage hydration error", e);
    }
  }, []);

  // Fetch live from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function loadFromSupabase() {
      try {
        // Fetch products
        const { data: supaProducts, error: prodErr } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });

        if (!prodErr && supaProducts && supaProducts.length > 0) {
          const mapped = supaProducts.map((p) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            priceINR: Number(p.price_inr),
            priceUSD: Number(p.price_usd || 0),
            priceEUR: Number(p.price_eur || 0),
            priceGBP: Number(p.price_gbp || 0),
            priceAED: Number(p.price_aed || 0),
            category: p.category,
            isOneOfOne: p.is_one_of_one,
            isBidding: p.is_bidding,
            startingBidINR: Number(p.starting_bid_inr || 0),
            currentBidINR: Number(p.current_bid_inr || p.price_inr),
            minBidIncrementINR: Number(p.min_bid_increment_inr || 500),
            bidsCount: p.bids_count || 0,
            edition: p.edition,
            status: p.status,
            material: p.material,
            origin: p.origin,
            color: p.color,
            colorHex: p.color_hex,
            sizes: Array.isArray(p.sizes) ? p.sizes : ["XS", "S", "M"],
            imagePrimary: p.image_primary,
            imageSecondary: p.image_secondary,
            description: p.description,
            details: Array.isArray(p.details) ? p.details : []
          }));
          setProducts(mapped);
          localStorage.setItem("indie_summer_products", JSON.stringify(mapped));
        }

        // Fetch site settings
        const { data: supaSettings, error: setErr } = await supabase
          .from("site_settings")
          .select("*");

        if (!setErr && supaSettings && supaSettings.length > 0) {
          const merged = { ...DEFAULT_SETTINGS };
          supaSettings.forEach((item) => {
            if (item.key === "marquee_ticker") merged.marqueeTicker = item.value;
            if (item.key === "hero_title") merged.heroTitle = item.value;
            if (item.key === "hero_subtitle") merged.heroSubtitle = item.value;
            if (item.key === "hero_tagline") merged.heroTagline = item.value;
            if (item.key === "current_volume") merged.currentVolume = item.value;
            if (item.key === "drop_status") merged.dropStatus = item.value;
            if (item.key === "promo_code") merged.promoCode = item.value;
            if (item.key === "promo_discount") merged.promoDiscount = Number(item.value);
            if (item.key === "phone_contact") merged.phoneContact = item.value;
            if (item.key === "email_contact") merged.emailContact = item.value;
          });
          setSiteSettings(merged);
          localStorage.setItem("indie_summer_settings", JSON.stringify(merged));
        }
      } catch (err) {
        console.warn("Supabase load notice:", err);
      }
    }

    loadFromSupabase();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("indie_summer_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Cart storage error", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("indie_summer_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Wishlist storage error", e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (Object.keys(bidsData).length > 0) {
        localStorage.setItem("indie_summer_bids", JSON.stringify(bidsData));
      }
    } catch (e) {
      console.warn("Bids save error", e);
    }
  }, [bidsData]);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addToCart = (productWithSize) => {
    setCart((prev) => {
      const existing = prev.find(
        (it) => it.id === productWithSize.id && it.selectedSize === productWithSize.selectedSize
      );
      if (existing) {
        return prev.map((it) =>
          it.id === productWithSize.id && it.selectedSize === productWithSize.selectedSize
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      }
      return [...prev, { ...productWithSize, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, selectedSize, delta) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.id === id && it.selectedSize === selectedSize) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id, selectedSize) => {
    setCart((prev) => prev.filter((it) => !(it.id === id && it.selectedSize === selectedSize)));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((it) => it.id === product.id);
      if (exists) {
        return prev.filter((it) => it.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const moveWishlistToCart = (product) => {
    addToCart({
      ...product,
      selectedSize: product.sizes?.[0] || "One Size"
    });
    toggleWishlist(product);
  };

  const cartTotalItems = cart.reduce((acc, it) => acc + it.quantity, 0);

  const formatPrice = (amount, curr = currency) => {
    switch (curr) {
      case "USD":
        return `$${amount}`;
      case "EUR":
        return `€${amount}`;
      case "GBP":
        return `£${amount}`;
      case "AED":
        return `${amount} AED`;
      case "INR":
      default:
        return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  const getSubtotal = () => {
    return cart.reduce((acc, it) => {
      let price = it.priceINR;
      if (currency === "USD") price = it.priceUSD;
      if (currency === "EUR") price = it.priceEUR;
      if (currency === "GBP") price = it.priceGBP;
      if (currency === "AED") price = it.priceAED;
      return acc + price * it.quantity;
    }, 0);
  };

  const getCartTotal = () => {
    const sub = getSubtotal();
    const disc = discount ? Math.round(sub * (discount / 100)) : 0;
    return Math.max(0, sub - disc);
  };

  const getBiddingInfo = (product) => {
    if (!product || !product.isBidding) return null;
    const dynamic = bidsData[product.id];
    const currentBidINR = dynamic?.currentBidINR || product.currentBidINR || product.priceINR;
    const minBidIncrementINR = product.minBidIncrementINR || 500;
    const minNextBidINR = currentBidINR + minBidIncrementINR;
    const bidsCount = dynamic?.bidsCount || product.bidsCount || 0;
    const bidsHistory = dynamic?.bidsHistory || product.bidsHistory || [];

    return {
      isBidding: true,
      currentBidINR,
      minBidIncrementINR,
      minNextBidINR,
      bidsCount,
      bidsHistory
    };
  };

  const getProductDisplayPrice = (product, curr = currency) => {
    if (!product) return "";
    const bidding = getBiddingInfo(product);
    if (bidding) {
      return `₹${bidding.currentBidINR.toLocaleString("en-IN")}`;
    }
    switch (curr) {
      case "USD":
        return formatPrice(product.priceUSD || Math.round(product.priceINR / 83), "USD");
      case "EUR":
        return formatPrice(product.priceEUR || Math.round(product.priceINR / 90), "EUR");
      case "GBP":
        return formatPrice(product.priceGBP || Math.round(product.priceINR / 105), "GBP");
      case "AED":
        return formatPrice(product.priceAED || Math.round(product.priceINR / 22), "AED");
      case "INR":
      default:
        return formatPrice(product.priceINR, "INR");
    }
  };

  const placeBid = async (product, bidAmountINR, bidderName = "You (Verified Patron)") => {
    const info = getBiddingInfo(product);
    if (!info) return { success: false, message: "This piece is not open for bidding." };

    const minAllowed = info.minNextBidINR;
    if (bidAmountINR < minAllowed) {
      return {
        success: false,
        message: `Minimum increment is ₹${info.minBidIncrementINR}. Your bid must be at least ₹${minAllowed.toLocaleString("en-IN")}.`
      };
    }

    const newBid = {
      id: `bid-${Date.now()}`,
      bidder: bidderName,
      amount: bidAmountINR,
      time: "Just now"
    };

    setBidsData((prev) => {
      const existing = prev[product.id] || {};
      const history = [newBid, ...(existing.bidsHistory || product.bidsHistory || [])];
      return {
        ...prev,
        [product.id]: {
          currentBidINR: bidAmountINR,
          bidsCount: (existing.bidsCount || product.bidsCount || 0) + 1,
          bidsHistory: history
        }
      };
    });

    // Update in products state as well
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              currentBidINR: bidAmountINR,
              bidsCount: (p.bidsCount || 0) + 1
            }
          : p
      )
    );

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("bids").insert({
          product_id: product.id,
          bidder_name: bidderName,
          amount_inr: bidAmountINR
        });

        await supabase
          .from("products")
          .update({
            current_bid_inr: bidAmountINR,
            bids_count: (info.bidsCount || 0) + 1
          })
          .eq("id", product.id);
      } catch (e) {
        console.warn("Supabase bid insert note:", e);
      }
    }

    return { success: true, bid: newBid, newAmount: bidAmountINR };
  };

  // ADMIN ACTIONS: Update Settings
  const updateSiteSettings = async (newSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem("indie_summer_settings", JSON.stringify(newSettings));

    if (isSupabaseConfigured && supabase) {
      try {
        const rows = [
          { key: "marquee_ticker", value: JSON.stringify(newSettings.marqueeTicker) },
          { key: "hero_title", value: JSON.stringify(newSettings.heroTitle) },
          { key: "hero_subtitle", value: JSON.stringify(newSettings.heroSubtitle) },
          { key: "hero_tagline", value: JSON.stringify(newSettings.heroTagline) },
          { key: "current_volume", value: JSON.stringify(newSettings.currentVolume) },
          { key: "drop_status", value: JSON.stringify(newSettings.dropStatus) },
          { key: "promo_code", value: JSON.stringify(newSettings.promoCode) },
          { key: "promo_discount", value: JSON.stringify(newSettings.promoDiscount) },
          { key: "phone_contact", value: JSON.stringify(newSettings.phoneContact) },
          { key: "email_contact", value: JSON.stringify(newSettings.emailContact) }
        ];
        await supabase.from("site_settings").upsert(rows);
      } catch (err) {
        console.warn("Supabase settings sync error:", err);
      }
    }
  };

  // ADMIN ACTIONS: Product Management
  const updateProduct = async (updated) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p));
      localStorage.setItem("indie_summer_products", JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("products")
          .update({
            name: updated.name,
            price_inr: updated.priceINR,
            category: updated.category,
            is_bidding: updated.isBidding,
            starting_bid_inr: updated.startingBidINR ?? updated.priceINR,
            current_bid_inr: updated.currentBidINR ?? updated.priceINR,
            min_bid_increment_inr: updated.minBidIncrementINR || 500,
            bids_count: updated.bidsCount || 0,
            status: updated.status,
            material: updated.material,
            origin: updated.origin,
            image_primary: updated.imagePrimary,
            image_secondary: updated.imageSecondary || null,
            description: updated.description,
            auction_end_time: updated.auctionEndTime || null
          })
          .eq("id", updated.id);
      } catch (err) {
        console.warn("Supabase product update error:", err);
      }
    }
  };

  const addProduct = async (newProduct) => {
    const completeProd = {
      id: newProduct.id || `is-${String(products.length + 1).padStart(3, "0")}`,
      code: newProduct.code || `VINTAGE SAREE / PIECE ${String(products.length + 1).padStart(2, "0")}`,
      isOneOfOne: true,
      status: "available",
      sizes: ["One Size"],
      details: ["100% authentic vintage Indian textile", "One design. One piece. Never again."],
      ...newProduct
    };

    setProducts((prev) => {
      const next = [completeProd, ...prev];
      localStorage.setItem("indie_summer_products", JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").insert({
          id: completeProd.id,
          code: completeProd.code,
          name: completeProd.name,
          price_inr: completeProd.priceINR,
          price_usd: completeProd.priceUSD || Math.round(completeProd.priceINR / 83),
          price_eur: completeProd.priceEUR || Math.round(completeProd.priceINR / 90),
          price_gbp: completeProd.priceGBP || Math.round(completeProd.priceINR / 105),
          price_aed: completeProd.priceAED || Math.round(completeProd.priceINR / 22),
          category: completeProd.category,
          is_one_of_one: true,
          is_bidding: completeProd.isBidding || false,
          starting_bid_inr: completeProd.startingBidINR || completeProd.priceINR,
          current_bid_inr: completeProd.currentBidINR || completeProd.priceINR,
          min_bid_increment_inr: completeProd.minBidIncrementINR || 500,
          edition: completeProd.edition || "1 OF 1 VINTAGE SAREE GOWN",
          status: "available",
          material: completeProd.material,
          origin: completeProd.origin,
          image_primary: completeProd.imagePrimary || "/images/piece-crimson-saree.jpg",
          description: completeProd.description
        });
      } catch (err) {
        console.warn("Supabase product insert error:", err);
      }
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem("indie_summer_products", JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase product delete error:", err);
      }
    }
  };

  // CHECKOUT & ORDERS PERSISTENCE
  const createOrder = async (orderPayload) => {
    const orderId = orderPayload.id || `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullOrder = {
      id: orderId,
      order_ref: orderPayload.orderRef,
      customer_name: orderPayload.customerName,
      customer_email: orderPayload.customerEmail || "",
      customer_phone: orderPayload.customerPhone || "",
      customer_address: orderPayload.customerAddress || "",
      customer_city: orderPayload.customerCity || "",
      customer_pincode: orderPayload.customerPincode || "",
      payment_method: orderPayload.paymentMethod || "upi",
      total_amount_inr: Number(orderPayload.totalAmountINR || 0),
      items: orderPayload.items || [],
      status: "confirmed",
      created_at: new Date().toISOString()
    };

    // 1. Cache order locally for instant client access
    saveLocalOrder(fullOrder);

    // 2. Persist to Supabase orders table
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("orders").insert({
          id: fullOrder.id,
          order_ref: fullOrder.order_ref,
          customer_name: fullOrder.customer_name,
          customer_email: fullOrder.customer_email,
          customer_phone: fullOrder.customer_phone,
          customer_address: fullOrder.customer_address,
          customer_city: fullOrder.customer_city,
          customer_pincode: fullOrder.customer_pincode,
          payment_method: fullOrder.payment_method,
          total_amount_inr: fullOrder.total_amount_inr,
          items: fullOrder.items,
          status: fullOrder.status
        });
        if (error) logger.error("Supabase order insert error:", error);
      } catch (err) {
        logger.error("Supabase order persistence error:", err);
      }
    }

    // 3. Mark 1-of-1 pieces in the order as sold
    if (fullOrder.items && fullOrder.items.length > 0) {
      for (const item of fullOrder.items) {
        const targetProd = products.find((p) => p.id === item.id);
        if (targetProd && targetProd.isOneOfOne) {
          updateProduct({ ...targetProd, status: "sold" });
        }
      }
    }

    // 4. Clear the shopping bag
    setCart([]);
    localStorage.removeItem("indie_summer_cart");

    return fullOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        currency,
        setCurrency,
        cart,
        wishlist,
        cartTotalItems,
        cartOpen,
        setCartOpen,
        wishlistOpen,
        setWishlistOpen,
        searchOpen,
        setSearchOpen,
        checkoutOpen,
        setCheckoutOpen,
        activeQuickViewProduct,
        setActiveQuickViewProduct,
        discount,
        setDiscount,
        addToCart,
        updateQty,
        removeFromCart,
        toggleWishlist,
        moveWishlistToCart,
        formatPrice,
        getProductDisplayPrice,
        getSubtotal,
        getCartTotal,
        clearCart: () => setCart([]),
        bidsData,
        getBiddingInfo,
        placeBid,
        createOrder,
        // Admin & Customization
        products,
        siteSettings,
        updateSiteSettings,
        updateProduct,
        addProduct,
        deleteProduct,
        isSupabaseConfigured
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
