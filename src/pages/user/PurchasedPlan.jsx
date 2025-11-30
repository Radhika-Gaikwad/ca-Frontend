import React, { useEffect, useState } from "react";
import { getPurchasedPlan } from "../../services/purchaseService";
import { Button } from "../../components/button";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const PurchasedPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPurchasedPlan();
        setPlans(data.purchases || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch purchased plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <Toaster position="top-center" />

      <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">
        My Purchased Plans 🧾
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-center text-gray-500">No purchased plans yet.</p>
      ) : (
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {plans.map((purchase) => {
            const snap = purchase.planSnapshot || {};

            return (
              <div
                key={purchase._id}
                className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-lg transition-all"
              >
                {/* LEFT */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-teal-700">{snap.title}</h2>
                  <p className="text-gray-700 font-semibold">₹ {snap.price}</p>

                  <p className="text-gray-500 mt-1 line-clamp-2">
                    {purchase.plan?.description || "No description available"}
                  </p>

                  <p className="text-gray-700 mt-1">
                    Payment Status:{" "}
                    <span
                      className={
                        purchase.paymentStatus === "confirmed"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {purchase.paymentStatus}
                    </span>
                  </p>
                </div>

                {/* RIGHT */}
                <Button
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl w-full sm:w-auto"
                  onClick={() => setSelectedPlan(purchase)}
                >
                  See Details
                </Button>
              </div>
            );
          })}
        </div>
      )}
{/* DETAILS MODAL */}
{selectedPlan && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-auto">
    <div className="bg-white rounded-3xl max-w-4xl w-full p-8 relative shadow-2xl flex flex-col gap-6">
      {/* CLOSE BUTTON */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        onClick={() => setSelectedPlan(null)}
      >
        <X size={24} />
      </button>

      {/* PLAN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <h2 className="text-3xl font-bold text-teal-700">
          {selectedPlan.planSnapshot?.title}
        </h2>
        <span className="text-xl font-semibold text-gray-700">
          ₹ {selectedPlan.planSnapshot?.price} / {selectedPlan.planSnapshot?.billingCycle}
        </span>
      </div>

      {/* SERVICES */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-teal-600">Services Included</h3>
        <div className="flex flex-wrap gap-2">
          {selectedPlan.planSnapshot?.services?.length > 0 ? (
            selectedPlan.planSnapshot.services.map((service, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium"
              >
                {service}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No services listed</span>
          )}
        </div>
      </div>

      {/* BUSINESS DETAILS & ADDRESSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-teal-600">Business Details</h3>
          <p className="text-gray-600"><span className="font-semibold">Name:</span> {selectedPlan.businessDetails?.businessName || "N/A"}</p>
          <p className="text-gray-600"><span className="font-semibold">Type:</span> {selectedPlan.businessDetails?.businessType || "N/A"}</p>
          <p className="text-gray-600"><span className="font-semibold">GST Number:</span> {selectedPlan.businessDetails?.gstNumber || "N/A"}</p>
          <p className="text-gray-600"><span className="font-semibold">Incorporation Date:</span> {selectedPlan.businessDetails?.incorporationDate || "N/A"}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-teal-600">Addresses</h3>
          <p className="text-gray-600"><span className="font-semibold">Business Address:</span> {selectedPlan.businessAddress}</p>
          <p className="text-gray-600"><span className="font-semibold">Residential Address:</span> {selectedPlan.residentialAddress}</p>
        </div>
      </div>

      {/* PAYMENT STATUS */}
      <div className="mt-4">
        <h3 className="text-xl font-bold text-teal-600 mb-2">Payment Status</h3>
        <span
          className={`px-4 py-2 rounded-full font-semibold ${
            selectedPlan.paymentStatus === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {selectedPlan.paymentStatus || "Pending"}
        </span>
      </div>

      {/* CLOSE BUTTON */}
      <Button
        className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl"
        onClick={() => setSelectedPlan(null)}
      >
        Close
      </Button>
    </div>
  </div>
)}

    </div>
  );
};

export default PurchasedPlan;
