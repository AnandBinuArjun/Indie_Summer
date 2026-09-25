"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [currency, setCurrency] = useState("INR");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Safe client-side storage hydration
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("indie_summer_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("indie_summer_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn("Storage hydration error", e);
    }
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
        if (productWithSize.isOneOfOne) return prev;
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

  const updateQty = (id, selectedSize, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((it) =>
        it.id === id && it.selectedSize === selectedSize ? { ...it, quantity: newQty } : it
      )
    );
  };

  const removeFromCart = (id, selectedSize) => {
    setCart((prev) =>
      prev.filter((it) => !(it.id === id && it.selectedSize === selectedSize))
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((it) => it.id === product.id);
      if (exists) {
        return prev.filter((it) => it.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const moveWishlistToCart = (product) => {
    addToCart({
      ...product,
      selectedSize: product.sizes?.[0] || "One Size"
    });
    setWishlist((prev) => prev.filter((it) => it.id !== product.id));
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

  // Live Bidding State for auction relics
  const [bidsData, setBidsData] = useState({});

  useEffect(() => {
    try {
      const savedBids = localStorage.getItem("indie_summer_bids");
      if (savedBids) setBidsData(JSON.parse(savedBids));
    } catch (e) {
      console.warn("Bids storage error", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (Object.keys(bidsData).length > 0) {
        localStorage.setItem("indie_summer_bids", JSON.stringify(bidsData));
      }
    } catch (e) {
      console.warn("Bids save error", e);
    }
  }, [bidsData]);

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

  const placeBid = (product, bidAmountINR, bidderName = "You (Verified Patron)") => {
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

    return { success: true, bid: newBid, newAmount: bidAmountINR };
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
        getSubtotal,
        getCartTotal,
        clearCart: () => setCart([]),
        bidsData,
        getBiddingInfo,
        placeBid
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
