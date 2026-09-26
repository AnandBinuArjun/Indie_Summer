/**
 * Unified Order Storage Abstraction for Indie Summer
 * Manages client-side persistence and fallback for customer orders.
 */

const ORDERS_STORAGE_KEY = "indie_summer_orders";

export function getLocalOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to parse local orders cache:", err);
    return [];
  }
}

export function saveLocalOrder(newOrder) {
  if (typeof window === "undefined" || !newOrder) return;
  try {
    const existing = getLocalOrders();
    const filtered = existing.filter((o) => o.id !== newOrder.id && o.order_ref !== newOrder.order_ref);
    const updated = [newOrder, ...filtered];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to save order to local cache:", err);
  }
}

export function updateLocalOrderStatus(orderId, newStatus) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalOrders();
    const updated = existing.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to update local order status:", err);
  }
}
