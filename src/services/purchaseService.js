import axiosInstance from "../utils/axios/axiosInstance";

export const createPurchase = async (purchaseData) => {
  try {
    const { data } = await axiosInstance.post("/purchase/create", purchaseData);
    return data;
  } catch (error) {
    console.error("Purchase API error:", error);
    throw error;
  }
};

export const uploadPaymentProof = async (purchaseId, paymentProofUrl) => {
  const { data } = await axiosInstance.put(`/purchase/${purchaseId}/upload-proof`, {
    paymentProofUrl,
  });
  return data;
};

export const confirmPayment = async (purchaseId) => {
  const { data } = await axiosInstance.put(`/purchase/${purchaseId}/confirm`);
  console.log(data);
  return data;

};


export const getPurchasedPlan = async () => { 
  const { data } = await axiosInstance.get(`/purchase/my-purchases`);
  return data; // { purchases: [...] }
};

export const getAllPurchasedPlan = async () => {
  try {
    const { data } = await axiosInstance.get("/purchase/all-purchases");
    return data; // { purchases: [...] }
  } catch (error) {
    console.error("Error fetching purchased plans:", error);
    throw error;
  }
}