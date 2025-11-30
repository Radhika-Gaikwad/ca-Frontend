
// src/services/planService.js
import axiosInstance from "../utils/axios/axiosInstance";

/**
 * planService
 * NOTE: backend currently returns all plans at GET /plans.
 * We still accept optional { page, limit } in getPlans so it can be switched to server-side later.
 */

export const getPlans = async ({ page, limit, search } = {}) => {
  try {
    // Optionally support server-side paging (if backend later supports ?page=&limit=)
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search) params.search = search;

    const { data } = await axiosInstance.get("/plans", { params });
    // If backend returns paged object, return as-is. Otherwise assume array and return wrapped.
    if (Array.isArray(data)) {
      return { plans: data };
    }
    // could be { plans, total, page, limit }
    return data;
  } catch (err) {
    console.error("planService.getPlans:", err);
    throw err;
  }
};

export const getPlan = async (planId) => {
  try {
    const { data } = await axiosInstance.get(`/plans/${planId}`);
    return data;
  } catch (err) {
    console.error("planService.getPlan:", err);
    throw err;
  }
};

export const createPlan = async (planPayload) => {
  try {
    const { data } = await axiosInstance.post("/plans", planPayload);
    return data;
  } catch (err) {
    console.error("planService.createPlan:", err);
    throw err;
  }
};

export const updatePlan = async (planId, planPayload) => {
  try {
    const { data } = await axiosInstance.put(`/plans/${planId}`, planPayload);
    return data;
  } catch (err) {
    console.error("planService.updatePlan:", err);
    throw err;
  }
};

export const deletePlan = async (planId) => {
  try {
    const { data } = await axiosInstance.delete(`/plans/${planId}`);
    return data;
  } catch (err) {
    console.error("planService.deletePlan:", err);
    throw err;
  }
};
