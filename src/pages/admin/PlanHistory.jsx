import React, { useEffect, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAllPurchasedPlan } from "../../services/purchaseService";

const PurchasedPlansHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewPurchase, setViewPurchase] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await getAllPurchasedPlan();
      setPurchases(res.purchases || []);
    } catch (err) {
      toast.error("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(purchases.length / perPage);
  const paginatedData = purchases.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-700">
            Purchased Plans History
          </h1>
          <p className="text-sm text-gray-600">
            View all customer’s purchased plans and details.
          </p>
        </div>
      </div>

      {/* ============================
          DESKTOP TABLE VIEW
      ============================ */}
      {!isMobile && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Business Type</th>
                <th className="text-left p-3">Plan ID</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    No purchases found
                  </td>
                </tr>
              ) : (
                paginatedData.map((p, idx) => (
                  <tr key={p._id} className="border-t last:border-b">
                    <td className="p-3">{(page - 1) * perPage + idx + 1}</td>
                    <td className="p-3">
                      <div className="font-semibold">
                        {p.firstName} {p.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{p.contactNumber}</div>
                    </td>
                    <td className="p-3 text-sm">{p.email}</td>
                    <td className="p-3 text-sm">{p.businessType}</td>
                    <td className="p-3 text-sm">{p.planId}</td>
                    <td className="p-3 capitalize text-sm">{p.paymentStatus}</td>

                    <td className="p-3">
                      <button
                        onClick={() => setViewPurchase(p)}
                        className="p-2 rounded hover:bg-gray-100"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded disabled:opacity-40"
              >
                <ChevronLeft />
              </button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded disabled:opacity-40"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded border px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ============================
          MOBILE CARD VIEW
      ============================ */}
      {isMobile && (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : paginatedData.length === 0 ? (
            <div>No purchases found</div>
          ) : (
            paginatedData.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-sm border p-4"
              >
                <div className="flex justify-between">
                  <div className="font-semibold text-lg">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-sm capitalize">{p.paymentStatus}</div>
                </div>

                <p className="text-sm text-gray-600">{p.email}</p>

                <div className="mt-2 text-sm">
                  <p>
                    <strong>Business:</strong> {p.businessType}
                  </p>
                  <p>
                    <strong>Plan:</strong> {p.planId}
                  </p>
                </div>

                <button
                  onClick={() => setViewPurchase(p)}
                  className="mt-4 p-2 w-full text-center bg-gray-100 rounded flex items-center justify-center gap-1"
                >
                  <Eye size={16} /> View Details
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================
          VIEW MODAL
      ============================ */}
      {viewPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setViewPurchase(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <button
              className="absolute top-2 right-2 px-3 py-1 bg-gray-200 rounded"
              onClick={() => setViewPurchase(null)}
            >
              Close
            </button>

            <h2 className="text-2xl font-bold mb-3">
              {viewPurchase.firstName} {viewPurchase.lastName}
            </h2>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <p><strong>Email:</strong> {viewPurchase.email}</p>
              <p><strong>Phone:</strong> {viewPurchase.contactNumber}</p>
              <p><strong>Business Type:</strong> {viewPurchase.businessType}</p>
              <p><strong>Plan ID:</strong> {viewPurchase.planId}</p>
              <p><strong>Status:</strong> {viewPurchase.paymentStatus}</p>
            </div>

            {/* Addresses */}
            <h3 className="font-semibold mt-4">Addresses</h3>
            <p className="text-sm">
              <strong>Residential:</strong> {viewPurchase.residentialAddress}
            </p>
            <p className="text-sm">
              <strong>Business:</strong> {viewPurchase.businessAddress}
            </p>

            {/* Services */}
            <h3 className="font-semibold mt-4">Selected Services</h3>
            <ul className="list-disc pl-5 text-sm">
              {viewPurchase.serviceSelection?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            {/* QR code */}
            <h3 className="font-semibold mt-4">QR Code</h3>
            <img
              src={viewPurchase.qrCodeUrl}
              className="w-40 border rounded"
              alt="QR"
            />

            {/* Documents */}
            <h3 className="font-semibold mt-4 mb-2">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(viewPurchase.documents || {}).map(([key, url]) =>
                url ? (
                  <div key={key}>
                    <p className="text-sm font-medium">{key}</p>
                    <img
                      src={url}
                      className="w-full h-32 object-cover rounded border"
                      alt={key}
                    />
                  </div>
                ) : null
              )}
            </div>

            {/* Payment Proof */}
            {viewPurchase.paymentProofUrl && (
              <>
                <h3 className="font-semibold mt-4">Payment Proof</h3>
                <img
                  src={viewPurchase.paymentProofUrl}
                  className="w-60 rounded border"
                  alt="Proof"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedPlansHistory;
