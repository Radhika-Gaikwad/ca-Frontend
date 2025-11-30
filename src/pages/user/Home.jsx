import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios/axiosInstance";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/card";
import { Button } from "../../components/button";
import { CheckCircle2, Star, X, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Improved Home component showing plans with:
 * - Buy Plan + View Plan buttons (at bottom of card)
 * - View Plan opens a detailed popup/modal
 * - More details shown on the card
 * - Unique styling and animations
 */

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null); // for modal
  const [priceMode, setPriceMode] = useState("year"); // "year" or "month" (optional toggle)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/plans");
        // Ensure array (defensive)
        setPlans(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleBuy = (plan) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/user/purchase-plan`, {
      state: { plan },
    });
  };

  const priceForMode = (plan) => {
    // If plan contains monthlyPrice optionally, compute. Otherwise divide by 12.
    if (!plan) return 0;
    if (priceMode === "month") {
      if (plan.monthlyPrice) return plan.monthlyPrice;
      // fallback approximate
      return Math.round(plan.price / 12);
    }
    // yearly mode
    return plan.price;
  };

  return (
    <div className="lg:p-10 md:p-6 p-4 bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-900 to-green-700 bg-clip-text text-transparent">
          Chartered Accountant Plans 📊
        </h1>
        <p className="text-gray-600 mb-4 text-lg">
          Transparent pricing. Professional service. Choose the plan that’s right
          for you.
        </p>

        {/* Price toggle (month/year) */}
        <div className="inline-flex bg-white border rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setPriceMode("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              priceMode === "month"
                ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPriceMode("year")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              priceMode === "year"
                ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plan Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No plans available.
          </div>
        ) : (
          plans.map((plan, index) => (
            <motion.div
              key={plan._id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
            >
              <Card className="relative h-full flex flex-col border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Top header with gradient and badge */}
                <CardHeader className="p-6 rounded-b-none bg-gradient-to-r from-blue-900 to-green-700 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {plan.title || "Untitled Plan"}
                      </CardTitle>
                      <p className="text-sm opacity-90 mt-1">{plan.subtitle || plan.description || ""}</p>
                    </div>

                    {/* Recommended / star badge */}
                    <div className="text-right">
                      {plan.price && plan.price > 30000 ? (
                        <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full shadow-md text-xs font-semibold">
                          <Star size={14} />
                          Recommended
                        </div>
                      ) : plan.isPopular ? (
                        <div className="flex items-center gap-2 bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Popular
                        </div>
                      ) : null}
                      {/* rating if present */}
                      {plan.rating && (
                        <div className="mt-2 text-sm opacity-90">⭐ {plan.rating} / 5</div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Card main */}
                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Price block */}
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-4xl font-extrabold text-green-700">
                          ₹ {priceForMode(plan)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {priceMode === "year" ? "per year" : "per month"}
                        </div>
                      </div>

                      {/* Quick stats */}
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-semibold">{plan.duration || (priceMode === "year" ? "1 Year" : "Monthly")}</div>
                      </div>
                    </div>

                    {/* Short bullet features (max 3 shown on card) */}
                    <div className="mt-6">
                      <h3 className="text-md font-semibold text-gray-700 mb-2">Highlights</h3>
                      <ul className="space-y-2">
                        {(plan.services && plan.services.slice(0, 3))?.map((s, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm">{s}</span>
                          </li>
                        ))}
                        {/* show how many more services */}
                        {plan.services && plan.services.length > 3 && (
                          <li className="flex items-center gap-3 text-sm text-gray-500">
                            <Info className="w-4 h-4" />
                            +{plan.services.length - 3} more services included
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Short description / note */}
                    {plan.note && (
                      <p className="mt-4 text-sm text-gray-600">{plan.note}</p>
                    )}
                  </div>

                  {/* Card CTA area (stick to bottom of card) */}
                  <div className="mt-6 pt-4 border-t border-gray-100 bg-white -mx-6 px-6 pb-6 flex gap-3">
                    <Button
                      onClick={() => handleBuy(plan)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-md"
                    >
                      Buy Plan
                    </Button>

                    <Button
                      onClick={() => setSelectedPlan(plan)}
                      className="flex-1 bg-gray-100 border border-gray-400 text-black hover:shadow-md"
                    >
                      View Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal / Popup for View Plan */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPlan(null)}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="relative z-50 max-w-3xl mx-4 w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* modal header */}
            <div className="flex items-start justify-between p-6 bg-gradient-to-r from-blue-900 to-green-700 text-white">
              <div>
                <h3 className="text-2xl font-bold">{selectedPlan.title}</h3>
                <p className="text-sm opacity-90 mt-1">{selectedPlan.subtitle || selectedPlan.description}</p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2"
                aria-label="close"
              >
                <X size={18} />
              </button>
            </div>

            {/* modal body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Price</h4>
                  <div className="text-3xl font-extrabold text-green-700">₹ {selectedPlan.price}</div>
                  <div className="text-sm text-gray-500 mt-1">Billing: {selectedPlan.billingType || "Yearly"}</div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Duration</h4>
                    <div className="text-sm text-gray-700">{selectedPlan.duration || "1 Year"}</div>
                  </div>

                  {selectedPlan.refundPolicy && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Refund Policy</h4>
                      <div className="text-sm text-gray-700">{selectedPlan.refundPolicy}</div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Quick Summary</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-700">Services included: {selectedPlan.services?.length || 0}</li>
                    {selectedPlan.features && <li className="text-sm text-gray-700">Features: {selectedPlan.features.join(", ")}</li>}
                    {selectedPlan.maxUsers && <li className="text-sm text-gray-700">Max users: {selectedPlan.maxUsers}</li>}
                    {selectedPlan.support && <li className="text-sm text-gray-700">Support: {selectedPlan.support}</li>}
                  </ul>
                </div>
              </div>

              {/* full services list */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">All Services</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedPlan.services || []).map((s, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div className="text-sm text-gray-700">{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* long description / terms */}
              {selectedPlan.terms && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">Terms & Conditions</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{selectedPlan.terms}</p>
                </div>
              )}

              {/* FAQs if present */}
              {selectedPlan.faqs && selectedPlan.faqs.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">FAQs</h4>
                  <div className="space-y-3">
                    {selectedPlan.faqs.map((f, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <div className="text-sm font-semibold">{f.q}</div>
                        <div className="text-sm text-gray-600 mt-1">{f.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* modal footer */}
            <div className="flex items-center gap-3 justify-between p-4 border-t">
              <div className="text-sm text-gray-600 pl-4">
                <div className="font-semibold">Plan: {selectedPlan.title}</div>
                <div>₹ {selectedPlan.price} • {selectedPlan.duration || "1 Year"}</div>
              </div>

              <div className="flex items-center gap-2 pr-4">
                <Button onClick={() => setSelectedPlan(null)} className="bg-gray-100 border border-gray-400 text-black">
                  Close
                </Button>
                <Button onClick={() => handleBuy(selectedPlan)} className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                  Buy Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
