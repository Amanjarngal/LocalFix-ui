// src/services/renovationService.js
const API_BASE = import.meta.env.VITE_API_URL;

// ─────────────────────────────────────────
// 1. Create Renovation Request
// ─────────────────────────────────────────
export const createRenovationRequest = async (data) => {
  const res = await fetch(`${API_BASE}/api/renovations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create renovation request");
  return result.data;
};

// ─────────────────────────────────────────
// 2. Get All Renovation Requests (Browse)
// ─────────────────────────────────────────
export const getAllRenovationRequests = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/api/renovations/browse?${params}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch requests");
  return result.data;
};

// ─────────────────────────────────────────
// 3. Get User's Renovation Requests
// ─────────────────────────────────────────
export const getMyRenovationRequests = async () => {
  const res = await fetch(`${API_BASE}/api/renovations/my-requests`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch requests");
  return result.data;
};

// ─────────────────────────────────────────
// 4. Get Available Providers
// ─────────────────────────────────────────
export const getAvailableProviders = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/api/renovations/providers?${params}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch providers");
  return result.data;
};

// ─────────────────────────────────────────
// 5. Get Single Renovation Request
// ─────────────────────────────────────────
export const getRenovationRequest = async (id) => {
  const res = await fetch(`${API_BASE}/api/renovations/${id}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch request");
  return result.data;
};

// ─────────────────────────────────────────
// 6. Provider: Get Available Renovation Requests
// ─────────────────────────────────────────
export const getAvailableRenovationRequests = async () => {
  const res = await fetch(`${API_BASE}/api/renovations/provider/available`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch available requests");
  return result.data;
};

// ─────────────────────────────────────────
// 7. Provider: Get Accepted Renovation Requests
// ─────────────────────────────────────────
export const getAcceptedRenovationRequests = async () => {
  const res = await fetch(`${API_BASE}/api/renovations/provider/accepted`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch accepted requests");
  return result.data;
};

// ─────────────────────────────────────────
// 8. Provider: Submit Quote
// ─────────────────────────────────────────
export const submitQuote = async (renovationRequestId, quoteData) => {
  const res = await fetch(`${API_BASE}/api/renovations/${renovationRequestId}/quote`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quoteData),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to submit quote");
  return result.data;
};

// ─────────────────────────────────────────
// 9. Customer: Accept Quote
// ─────────────────────────────────────────
export const acceptQuote = async (renovationRequestId, providerId) => {
  const res = await fetch(`${API_BASE}/api/renovations/${renovationRequestId}/accept-quote/${providerId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to accept quote");
  return result.data;
};

// ─────────────────────────────────────────
// 10. Update Renovation Status
// ─────────────────────────────────────────
export const updateRenovationStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/api/renovations/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update status");
  return result.data;
};

// ─────────────────────────────────────────
// 11. Rate Renovation
// ─────────────────────────────────────────
export const rateRenovation = async (id, ratingData) => {
  const res = await fetch(`${API_BASE}/api/renovations/${id}/rate`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ratingData),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to rate");
  return result.data;
};

// ─────────────────────────────────────────
// 12. Cancel Renovation Request
// ─────────────────────────────────────────
export const cancelRenovationRequest = async (id) => {
  const res = await fetch(`${API_BASE}/api/renovations/${id}/cancel`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to cancel request");
  return result.data;
};
