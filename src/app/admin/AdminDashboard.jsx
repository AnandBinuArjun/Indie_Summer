"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sliders,
  Package,
  Gavel,
  Database,
  Check,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RefreshCw,
  Copy,
  Sparkles,
  TrendingUp,
  Tag,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  Users,
  Search,
  Download,
  Upload,
  X,
  MessageCircle,
  Mail,
  Phone,
  Eye,
  Award,
  CheckCircle2,
  DollarSign,
  Filter,
  Calendar
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getLocalOrders, saveLocalOrder, updateLocalOrderStatus } from "../../lib/orderStorage";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    products,
    siteSettings,
    updateSiteSettings,
    updateProduct,
    addProduct,
    deleteProduct,
    formatPrice,
    bidsData
  } = useStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Search & Filtering States
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStatusFilter, setProductStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Auction & Bidding State
  const [selectedBidRelic, setSelectedBidRelic] = useState(null);
  const [relicBidsList, setRelicBidsList] = useState([]);
  const [relicBidsLoading, setRelicBidsLoading] = useState(false);
  const [auctionCloseNotice, setAuctionCloseNotice] = useState("");
  const [confirmCloseProduct, setConfirmCloseProduct] = useState(null);

  // Strict Auth guard — redirect to /admin/login if not authenticated
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      router.replace("/admin/login");
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setSession(session);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (!sess) {
        router.replace("/admin/login");
      } else {
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Fetch real customer orders from Supabase (or localStorage fallback)
  const fetchOrders = async () => {
    setOrdersLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) {
          setOrders(data);
          setOrdersLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Supabase orders query note:", e);
      }
    }
    setOrders(getLocalOrders());
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      } catch (e) {
        console.warn("Status sync error:", e);
      }
    }
    updateLocalOrderStatus(orderId, newStatus);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  // CSV Export for Orders
  const exportOrdersToCsv = () => {
    if (!orders || orders.length === 0) return;
    const headers = [
      "Order Ref",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Address",
      "City",
      "Pincode",
      "Payment Method",
      "Status",
      "Total Amount (INR)",
      "Acquired Relics"
    ];

    const rows = orders.map((o) => {
      const itemsSummary = (o.items || [])
        .map((it) => `${it.name || "Piece"} [${it.code || ""}]`)
        .join("; ");
      return [
        `"${o.order_ref || o.id}"`,
        `"${o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN") : ""}"`,
        `"${(o.customer_name || "").replace(/"/g, '""')}"`,
        `"${(o.customer_email || "").replace(/"/g, '""')}"`,
        `"${(o.customer_phone || "").replace(/"/g, '""')}"`,
        `"${(o.customer_address || "").replace(/"/g, '""')}"`,
        `"${(o.customer_city || "").replace(/"/g, '""')}"`,
        `"${(o.customer_pincode || "").replace(/"/g, '""')}"`,
        `"${(o.payment_method || "UPI").replace(/"/g, '""')}"`,
        `"${(o.status || "confirmed").replace(/"/g, '""')}"`,
        Number(o.total_amount_inr || 0),
        `"${itemsSummary.replace(/"/g, '""')}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `indie_summer_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    marqueeTicker: siteSettings?.marqueeTicker || "",
    heroTitle: siteSettings?.heroTitle || "",
    heroSubtitle: siteSettings?.heroSubtitle || "",
    heroTagline: siteSettings?.heroTagline || "",
    currentVolume: siteSettings?.currentVolume || "VOL. 001",
    dropStatus: siteSettings?.dropStatus || "LIVE FOR ACQUISITION",
    promoCode: siteSettings?.promoCode || "INDIE10",
    promoDiscount: siteSettings?.promoDiscount || 10,
    phoneContact: siteSettings?.phoneContact || "+91 98200 45892",
    emailContact: siteSettings?.emailContact || "atelier@indiesummer.in"
  });

  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingDb, setSyncingDb] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  // Product Editing / Adding State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    code: `VINTAGE SAREE / PIECE 0${products.length + 1}`,
    priceINR: 28000,
    category: "vintage-saree",
    isBidding: false,
    startingBidINR: 28000,
    currentBidINR: 28000,
    minBidIncrementINR: 500,
    auctionEndTime: "",
    material: "Vintage Handwoven Silk Saree with Antique Zari",
    origin: "Discovered in Varanasi · Handcrafted in Goa Atelier",
    imagePrimary: "/images/piece-crimson-saree.jpg",
    description: "Handcrafted from an archival vintage saree. One design. One piece. Never again."
  });

  // Calculate High-Level Business Metrics
  const totalRelics = products.length;
  const activeAuctions = products.filter((p) => p.isBidding).length;
  const directBuyPieces = products.filter((p) => !p.isBidding).length;
  const soldRelics = products.filter((p) => p.status === "sold" || p.status === "reserved").length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.isBidding ? p.currentBidINR : p.priceINR), 0);

  // Real Sales & Revenue Analytics
  const nonCancelledOrders = orders.filter((o) => o.status !== "cancelled");
  const grossRevenue = nonCancelledOrders.reduce((acc, o) => acc + (Number(o.total_amount_inr) || 0), 0);
  const averageOrderValue = nonCancelledOrders.length > 0 ? Math.round(grossRevenue / nonCancelledOrders.length) : 0;
  const fulfilledOrdersCount = orders.filter((o) => o.status === "delivered" || o.status === "dispatched").length;
  const fulfillmentRate = orders.length > 0 ? Math.round((fulfilledOrdersCount / orders.length) * 100) : 100;

  // Customers / Patrons Computed Directory
  const patrons = useMemo(() => {
    const patronMap = {};
    orders.forEach((ord) => {
      const key = (ord.customer_email || ord.customer_phone || ord.customer_name || "Unknown").toLowerCase().trim();
      if (!patronMap[key]) {
        patronMap[key] = {
          key,
          name: ord.customer_name || "Anonymous Patron",
          email: ord.customer_email || "",
          phone: ord.customer_phone || "",
          city: ord.customer_city || "",
          address: ord.customer_address || "",
          totalSpend: 0,
          ordersCount: 0,
          acquisitions: [],
          firstOrderDate: ord.created_at,
          lastOrderDate: ord.created_at
        };
      }
      patronMap[key].totalSpend += Number(ord.total_amount_inr) || 0;
      patronMap[key].ordersCount += 1;
      if (ord.items && Array.isArray(ord.items)) {
        ord.items.forEach((it) => {
          patronMap[key].acquisitions.push({
            id: it.id,
            name: it.name,
            code: it.code,
            imagePrimary: it.imagePrimary,
            priceINR: it.priceINR,
            orderRef: ord.order_ref,
            orderDate: ord.created_at
          });
        });
      }
      if (ord.created_at && new Date(ord.created_at) > new Date(patronMap[key].lastOrderDate)) {
        patronMap[key].lastOrderDate = ord.created_at;
      }
    });
    return Object.values(patronMap);
  }, [orders]);

  // Filtered Lists
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.material && p.material.toLowerCase().includes(productSearch.toLowerCase()));
      const matchesCategory = productCategoryFilter === "all" || p.category === productCategoryFilter;
      const matchesStatus =
        productStatusFilter === "all"
          ? true
          : productStatusFilter === "bidding"
          ? p.isBidding
          : productStatusFilter === "direct"
          ? !p.isBidding
          : p.status === productStatusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, productSearch, productCategoryFilter, productStatusFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        (o.order_ref && o.order_ref.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customer_name && o.customer_name.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customer_city && o.customer_city.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredPatrons = useMemo(() => {
    return patrons.filter((pt) => {
      const term = customerSearch.toLowerCase();
      const matchesName = pt.name.toLowerCase().includes(term);
      const matchesEmail = pt.email.toLowerCase().includes(term);
      const matchesPhone = pt.phone.toLowerCase().includes(term);
      const matchesCity = pt.city.toLowerCase().includes(term);
      const matchesPiece = pt.acquisitions.some(
        (a) => (a.name && a.name.toLowerCase().includes(term)) || (a.code && a.code.toLowerCase().includes(term))
      );
      return matchesName || matchesEmail || matchesPhone || matchesCity || matchesPiece;
    });
  }, [patrons, customerSearch]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSiteSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Client-side canvas image compression to prevent bloated payloads
  const compressImageFile = (file, maxWidth = 1600, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas compression failed"));
          },
          "image/jpeg",
          quality
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadNotice, setImageUploadNotice] = useState("");

  // Supabase Storage & Compression Image Uploader
  const handleImageFileUpload = async (e, isEditing) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setImageUploadNotice("Optimizing and uploading image...");

    try {
      const compressedBlob = await compressImageFile(file, 1600, 0.85);
      let finalUrl = null;

      // Attempt upload to Supabase Storage CDN
      if (isSupabaseConfigured && supabase) {
        try {
          const fileName = `relic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from("product-images")
            .upload(fileName, compressedBlob, {
              contentType: "image/jpeg",
              cacheControl: "31536000",
              upsert: true
            });

          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(fileName);
            finalUrl = publicUrlData.publicUrl;
            setImageUploadNotice("✓ Uploaded to Supabase Storage CDN");
          } else {
            console.warn("Supabase storage bucket notice:", uploadErr?.message);
          }
        } catch (storageErr) {
          console.warn("Storage upload exception:", storageErr);
        }
      }

      // Safe fallback if bucket not yet created: use lightweight compressed base64 (~150KB instead of 8MB)
      if (!finalUrl) {
        finalUrl = await new Promise((res) => {
          const r = new FileReader();
          r.onload = (ev) => res(ev.target.result);
          r.readAsDataURL(compressedBlob);
        });
        setImageUploadNotice("✓ Image optimized (compressed to ~150KB)");
      }

      if (isEditing) {
        setEditingProduct((prev) => ({ ...prev, imagePrimary: finalUrl }));
      } else {
        setNewProductForm((prev) => ({ ...prev, imagePrimary: finalUrl }));
      }

      setTimeout(() => setImageUploadNotice(""), 4500);
    } catch (err) {
      console.error("Image upload error:", err);
      setImageUploadNotice("Failed to process image: " + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  // Fetch individual bid history for a product
  const handleOpenBidHistory = async (prod) => {
    setSelectedBidRelic(prod);
    setRelicBidsLoading(true);

    let bids = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("bids")
          .select("*")
          .eq("product_id", prod.id)
          .order("amount_inr", { ascending: false });
        if (!error && data && data.length > 0) {
          bids = data;
        }
      } catch (err) {
        console.warn("Error querying bids:", err);
      }
    }

    if (bids.length === 0) {
      // Fallback to local store bidsData or product history
      const dyn = bidsData[prod.id];
      if (dyn?.bidsHistory && dyn.bidsHistory.length > 0) {
        bids = dyn.bidsHistory.map((b, idx) => ({
          id: `local-${idx}`,
          product_id: prod.id,
          bidder_name: b.bidderName || b.bidder_name || "Anonymous Patron",
          amount_inr: b.amountINR || b.amount_inr || prod.currentBidINR,
          created_at: b.timestamp || b.created_at || new Date().toISOString()
        }));
      } else if (prod.bidsHistory && prod.bidsHistory.length > 0) {
        bids = prod.bidsHistory.map((b, idx) => ({
          id: `prod-${idx}`,
          product_id: prod.id,
          bidder_name: b.bidderName || b.bidder_name || "Anonymous Patron",
          amount_inr: b.amountINR || b.amount_inr || prod.currentBidINR,
          created_at: b.timestamp || b.created_at || new Date().toISOString()
        }));
      }
    }

    setRelicBidsList(bids);
    setRelicBidsLoading(false);
  };

  // =========================================================================
  // FIX FOR BUG #1: Close Auction WITHOUT destroying winning bid & generate order
  // =========================================================================
  const handleFinalizeAndCloseAuction = async (product, specificWinner = null) => {
    // 1. Determine the true winning bidder and winning amount
    let winner = specificWinner;
    let winningAmount = Number(product.currentBidINR) || Number(product.priceINR);

    if (!winner && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("bids")
          .select("*")
          .eq("product_id", product.id)
          .order("amount_inr", { ascending: false })
          .limit(1);
        if (!error && data && data.length > 0) {
          winner = data[0];
          winningAmount = Number(winner.amount_inr) || winningAmount;
        }
      } catch (err) {
        console.warn("Could not query winning bid:", err);
      }
    }

    if (!winner) {
      const dynamic = bidsData[product.id];
      if (dynamic?.bidsHistory && dynamic.bidsHistory.length > 0) {
        winner = dynamic.bidsHistory[0];
        winningAmount = Number(winner.amountINR || winner.amount_inr) || winningAmount;
      }
    }

    const winnerName = winner?.bidder_name || winner?.bidderName || "Leading Atelier Patron";
    const winnerContact = winner?.bidder_contact || winner?.bidderLocation || "Location Coordinates Provided at Dispatch";

    // 2. CRITICAL PRESERVATION: Keep currentBidINR and bidsCount, set isBidding to false and status to 'reserved' / 'sold'
    const updated = {
      ...product,
      isBidding: false,
      status: "reserved",
      currentBidINR: winningAmount,
      bidsCount: product.bidsCount || 1,
      winningBidder: winnerName,
      closedAt: new Date().toISOString()
    };
    await updateProduct(updated);

    // 3. Persist an official customer order for this winning auction acquisition
    const auctionOrderRef = `AUC-${product.code ? product.code.replace(/[^A-Z0-9]/gi, "").slice(-4) : "WIN"}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAuctionOrder = {
      id: `ord_auc_${Date.now()}`,
      order_ref: auctionOrderRef,
      customer_name: winnerName,
      customer_email: winner?.email || "concierge@indiesummer.in",
      customer_phone: winner?.phone || winnerContact,
      customer_address: `Archival Atelier Auction Winner · ${winnerContact}`,
      customer_city: winnerContact.includes("(") ? winnerContact.split("(")[1].replace(")", "") : winnerContact,
      customer_pincode: "403516",
      payment_method: "AUCTION SETTLEMENT (INVOICE / WIRE)",
      total_amount_inr: winningAmount,
      items: [
        {
          id: product.id,
          code: product.code,
          name: product.name,
          priceINR: winningAmount,
          imagePrimary: product.imagePrimary,
          selectedSize: "One Size (Tailored Fitting)",
          quantity: 1,
          isAuctionWin: true
        }
      ],
      status: "confirmed",
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("orders").insert(newAuctionOrder);
      } catch (err) {
        console.warn("Supabase auction order insert note:", err);
      }
    }

    setOrders((prev) => [newAuctionOrder, ...prev]);
    saveLocalOrder(newAuctionOrder);

    setConfirmCloseProduct(null);
    setSelectedBidRelic(null);
    setAuctionCloseNotice(
      `✓ Auction resolved! Winning bid of ${formatPrice(winningAmount, "INR")} recorded for ${winnerName}. Dispatched order ${auctionOrderRef} created in Orders tab.`
    );
    setTimeout(() => setAuctionCloseNotice(""), 7000);
  };

  const handleReopenAuction = async (product) => {
    const updated = {
      ...product,
      isBidding: true,
      status: "available",
      startingBidINR: product.startingBidINR || product.priceINR,
      currentBidINR: product.currentBidINR || product.priceINR,
      minBidIncrementINR: product.minBidIncrementINR || 500,
      bidsCount: product.bidsCount || 1
    };
    await updateProduct(updated);
    setAuctionCloseNotice(`✓ Auction reopened for ${product.name} at ${formatPrice(updated.currentBidINR, "INR")}.`);
    setTimeout(() => setAuctionCloseNotice(""), 5000);
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleAddNewProductSubmit = async (e) => {
    e.preventDefault();
    await addProduct(newProductForm);
    setIsAddingNew(false);
    setNewProductForm({
      name: "",
      code: `VINTAGE SAREE / PIECE 0${products.length + 2}`,
      priceINR: 28000,
      category: "vintage-saree",
      isBidding: false,
      startingBidINR: 28000,
      currentBidINR: 28000,
      minBidIncrementINR: 500,
      auctionEndTime: "",
      material: "Vintage Handwoven Silk Saree with Antique Zari",
      origin: "Discovered in Varanasi · Handcrafted in Goa Atelier",
      imagePrimary: "/images/piece-crimson-saree.jpg",
      description: "Handcrafted from an archival vintage saree. One design. One piece. Never again."
    });
  };

  const handleSyncSupabaseSeed = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setSyncStatus("Supabase is not configured yet. Please check .env.local.");
      return;
    }

    setSyncingDb(true);
    setSyncStatus("Pushing products and settings to Supabase...");

    try {
      const settingRows = [
        { key: "marquee_ticker", value: JSON.stringify(settingsForm.marqueeTicker) },
        { key: "hero_title", value: JSON.stringify(settingsForm.heroTitle) },
        { key: "hero_subtitle", value: JSON.stringify(settingsForm.heroSubtitle) },
        { key: "hero_tagline", value: JSON.stringify(settingsForm.heroTagline) },
        { key: "current_volume", value: JSON.stringify(settingsForm.currentVolume) },
        { key: "drop_status", value: JSON.stringify(settingsForm.dropStatus) },
        { key: "promo_code", value: JSON.stringify(settingsForm.promoCode) },
        { key: "promo_discount", value: JSON.stringify(settingsForm.promoDiscount) },
        { key: "phone_contact", value: JSON.stringify(settingsForm.phoneContact) },
        { key: "email_contact", value: JSON.stringify(settingsForm.emailContact) }
      ];
      await supabase.from("site_settings").upsert(settingRows);

      for (const prod of products) {
        await supabase.from("products").upsert({
          id: prod.id,
          code: prod.code,
          name: prod.name,
          price_inr: prod.priceINR,
          price_usd: prod.priceUSD || Math.round(prod.priceINR / 83),
          price_eur: prod.priceEUR || Math.round(prod.priceINR / 90),
          price_gbp: prod.priceGBP || Math.round(prod.priceINR / 105),
          price_aed: prod.priceAED || Math.round(prod.priceINR / 22),
          category: prod.category,
          is_one_of_one: true,
          is_bidding: prod.isBidding || false,
          starting_bid_inr: prod.startingBidINR || prod.priceINR,
          current_bid_inr: prod.currentBidINR || prod.priceINR,
          min_bid_increment_inr: prod.minBidIncrementINR || 500,
          bids_count: prod.bidsCount || 0,
          edition: prod.edition || "1 OF 1 VINTAGE SAREE GOWN",
          status: prod.status || "available",
          material: prod.material,
          origin: prod.origin,
          image_primary: prod.imagePrimary,
          image_secondary: prod.imageSecondary || null,
          description: prod.description,
          auction_end_time: prod.auctionEndTime || null
        });
      }

      setSyncStatus("✓ Success! All products and site settings synced to Supabase database.");
    } catch (err) {
      setSyncStatus(`Sync error: ${err.message || "Failed to sync. Please ensure tables exist in Supabase."}`);
    } finally {
      setSyncingDb(false);
    }
  };

  const copySqlCode = () => {
    const sql = `-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  price_inr NUMERIC NOT NULL,
  price_usd NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'vintage-saree',
  is_one_of_one BOOLEAN DEFAULT TRUE,
  is_bidding BOOLEAN DEFAULT FALSE,
  starting_bid_inr NUMERIC DEFAULT 0,
  current_bid_inr NUMERIC DEFAULT 0,
  min_bid_increment_inr NUMERIC DEFAULT 500,
  bids_count INT DEFAULT 0,
  edition TEXT DEFAULT '1 OF 1 VINTAGE SAREE GOWN',
  status TEXT DEFAULT 'available',
  material TEXT,
  origin TEXT,
  image_primary TEXT NOT NULL,
  image_secondary TEXT,
  description TEXT,
  auction_end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  bidder_contact TEXT,
  amount_inr NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_pincode TEXT,
  payment_method TEXT DEFAULT 'upi',
  total_amount_inr NUMERIC NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Staff can manage products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Public can place validated bids" ON public.bids FOR INSERT WITH CHECK (amount_inr > 0 AND length(trim(bidder_name)) >= 2);
CREATE POLICY "Staff can manage bids" ON public.bids FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Shoppers can submit checkout orders" ON public.orders FOR INSERT WITH CHECK (total_amount_inr > 0 AND length(trim(customer_name)) >= 2);
CREATE POLICY "Staff can view customer orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can update customer orders" ON public.orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff can delete customer orders" ON public.orders FOR DELETE TO authenticated USING (true);

CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Staff can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="maru-eyebrow" style={{ color: "rgba(251,251,247,0.45)", letterSpacing: "0.2em", fontSize: "0.65rem" }}>
          VERIFYING ATELIER CLEARANCE...
        </span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", color: "var(--color-ink)", paddingTop: "5.5rem", paddingBottom: "6rem" }}>
      <div className="site-container">
        {/* Banner Alert for Auction Actions */}
        {auctionCloseNotice && (
          <div
            style={{
              backgroundColor: "#166534",
              color: "#FFF",
              padding: "14px 20px",
              marginBottom: "1.5rem",
              borderRadius: "2px",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 size={18} />
              <span>{auctionCloseNotice}</span>
            </div>
            <button
              onClick={() => setAuctionCloseNotice("")}
              style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Top Header Banner */}
        <div
          style={{
            backgroundColor: "var(--color-ink)",
            color: "var(--color-ivory)",
            padding: "2rem 2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            border: "1px solid #333"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: isSupabaseConfigured ? "#22C55E" : "#EAB308"
                }}
              />
              <span className="maru-eyebrow" style={{ color: "#E0D7C6", fontSize: "0.65rem", letterSpacing: "0.22em" }}>
                ATELIER OPERATIONS & CMS · CLUSTER: GQVMDRTLOCVIDJTIYYCV
              </span>
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: "4px", letterSpacing: "0.02em" }}>
              INDIE SUMMER ADMIN<span style={{ color: "var(--color-siren)" }}>.</span>
            </h1>
            <p className="font-serif italic" style={{ fontSize: "0.95rem", color: "rgba(251, 251, 247, 0.7)", marginTop: "4px" }}>
              Executive management of 1-of-1 vintage relics, real customer acquisitions, live bidding oversight, and site typography.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(251, 251, 247, 0.1)",
                color: "var(--color-ivory)",
                padding: "10px 18px",
                fontSize: "0.72rem",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid rgba(251, 251, 247, 0.2)",
                fontWeight: 600
              }}
            >
              LIVE STOREFRONT <ExternalLink size={13} />
            </Link>
            {session && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <span style={{ fontSize: "0.65rem", color: "rgba(251,251,247,0.45)", fontFamily: "var(--font-sans)" }}>
                  {session.user?.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    backgroundColor: "transparent",
                    color: "rgba(251,251,247,0.6)",
                    padding: "6px 12px",
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    border: "1px solid rgba(251,251,247,0.15)",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  SIGN OUT
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid var(--color-border)",
            marginBottom: "2.5rem",
            overflowX: "auto",
            paddingBottom: "2px"
          }}
        >
          {[
            { id: "overview", label: "OVERVIEW & REVENUE", icon: TrendingUp },
            { id: "orders", label: `ORDERS (${orders.length})`, icon: ShoppingBag },
            { id: "customers", label: `PATRONS (${patrons.length})`, icon: Users },
            { id: "bidding", label: `LIVE AUCTIONS (${activeAuctions})`, icon: Gavel },
            { id: "products", label: `RELICS (${totalRelics})`, icon: Package },
            { id: "customization", label: "CUSTOMIZATION", icon: Sliders },
            { id: "sql_setup", label: "SUPABASE DB", icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 18px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: "none",
                  borderBottom: isActive ? "2.5px solid var(--color-ink)" : "2.5px solid transparent",
                  backgroundColor: isActive ? "var(--color-ivory)" : "transparent",
                  color: isActive ? "var(--color-ink)" : "rgba(14, 13, 13, 0.6)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={15} color={isActive ? "var(--color-siren)" : "currentColor"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & REVENUE ANALYTICS                            */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* Primary Operations KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "#166534", fontSize: "0.6rem" }}>
                  GROSS REVENUE TO DATE
                </span>
                <div className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px", color: "#166534" }}>
                  {formatPrice(grossRevenue, "INR")}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  From {nonCancelledOrders.length} confirmed client acquisitions
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.6rem" }}>
                  AVERAGE ORDER VALUE (AOV)
                </span>
                <div className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                  {formatPrice(averageOrderValue, "INR")}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Average investment per patron acquisition
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                  LIVE ATELIER AUCTIONS
                </span>
                <div className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px", color: "var(--color-siren)" }}>
                  {activeAuctions}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Active bidding pieces (+₹500 min step)
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.6rem" }}>
                  UNIQUE PATRONS
                </span>
                <div className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                  {patrons.length}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Registered buyers with dispatch history
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.6rem" }}>
                  CATALOG INVENTORY VALUE
                </span>
                <div className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                  {formatPrice(totalInventoryValue, "INR")}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Current valuations across all {totalRelics} relics
                </p>
              </div>
            </div>

            {/* Middle Section: Recent Atelier Activity + Catalog Velocity */}
            <div className="admin-2col-grid" style={{ marginBottom: "2.5rem" }}>
              {/* Recent Orders Feed */}
              <div style={{ backgroundColor: "var(--color-ivory)", padding: "2rem", border: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                  <h3 className="font-display" style={{ fontSize: "1.4rem" }}>
                    LATEST CLIENT TRANSACTIONS
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    style={{ background: "none", border: "none", color: "var(--color-siren)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                  >
                    VIEW ALL ({orders.length}) →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.5)", fontStyle: "italic" }}>
                    No customer orders received yet. Completed checkouts will display here immediately.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {orders.slice(0, 5).map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          backgroundColor: "#FFF",
                          border: "1px solid var(--color-border)"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{ord.customer_name}</div>
                          <div style={{ fontSize: "0.7rem", color: "rgba(14, 13, 13, 0.6)" }}>
                            {ord.order_ref} · {ord.customer_city || "Pan-India"} · {new Date(ord.created_at || Date.now()).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{formatPrice(ord.total_amount_inr, "INR")}</div>
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "2px 6px",
                              backgroundColor: ord.status === "delivered" ? "#DCFCE7" : "#FEF3C7",
                              color: ord.status === "delivered" ? "#166534" : "#92400E"
                            }}
                          >
                            {ord.status || "confirmed"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Catalog Status & Volume Velocity */}
              <div style={{ backgroundColor: "var(--color-ivory)", padding: "2rem", border: "1px solid var(--color-border)" }}>
                <h3 className="font-display" style={{ fontSize: "1.4rem", marginBottom: "1.2rem" }}>
                  VOLUME 001 VELOCITY & STATUS
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600 }}>Catalog Acquisition Ratio:</span>
                      <span>{soldRelics} / {totalRelics} Relics Claimed ({Math.round((soldRelics / (totalRelics || 1)) * 100)}%)</span>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "var(--color-cream)", width: "100%", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.round((soldRelics / (totalRelics || 1)) * 100)}%`,
                          backgroundColor: "var(--color-siren)"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600 }}>Order Dispatch Fulfillment:</span>
                      <span>{fulfilledOrdersCount} / {orders.length || 1} Orders Dispatched ({fulfillmentRate}%)</span>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "var(--color-cream)", width: "100%", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${fulfillmentRate}%`,
                          backgroundColor: "#166534"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--color-border)" }}>
                    <div className="admin-2col-grid" style={{ gap: "10px", fontSize: "0.8rem" }}>
                      <div>
                        <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Drop Status:</span>
                        <div style={{ fontWeight: 700, color: "var(--color-siren)" }}>{siteSettings?.dropStatus || "LIVE"}</div>
                      </div>
                      <div>
                        <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Active Promo:</span>
                        <div style={{ fontWeight: 700 }}>{siteSettings?.promoCode} ({siteSettings?.promoDiscount}% OFF)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CUSTOMER ORDERS MANAGEMENT                             */}
        {/* ============================================================== */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.8rem" }}>
              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                  POSTGRESQL ORDERS LEDGER · AUTHENTICATED STAFF ONLY
                </span>
                <h2 className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                  CUSTOMER ORDERS & ACQUISITIONS
                </h2>
                <p style={{ fontSize: "0.88rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Direct acquisitions and settled auction wins recorded in <code>public.orders</code>.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={exportOrdersToCsv}
                  className="azar-btn-black"
                  style={{ height: "42px", fontSize: "0.72rem", backgroundColor: "#FFF", color: "var(--color-ink)", border: "1px solid var(--color-ink)" }}
                >
                  <Download size={13} /> EXPORT CSV
                </button>
                <button
                  type="button"
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="azar-btn-black"
                  style={{ height: "42px", fontSize: "0.72rem" }}
                >
                  <RefreshCw size={13} className={ordersLoading ? "animate-spin" : ""} />
                  {ordersLoading ? "REFRESHING..." : "REFRESH ORDERS"}
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(14, 13, 13, 0.4)" }} />
                <input
                  type="text"
                  placeholder="Search by order ref, customer name, email, or city..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 38px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                {["all", "confirmed", "dispatched", "delivered", "cancelled"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderStatusFilter(status)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "1px solid var(--color-border)",
                      backgroundColor: orderStatusFilter === status ? "var(--color-ink)" : "#FFF",
                      color: orderStatusFilter === status ? "var(--color-ivory)" : "var(--color-ink)"
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ backgroundColor: "var(--color-ivory)", padding: "3.5rem 2rem", textAlign: "center", border: "1px solid var(--color-border)" }}>
                <ShoppingBag size={42} style={{ color: "rgba(14, 13, 13, 0.25)", margin: "0 auto 1rem" }} />
                <h3 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>
                  {orderSearch ? "NO MATCHING ORDERS FOUND" : "NO ORDERS RECORDED YET"}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.65)", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
                  {orderSearch
                    ? "Try adjusting your search criteria."
                    : "When clients checkout on the storefront or win auctions, their orders will appear here."}
                </p>
                {orderSearch && (
                  <button type="button" onClick={() => setOrderSearch("")} className="azar-btn-black">
                    CLEAR SEARCH FILTER
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {filteredOrders.map((ord) => {
                  const itemsList = Array.isArray(ord.items) ? ord.items : [];
                  const orderDate = ord.created_at
                    ? new Date(ord.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                    : "Recent";

                  return (
                    <div key={ord.id} style={{ backgroundColor: "var(--color-ivory)", border: "1px solid var(--color-border)", padding: "1.8rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "1rem",
                          borderBottom: "1px solid var(--color-border)",
                          paddingBottom: "1rem",
                          marginBottom: "1.2rem"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.08em" }}>
                              {ord.order_ref}
                            </span>
                            <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(14, 13, 13, 0.08)", padding: "3px 8px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                              {ord.payment_method || "UPI"}
                            </span>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                padding: "3px 10px",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontWeight: 700,
                                backgroundColor:
                                  ord.status === "delivered" ? "#DCFCE7" : ord.status === "dispatched" ? "#E0F2FE" : ord.status === "cancelled" ? "#FEE2E2" : "#FEF3C7",
                                color:
                                  ord.status === "delivered" ? "#166534" : ord.status === "dispatched" ? "#0369A1" : ord.status === "cancelled" ? "#991B1B" : "#92400E"
                              }}
                            >
                              ● {ord.status || "confirmed"}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "4px" }}>
                            Placed on {orderDate} · Customer: <strong style={{ color: "var(--color-ink)" }}>{ord.customer_name}</strong>
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ textAlign: "right" }}>
                            <span className="maru-eyebrow" style={{ fontSize: "0.58rem" }}>TOTAL AMOUNT</span>
                            <div className="font-display" style={{ fontSize: "1.4rem" }}>
                              {formatPrice(ord.total_amount_inr, "INR")}
                            </div>
                          </div>
                          <select
                            value={ord.status || "confirmed"}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            style={{
                              padding: "7px 10px",
                              fontSize: "0.75rem",
                              border: "1px solid var(--color-border)",
                              backgroundColor: "#FFF",
                              fontWeight: 600,
                              cursor: "pointer",
                              textTransform: "uppercase"
                            }}
                          >
                            <option value="confirmed">CONFIRMED</option>
                            <option value="dispatched">DISPATCHED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Coordinates & Items Grid */}
                      <div className="admin-2col-grid">
                        <div style={{ backgroundColor: "var(--color-cream)", padding: "1.2rem", fontSize: "0.82rem" }}>
                          <span className="maru-eyebrow" style={{ fontSize: "0.58rem", marginBottom: "6px", display: "block" }}>
                            DISPATCH COORDINATES
                          </span>
                          <p style={{ fontWeight: 600, marginBottom: "3px" }}>{ord.customer_name}</p>
                          <p style={{ color: "rgba(14, 13, 13, 0.75)", lineHeight: "1.5" }}>
                            {ord.customer_address}
                            {ord.customer_city && `, ${ord.customer_city}`}
                            {ord.customer_pincode && ` - ${ord.customer_pincode}`}
                          </p>
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed rgba(14, 13, 13, 0.15)", fontSize: "0.78rem", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <span>📞 {ord.customer_phone || "Not provided"}</span>
                            <span>✉️ {ord.customer_email || "Not provided"}</span>
                          </div>
                        </div>

                        <div>
                          <span className="maru-eyebrow" style={{ fontSize: "0.58rem", marginBottom: "8px", display: "block" }}>
                            ACQUIRED RELICS ({itemsList.length})
                          </span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {itemsList.map((it, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  backgroundColor: "#FFF",
                                  border: "1px solid var(--color-border)",
                                  padding: "8px 12px"
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  {it.imagePrimary && (
                                    <img src={it.imagePrimary} alt={it.name} style={{ width: "36px", height: "48px", objectFit: "cover" }} />
                                  )}
                                  <div>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{it.name}</div>
                                    <div style={{ fontSize: "0.68rem", color: "rgba(14, 13, 13, 0.6)" }}>
                                      Size: {it.selectedSize || "One Size"} {it.quantity > 1 ? `· Qty: ${it.quantity}` : ""}
                                      {it.isAuctionWin && " · [AUCTION WINNER]"}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                                  {formatPrice(it.priceINR || 0, "INR")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CUSTOMERS & PATRONS DIRECTORY                           */}
        {/* ============================================================== */}
        {activeTab === "customers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.8rem" }}>
              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                  PATRON CRM & PURCHASE LEDGER
                </span>
                <h2 className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                  ATELIER PATRONS & BUYERS
                </h2>
                <p style={{ fontSize: "0.88rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Aggregated buyer profiles with lifetime acquisition volume, contact coordinates, and owned relics.
                </p>
              </div>

              <div style={{ position: "relative", width: "300px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(14, 13, 13, 0.4)" }} />
                <input
                  type="text"
                  placeholder="Search patron, phone, city, or piece..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 38px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF", outline: "none" }}
                />
              </div>
            </div>

            {filteredPatrons.length === 0 ? (
              <div style={{ backgroundColor: "var(--color-ivory)", padding: "3.5rem 2rem", textAlign: "center", border: "1px solid var(--color-border)" }}>
                <Users size={42} style={{ color: "rgba(14, 13, 13, 0.25)", margin: "0 auto 1rem" }} />
                <h3 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>
                  {customerSearch ? "NO MATCHING PATRONS FOUND" : "NO PATRON RECORDS YET"}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.65)", maxWidth: "480px", margin: "0 auto" }}>
                  When clients acquire relics or win live auctions, their lifetime profile will be compiled here automatically.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
                {filteredPatrons.map((patron) => (
                  <div
                    key={patron.key}
                    style={{
                      backgroundColor: "var(--color-ivory)",
                      border: "1px solid var(--color-border)",
                      padding: "1.8rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                        <div>
                          <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                            VERIFIED PATRON
                          </span>
                          <h3 className="font-display" style={{ fontSize: "1.5rem", marginTop: "2px" }}>
                            {patron.name}
                          </h3>
                          <span style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.6)" }}>
                            {patron.city ? `📍 ${patron.city}` : "Pan-India"} · {patron.ordersCount} {patron.ordersCount === 1 ? "Acquisition" : "Acquisitions"}
                          </span>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span className="maru-eyebrow" style={{ fontSize: "0.55rem" }}>LIFETIME SPEND</span>
                          <div className="font-display" style={{ fontSize: "1.3rem", color: "#166534" }}>
                            {formatPrice(patron.totalSpend, "INR")}
                          </div>
                        </div>
                      </div>

                      {/* Contact Coordinates */}
                      <div style={{ backgroundColor: "var(--color-cream)", padding: "10px 14px", border: "1px solid var(--color-border)", marginBottom: "1rem", fontSize: "0.78rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <Phone size={12} color="rgba(14, 13, 13, 0.6)" />
                          <span>{patron.phone || "No phone provided"}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Mail size={12} color="rgba(14, 13, 13, 0.6)" />
                          <span>{patron.email || "No email provided"}</span>
                        </div>
                      </div>

                      {/* Acquired Relics Gallery */}
                      <div>
                        <span className="maru-eyebrow" style={{ fontSize: "0.58rem", marginBottom: "8px", display: "block" }}>
                          ACQUIRED ARCHIVAL PIECES ({patron.acquisitions.length})
                        </span>
                        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                          {patron.acquisitions.map((acq, idx) => (
                            <div
                              key={idx}
                              title={`${acq.name} · ${acq.code}`}
                              style={{
                                width: "60px",
                                height: "80px",
                                backgroundColor: "#FFF",
                                border: "1px solid var(--color-border)",
                                flexShrink: 0,
                                position: "relative",
                                overflow: "hidden"
                              }}
                            >
                              {acq.imagePrimary && (
                                <img src={acq.imagePrimary} alt={acq.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Outreach Links */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px dashed var(--color-border)" }}>
                      {patron.phone && (
                        <a
                          href={`https://wa.me/${patron.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${patron.name}, greetings from Indie Summer Atelier regarding your vintage archival acquisitions.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            flex: 1,
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            backgroundColor: "#166534",
                            color: "#FFF",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          <MessageCircle size={13} /> WHATSAPP
                        </a>
                      )}
                      {patron.email && (
                        <a
                          href={`mailto:${patron.email}?subject=${encodeURIComponent("Indie Summer Atelier — Archival Piece Concierge")}`}
                          style={{
                            flex: 1,
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            backgroundColor: "transparent",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-ink)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          <Mail size={13} /> EMAIL
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: LIVE AUCTIONS & BIDDING PORTAL                          */}
        {/* ============================================================== */}
        {activeTab === "bidding" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                AUCTION MANAGEMENT & RESOLUTION (MIN ₹500 INCREMENT ENFORCED)
              </span>
              <h2 className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                LIVE ATELIER BIDDING PORTAL
              </h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                Real-time oversight of leading bids, patron pseudonyms, bid ledgers, and auction closure settlements.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              {products.filter((p) => p.isBidding).map((prod) => (
                <div key={prod.id} style={{ backgroundColor: "var(--color-ivory)", border: "1.5px solid var(--color-ink)", padding: "1.8rem" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
                    <img src={prod.imagePrimary} alt={prod.name} style={{ width: "65px", height: "85px", objectFit: "cover" }} />
                    <div>
                      <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                        {prod.code}
                      </span>
                      <h3 className="font-display" style={{ fontSize: "1.3rem", marginTop: "2px" }}>
                        {prod.name}
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)" }}>
                        Min Increment: ₹{prod.minBidIncrementINR || 500}
                      </span>
                      {prod.auctionEndTime && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.68rem", color: "var(--color-siren)", marginTop: "4px", fontWeight: 700 }}>
                          <Clock size={11} />
                          <span>ENDS: {new Date(prod.auctionEndTime).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "var(--color-cream)", padding: "12px", border: "1px solid var(--color-border)", marginBottom: "1.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                        LEADING OFFER:
                      </span>
                      <span style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-sans)", color: "var(--color-siren)" }}>
                        ₹{(prod.currentBidINR || prod.priceINR).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "4px" }}>
                      <span>Next Min: ₹{((prod.currentBidINR || prod.priceINR) + (prod.minBidIncrementINR || 500)).toLocaleString("en-IN")}</span>
                      <span>Total Bids: {prod.bidsCount || 0}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenBidHistory(prod)}
                        className="azar-btn-black"
                        style={{ flex: 1, height: "38px", fontSize: "0.68rem", backgroundColor: "var(--color-ink)", color: "#FFF" }}
                      >
                        <Eye size={13} /> INSPECT BIDS ({prod.bidsCount || 0})
                      </button>
                      <Link
                        href={`/product/${prod.id}#bidding`}
                        target="_blank"
                        style={{
                          padding: "0 12px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "#FFF",
                          color: "var(--color-ink)",
                          textDecoration: "none"
                        }}
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfirmCloseProduct(prod)}
                      style={{
                        width: "100%",
                        height: "36px",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        backgroundColor: "rgba(169, 36, 36, 0.1)",
                        border: "1px solid var(--color-siren)",
                        color: "var(--color-siren)",
                        cursor: "pointer"
                      }}
                    >
                      AWARD PIECE & CLOSE AUCTION
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resolved / Closed Auctions Section */}
            <div style={{ marginTop: "3.5rem" }}>
              <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)" }}>
                HISTORICAL AUCTION SETTLEMENTS
              </span>
              <h3 className="font-display" style={{ fontSize: "1.6rem", marginTop: "4px", marginBottom: "1rem" }}>
                RESOLVED & CLAIMED AUCTION RELICS
              </h3>

              <div style={{ backgroundColor: "var(--color-ivory)", border: "1px solid var(--color-border)", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid var(--color-border)", backgroundColor: "var(--color-cream)", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.14em" }}>
                      <th style={{ padding: "12px 16px" }}>PIECE</th>
                      <th style={{ padding: "12px 16px" }}>FINAL WINNING BID</th>
                      <th style={{ padding: "12px 16px" }}>WINNING PATRON</th>
                      <th style={{ padding: "12px 16px" }}>STATUS</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>RE-OPEN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter((p) => !p.isBidding && (p.status === "reserved" || p.status === "sold" || p.winningBidder)).map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={p.imagePrimary} alt={p.name} style={{ width: "36px", height: "48px", objectFit: "cover" }} />
                            <div>
                              <div style={{ fontWeight: 700 }}>{p.name}</div>
                              <span style={{ fontSize: "0.68rem", color: "var(--color-siren)" }}>{p.code}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--color-siren)" }}>
                          {formatPrice(p.currentBidINR || p.priceINR, "INR")}
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                          {p.winningBidder || "Archival Patron"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: "0.68rem", padding: "2px 8px", backgroundColor: "#DCFCE7", color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleReopenAuction(p)}
                            style={{ padding: "4px 8px", fontSize: "0.68rem", border: "1px solid var(--color-border)", background: "#FFF", cursor: "pointer" }}
                          >
                            RE-ACTIVATE AUCTION
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: 1-OF-1 PRODUCTS CATALOG                                */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.8rem" }}>
              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                  CATALOG INVENTORY · 1-OF-1 SILHOUETTES
                </span>
                <h2 className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                  VINTAGE RELICS CATALOG
                </h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.65)" }}>
                  Manage individual vintage Indian saree gowns, upload original textiles, and control acquisition types.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="azar-btn-black"
                style={{ fontSize: "0.72rem", height: "42px" }}
              >
                <Plus size={15} /> INTRODUCE 1-OF-1 RELIC
              </button>
            </div>

            {/* Product Filters & Search */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(14, 13, 13, 0.4)" }} />
                <input
                  type="text"
                  placeholder="Filter by piece name, code, or textile material..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 38px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF", outline: "none" }}
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                style={{ padding: "10px 14px", fontSize: "0.78rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
              >
                <option value="all">ALL CATEGORIES</option>
                <option value="vintage-saree">Vintage Saree Gowns</option>
                <option value="vintage-dupatta">Repurposed Dupatta Sets</option>
                <option value="remnants">Zero-Waste Accents</option>
              </select>

              <select
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value)}
                style={{ padding: "10px 14px", fontSize: "0.78rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
              >
                <option value="all">ALL ACQUISITION MODES</option>
                <option value="bidding">⚡ Active Auctions Only</option>
                <option value="direct">Direct Buy Only</option>
                <option value="available">Available Relics</option>
                <option value="sold">Sold / Claimed</option>
              </select>
            </div>

            {/* Product Table */}
            <div style={{ backgroundColor: "var(--color-ivory)", border: "1px solid var(--color-border)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1.5px solid var(--color-border)", backgroundColor: "var(--color-cream)", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.14em" }}>
                    <th style={{ padding: "14px 16px" }}>PIECE</th>
                    <th style={{ padding: "14px 16px" }}>CATEGORY</th>
                    <th style={{ padding: "14px 16px" }}>PRICE / LEADING BID</th>
                    <th style={{ padding: "14px 16px" }}>SALE TYPE</th>
                    <th style={{ padding: "14px 16px" }}>STATUS</th>
                    <th style={{ padding: "14px 16px", textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={p.imagePrimary}
                            alt={p.name}
                            style={{ width: "42px", height: "56px", objectFit: "cover", border: "1px solid var(--color-border)" }}
                          />
                          <div>
                            <span style={{ fontSize: "0.62rem", color: "var(--color-siren)", fontWeight: 700 }}>
                              {p.code}
                            </span>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{p.name}</div>
                            <span className="font-serif italic" style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)" }}>
                              {p.material}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px", textTransform: "uppercase", fontSize: "0.72rem" }}>
                        {p.category}
                      </td>

                      <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                        {p.isBidding ? (
                          <div>
                            <span style={{ color: "var(--color-siren)", fontSize: "0.65rem", display: "block" }}>
                              HIGH BID ({p.bidsCount || 0} BIDS)
                            </span>
                            ₹{(p.currentBidINR || p.priceINR).toLocaleString("en-IN")}
                          </div>
                        ) : (
                          <div>₹{p.priceINR.toLocaleString("en-IN")}</div>
                        )}
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            border: p.isBidding ? "1px solid var(--color-siren)" : "1px solid var(--color-border)",
                            backgroundColor: p.isBidding ? "rgba(169, 36, 36, 0.12)" : "transparent",
                            color: p.isBidding ? "var(--color-siren)" : "var(--color-ink)"
                          }}
                        >
                          {p.isBidding ? "⚡ LIVE AUCTION" : "DIRECT BUY"}
                        </span>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            backgroundColor: p.status === "available" ? "rgba(34, 197, 94, 0.1)" : "rgba(14, 13, 13, 0.1)",
                            color: p.status === "available" ? "#166534" : "#666"
                          }}
                        >
                          {p.status || "available"}
                        </span>
                      </td>

                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...p })}
                            style={{ padding: "6px", background: "none", border: "1px solid var(--color-border)", cursor: "pointer" }}
                            title="Edit Piece"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            style={{ padding: "6px", background: "none", border: "1px solid var(--color-border)", color: "var(--color-siren)", cursor: "pointer" }}
                            title="Delete Piece"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: WEBSITE CUSTOMIZATION                                  */}
        {/* ============================================================== */}
        {activeTab === "customization" && (
          <div style={{ backgroundColor: "var(--color-ivory)", padding: "2.5rem", border: "1px solid var(--color-border)", maxWidth: "900px" }}>
            <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1.2rem" }}>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.62rem" }}>
                LIVE STOREFRONT CMS
              </span>
              <h2 className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                EDITORIAL & PROMO CUSTOMIZATION
              </h2>
              <p className="font-serif italic" style={{ fontSize: "1rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                Typography, drop volume announcements, concierge coordinates, and checkout discount codes.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                  TOP RUNNING MARQUEE ANNOUNCEMENT
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.marqueeTicker}
                  onChange={(e) => setSettingsForm({ ...settingsForm, marqueeTicker: e.target.value })}
                  style={{ width: "100%", padding: "12px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                  HERO MAIN HEADLINE
                </label>
                <input
                  type="text"
                  value={settingsForm.heroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  style={{ width: "100%", padding: "12px", fontSize: "1.1rem", fontWeight: 600, border: "1px solid var(--color-border)", backgroundColor: "#FFF", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                  HERO EDITORIAL SUBTITLE
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.heroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  style={{ width: "100%", padding: "12px", fontSize: "0.9rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF", outline: "none" }}
                />
              </div>

              <div className="admin-2col-grid">
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    CURRENT DROP VOLUME
                  </label>
                  <input
                    type="text"
                    value={settingsForm.currentVolume}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currentVolume: e.target.value })}
                    style={{ width: "100%", padding: "10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    DROP STATUS BADGE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.dropStatus}
                    onChange={(e) => setSettingsForm({ ...settingsForm, dropStatus: e.target.value })}
                    style={{ width: "100%", padding: "10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                  />
                </div>
              </div>

              <div className="admin-2col-grid">
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ACTIVE PROMO CODE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.promoCode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoCode: e.target.value })}
                    style={{ width: "100%", padding: "10px", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    DISCOUNT PERCENTAGE (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={settingsForm.promoDiscount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoDiscount: Number(e.target.value) })}
                    style={{ width: "100%", padding: "10px", fontSize: "0.85rem", fontWeight: 700, border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                  />
                </div>
              </div>

              <div className="admin-2col-grid">
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ATELIER CONCIERGE PHONE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phoneContact}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phoneContact: e.target.value })}
                    style={{ width: "100%", padding: "10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ATELIER EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={settingsForm.emailContact}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emailContact: e.target.value })}
                    style={{ width: "100%", padding: "10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="azar-btn-black" style={{ height: "50px", padding: "0 2rem", fontSize: "0.75rem" }}>
                  SAVE & SYNC TO STOREFRONT
                </button>
                {settingsSaved && (
                  <span style={{ color: "#166534", fontWeight: 600, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Check size={16} /> Saved and applied successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: SUPABASE DATABASE INTEGRATION                           */}
        {/* ============================================================== */}
        {activeTab === "sql_setup" && (
          <div style={{ backgroundColor: "var(--color-ivory)", padding: "2.5rem", border: "1px solid var(--color-border)", maxWidth: "900px" }}>
            <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1.2rem" }}>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                POSTGRESQL CLUSTER CONFIGURATION
              </span>
              <h2 className="font-display" style={{ fontSize: "2.4rem", marginTop: "4px" }}>
                SUPABASE DATABASE INTEGRATION
              </h2>
              <p style={{ fontSize: "0.9rem", color: "rgba(14, 13, 13, 0.75)", marginTop: "6px" }}>
                Target cluster <code>gqvmdrtlocvidjtiyycv</code> schema DDL, RLS policies, and one-click data migration.
              </p>
            </div>

            <div style={{ backgroundColor: "var(--color-cream)", padding: "1.5rem", border: "1px solid var(--color-border)", marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                CONNECTION DIAGNOSTICS
              </h3>
              <div className="admin-2col-grid" style={{ gap: "10px", fontSize: "0.82rem" }}>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Project Reference:</span>
                  <div style={{ fontWeight: 600 }}>gqvmdrtlocvidjtiyycv</div>
                </div>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Endpoint:</span>
                  <div style={{ fontWeight: 600 }}>https://gqvmdrtlocvidjtiyycv.supabase.co</div>
                </div>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Client Status:</span>
                  <div style={{ color: isSupabaseConfigured ? "#166534" : "#A92424", fontWeight: 700 }}>
                    {isSupabaseConfigured ? "✓ Connected & Ready (.env.local active)" : "Needs Configuration"}
                  </div>
                </div>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Direct Link:</span>
                  <div>
                    <a
                      href="https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--color-siren)", textDecoration: "underline", fontWeight: 600 }}
                    >
                      Open Supabase SQL Editor ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "2.5rem" }}>
              <button
                type="button"
                onClick={handleSyncSupabaseSeed}
                disabled={syncingDb}
                className="azar-btn-black"
                style={{ height: "48px", fontSize: "0.75rem" }}
              >
                <RefreshCw size={14} className={syncingDb ? "animate-spin" : ""} />
                {syncingDb ? "SYNCING TO SUPABASE..." : "PUSH CATALOG & SETTINGS TO SUPABASE"}
              </button>

              {syncStatus && (
                <p style={{ marginTop: "10px", fontSize: "0.82rem", fontWeight: 600, color: syncStatus.includes("Success") ? "#166534" : "var(--color-siren)" }}>
                  {syncStatus}
                </p>
              )}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="maru-eyebrow" style={{ fontSize: "0.62rem" }}>
                  SQL SCHEMA DDL & STRICT RLS POLICIES
                </span>
                <button
                  type="button"
                  onClick={copySqlCode}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--color-border)",
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {copiedSql ? (
                    <>
                      <Check size={12} color="#166534" /> COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> COPY SQL
                    </>
                  )}
                </button>
              </div>

              <pre
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "#E2E8F0",
                  padding: "1.2rem",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  maxHeight: "340px",
                  overflowY: "auto",
                  lineHeight: "1.5"
                }}
              >
{`CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  price_inr NUMERIC NOT NULL,
  category TEXT DEFAULT 'vintage-saree',
  is_one_of_one BOOLEAN DEFAULT TRUE,
  is_bidding BOOLEAN DEFAULT FALSE,
  starting_bid_inr NUMERIC DEFAULT 0,
  current_bid_inr NUMERIC DEFAULT 0,
  min_bid_increment_inr NUMERIC DEFAULT 500,
  bids_count INT DEFAULT 0,
  status TEXT DEFAULT 'available',
  material TEXT,
  origin TEXT,
  image_primary TEXT NOT NULL,
  image_secondary TEXT,
  description TEXT,
  auction_end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  bidder_contact TEXT,
  amount_inr NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_pincode TEXT,
  payment_method TEXT DEFAULT 'upi',
  total_amount_inr NUMERIC NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
              </pre>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 1: CONFIRM CLOSE AUCTION & AWARD WINNER                  */}
        {/* ============================================================== */}
        {confirmCloseProduct && (
          <div className="overlay-backdrop" onClick={() => setConfirmCloseProduct(null)} style={{ zIndex: 150 }}>
            <div
              className="product-modal-container"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "540px",
                backgroundColor: "var(--color-ivory)",
                padding: "2.2rem",
                border: "2px solid var(--color-ink)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                    AUCTION RESOLUTION CEREMONY
                  </span>
                  <h3 className="font-display" style={{ fontSize: "1.8rem", marginTop: "2px" }}>
                    AWARD & CLOSE AUCTION
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmCloseProduct(null)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.75)", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                Closing this auction will lock the winning offer, preserve the valuation, set the relic status to{" "}
                <strong>Reserved/Claimed</strong>, and automatically issue a dispatch-ready order in your Orders tab.
              </p>

              <div style={{ backgroundColor: "var(--color-cream)", padding: "1.2rem", border: "1px solid var(--color-border)", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img src={confirmCloseProduct.imagePrimary} alt="" style={{ width: "50px", height: "65px", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{confirmCloseProduct.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.6)" }}>{confirmCloseProduct.code}</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-siren)", marginTop: "4px" }}>
                      Winning Valuation: {formatPrice(confirmCloseProduct.currentBidINR || confirmCloseProduct.priceINR, "INR")}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleFinalizeAndCloseAuction(confirmCloseProduct)}
                  className="azar-btn-black"
                  style={{ flex: 1, height: "46px", fontSize: "0.75rem", backgroundColor: "var(--color-siren)", color: "#FFF" }}
                >
                  <Award size={15} /> CONFIRM AWARD & CREATE ORDER
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCloseProduct(null)}
                  style={{ padding: "0 18px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontSize: "0.75rem" }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: INSPECT INDIVIDUAL BID HISTORY                        */}
        {/* ============================================================== */}
        {selectedBidRelic && (
          <div className="overlay-backdrop" onClick={() => setSelectedBidRelic(null)} style={{ zIndex: 145 }}>
            <div
              className="product-modal-container"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "680px",
                backgroundColor: "var(--color-ivory)",
                padding: "2.2rem",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
                <div>
                  <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                    PROVENANCE & BID LEDGER · {selectedBidRelic.code}
                  </span>
                  <h3 className="font-display" style={{ fontSize: "1.8rem", marginTop: "2px" }}>
                    {selectedBidRelic.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(14, 13, 13, 0.6)" }}>
                    Every offer placed on this archival piece in order of valuation.
                  </p>
                </div>
                <button type="button" onClick={() => setSelectedBidRelic(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              {relicBidsLoading ? (
                <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                  <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 10px" }} />
                  <span style={{ fontSize: "0.8rem" }}>Querying atelier bid logs...</span>
                </div>
              ) : relicBidsList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2.5rem 1rem", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
                  <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.6)" }}>
                    No individual bids recorded yet. Starting reserve: {formatPrice(selectedBidRelic.startingBidINR || selectedBidRelic.priceINR, "INR")}.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
                  {relicBidsList.map((bid, idx) => {
                    const isWinner = idx === 0;
                    return (
                      <div
                        key={bid.id || idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          backgroundColor: isWinner ? "rgba(169, 36, 36, 0.05)" : "#FFF",
                          border: isWinner ? "1.5px solid var(--color-siren)" : "1px solid var(--color-border)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "24px",
                              height: "24px",
                              lineHeight: "24px",
                              textAlign: "center",
                              borderRadius: "50%",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              backgroundColor: isWinner ? "var(--color-siren)" : "var(--color-cream)",
                              color: isWinner ? "#FFF" : "var(--color-ink)"
                            }}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{bid.bidder_name}</span>
                              {isWinner && (
                                <span style={{ fontSize: "0.6rem", fontWeight: 700, backgroundColor: "var(--color-siren)", color: "#FFF", padding: "1px 6px", textTransform: "uppercase" }}>
                                  LEADING OFFER
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.6)" }}>
                              {bid.bidder_contact || "Coordinates verified"} · {new Date(bid.created_at || Date.now()).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: isWinner ? "var(--color-siren)" : "var(--color-ink)" }}>
                            {formatPrice(bid.amount_inr, "INR")}
                          </div>
                          {isWinner && selectedBidRelic.isBidding && (
                            <button
                              type="button"
                              onClick={() => handleFinalizeAndCloseAuction(selectedBidRelic, bid)}
                              style={{
                                padding: "6px 12px",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                backgroundColor: "var(--color-siren)",
                                color: "#FFF",
                                border: "none",
                                cursor: "pointer"
                              }}
                            >
                              AWARD PIECE
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: EDIT PRODUCT MODAL (WITH IMAGE UPLOAD + DEADLINE)     */}
        {/* ============================================================== */}
        {editingProduct && (
          <div className="overlay-backdrop" onClick={() => setEditingProduct(null)} style={{ zIndex: 140 }}>
            <div
              className="product-modal-container"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "640px",
                backgroundColor: "var(--color-ivory)",
                padding: "2.2rem",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <h3 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>
                EDIT VINTAGE RELIC
              </h3>
              <p className="font-serif italic" style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.5rem" }}>
                Update pricing, live auction schedule, textile images, or provenance narrative.
              </p>

              <form onSubmit={handleSaveEditProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    PIECE NAME
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div className="admin-2col-grid" style={{ gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      PRICE (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.priceINR}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceINR: Number(e.target.value) })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      STATUS
                    </label>
                    <select
                      value={editingProduct.status || "available"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                    >
                      <option value="available">Available for Acquisition</option>
                      <option value="reserved">Reserved by Patron</option>
                      <option value="sold">Sold / Claimed</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload Control */}
                <div style={{ padding: "12px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                    PRIMARY RELIC IMAGE
                  </label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {editingProduct.imagePrimary && (
                      <img
                        src={editingProduct.imagePrimary}
                        alt="Preview"
                        style={{ width: "50px", height: "65px", objectFit: "cover", border: "1px solid var(--color-border)" }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="edit-image-upload"
                        onChange={(e) => handleImageFileUpload(e, true)}
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="edit-image-upload"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          backgroundColor: "#FFF",
                          border: "1px solid var(--color-border)",
                          cursor: "pointer",
                          fontSize: "0.72rem",
                          fontWeight: 700
                        }}
                      >
                        <Upload size={13} /> {imageUploading ? "OPTIMIZING..." : "UPLOAD NEW IMAGE FILE"}
                      </label>
                      {imageUploadNotice && (
                        <div style={{ fontSize: "0.72rem", color: "var(--color-siren)", marginTop: "4px", fontWeight: 600 }}>
                          {imageUploadNotice}
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Or enter image URL..."
                        value={editingProduct.imagePrimary}
                        onChange={(e) => setEditingProduct({ ...editingProduct, imagePrimary: e.target.value })}
                        style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--color-border)", marginTop: "6px", backgroundColor: "#FFF" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Auction Settings */}
                <div style={{ padding: "12px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <input
                      type="checkbox"
                      checked={editingProduct.isBidding || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isBidding: e.target.checked })}
                    />
                    <span>ENABLE LIVE ATELIER AUCTION FOR THIS PIECE</span>
                  </label>

                  {editingProduct.isBidding && (
                    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className="admin-2col-grid" style={{ gap: "10px" }}>
                        <div>
                          <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Current Leading Bid (₹)</span>
                          <input
                            type="number"
                            value={editingProduct.currentBidINR || editingProduct.priceINR}
                            onChange={(e) => setEditingProduct({ ...editingProduct, currentBidINR: Number(e.target.value) })}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Min Increment (₹500 min)</span>
                          <input
                            type="number"
                            min={500}
                            step={500}
                            value={editingProduct.minBidIncrementINR || 500}
                            onChange={(e) => setEditingProduct({ ...editingProduct, minBidIncrementINR: Number(e.target.value) })}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                          />
                        </div>
                      </div>

                      {/* Auction Deadline */}
                      <div>
                        <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Auction End Deadline</span>
                        <input
                          type="datetime-local"
                          value={editingProduct.auctionEndTime ? editingProduct.auctionEndTime.slice(0, 16) : ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, auctionEndTime: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                        />
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                          {[
                            { label: "+24 Hours", hours: 24 },
                            { label: "+48 Hours", hours: 48 },
                            { label: "+7 Days", hours: 168 }
                          ].map((dur) => (
                            <button
                              key={dur.label}
                              type="button"
                              onClick={() => {
                                const d = new Date();
                                d.setHours(d.getHours() + dur.hours);
                                setEditingProduct({ ...editingProduct, auctionEndTime: d.toISOString() });
                              }}
                              style={{ padding: "3px 8px", fontSize: "0.62rem", border: "1px solid var(--color-border)", background: "#FFF", cursor: "pointer" }}
                            >
                              {dur.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    MATERIAL SPECIFICATION
                  </label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    ORIGIN & PROVENANCE
                  </label>
                  <input
                    type="text"
                    value={editingProduct.origin}
                    onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button type="submit" className="azar-btn-black" style={{ flex: 1, height: "44px", fontSize: "0.72rem" }}>
                    SAVE CHANGES
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    style={{ padding: "0 18px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontSize: "0.72rem" }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 4: ADD NEW 1-OF-1 RELIC (WITH IMAGE UPLOAD + DEADLINE)   */}
        {/* ============================================================== */}
        {isAddingNew && (
          <div className="overlay-backdrop" onClick={() => setIsAddingNew(false)} style={{ zIndex: 140 }}>
            <div
              className="product-modal-container"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "640px",
                backgroundColor: "var(--color-ivory)",
                padding: "2.2rem",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <h3 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>
                INTRODUCE NEW 1-OF-1 RELIC
              </h3>
              <p className="font-serif italic" style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.5rem" }}>
                Add a newly sourced vintage Indian saree or repurposed dupatta garment to Volume 001.
              </p>

              <form onSubmit={handleAddNewProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    PIECE NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. THE CHANDERI OPULENCE SLIP"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div className="admin-2col-grid" style={{ gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      PRICE (INR ₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={newProductForm.priceINR}
                      onChange={(e) => setNewProductForm({ ...newProductForm, priceINR: Number(e.target.value) })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      CATEGORY
                    </label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                    >
                      <option value="vintage-saree">Vintage Saree Gowns</option>
                      <option value="vintage-dupatta">Repurposed Dupatta Sets</option>
                      <option value="remnants">Zero-Waste Accents & Scarves</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload Control */}
                <div style={{ padding: "12px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                    PRIMARY RELIC IMAGE
                  </label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {newProductForm.imagePrimary && (
                      <img
                        src={newProductForm.imagePrimary}
                        alt="Preview"
                        style={{ width: "50px", height: "65px", objectFit: "cover", border: "1px solid var(--color-border)" }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="new-image-upload"
                        onChange={(e) => handleImageFileUpload(e, false)}
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="new-image-upload"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          backgroundColor: "#FFF",
                          border: "1px solid var(--color-border)",
                          cursor: "pointer",
                          fontSize: "0.72rem",
                          fontWeight: 700
                        }}
                      >
                        <Upload size={13} /> {imageUploading ? "OPTIMIZING..." : "UPLOAD NEW IMAGE FILE"}
                      </label>
                      {imageUploadNotice && (
                        <div style={{ fontSize: "0.72rem", color: "var(--color-siren)", marginTop: "4px", fontWeight: 600 }}>
                          {imageUploadNotice}
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Or enter image URL / path..."
                        value={newProductForm.imagePrimary}
                        onChange={(e) => setNewProductForm({ ...newProductForm, imagePrimary: e.target.value })}
                        style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--color-border)", marginTop: "6px", backgroundColor: "#FFF" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Auction Toggle */}
                <div style={{ padding: "12px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <input
                      type="checkbox"
                      checked={newProductForm.isBidding}
                      onChange={(e) => setNewProductForm({ ...newProductForm, isBidding: e.target.checked })}
                    />
                    <span>ENABLE LIVE ATELIER BIDDING FOR THIS PIECE</span>
                  </label>

                  {newProductForm.isBidding && (
                    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className="admin-2col-grid" style={{ gap: "10px" }}>
                        <div>
                          <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Starting Reserve (₹)</span>
                          <input
                            type="number"
                            value={newProductForm.startingBidINR}
                            onChange={(e) => setNewProductForm({ ...newProductForm, startingBidINR: Number(e.target.value), currentBidINR: Number(e.target.value) })}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Min Increment (Min ₹500)</span>
                          <input
                            type="number"
                            min={500}
                            step={500}
                            value={newProductForm.minBidIncrementINR}
                            onChange={(e) => setNewProductForm({ ...newProductForm, minBidIncrementINR: Number(e.target.value) })}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                          />
                        </div>
                      </div>

                      {/* Auction Deadline */}
                      <div>
                        <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Auction End Deadline</span>
                        <input
                          type="datetime-local"
                          value={newProductForm.auctionEndTime ? newProductForm.auctionEndTime.slice(0, 16) : ""}
                          onChange={(e) => setNewProductForm({ ...newProductForm, auctionEndTime: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                        />
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                          {[
                            { label: "+24 Hours", hours: 24 },
                            { label: "+48 Hours", hours: 48 },
                            { label: "+7 Days", hours: 168 }
                          ].map((dur) => (
                            <button
                              key={dur.label}
                              type="button"
                              onClick={() => {
                                const d = new Date();
                                d.setHours(d.getHours() + dur.hours);
                                setNewProductForm({ ...newProductForm, auctionEndTime: d.toISOString() });
                              }}
                              style={{ padding: "3px 8px", fontSize: "0.62rem", border: "1px solid var(--color-border)", background: "#FFF", cursor: "pointer" }}
                            >
                              {dur.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    MATERIAL SPECIFICATION
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductForm.material}
                    onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    ORIGIN & PROVENANCE
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductForm.origin}
                    onChange={(e) => setNewProductForm({ ...newProductForm, origin: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button type="submit" className="azar-btn-black" style={{ flex: 1, height: "44px", fontSize: "0.72rem" }}>
                    PUBLISH 1-OF-1 PIECE
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    style={{ padding: "0 18px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontSize: "0.72rem" }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
