import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { uploadPaymentProof, confirmPayment } from "../../services/purchaseService";
import { Upload } from "lucide-react";
import { Button } from "../../components/button";
import toast, { Toaster } from "react-hot-toast";

const PaymentProcess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="text-center mt-20 text-red-600">
        Invalid navigation! No purchase found.
      </div>
    );
  }

  const { purchaseId, purchase, plan } = state;

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedPurchase, setConfirmedPurchase] = useState(null);
console.log("PaymentProcess state:", state);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadToCloudinary(file, "image");
      setPaymentScreenshot(url);

      await uploadPaymentProof(purchaseId, url);

      toast.success("Payment screenshot uploaded");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);

      const data = await confirmPayment(purchaseId);
      toast.success("Payment confirmed!");

      setConfirmedPurchase(data.purchase);
      setShowConfirmModal(true);
    } catch (error) {
      toast.error("Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

const selectedServices =
  (purchase?.planSnapshot?.services || []).map(s =>
    s.replace(/^"|"$/g, "")
  );


  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 flex justify-center items-start">
      <Toaster position="top-center" />

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 border">
        <h1 className="text-3xl font-bold text-center mb-3">Payment Process 💳</h1>

        {/* PLAN */}
        <div className="bg-teal-50 p-4 rounded-xl border mb-6 text-center">
          <p className="text-xl font-semibold">{plan?.title}</p>
          <p className="text-green-700 font-bold text-lg">₹ {plan?.price}</p>
        </div>

        {/* PURCHASE DETAILS */}
        <div className="bg-gray-50 p-4 rounded-xl border mb-6">
          <h2 className="text-lg font-bold mb-3">Purchase Information</h2>

          <div className="grid grid-cols-2 gap-3 text-gray-700">
            <p><strong>Name:</strong> {purchase?.firstName} {purchase?.lastName}</p>
            <p><strong>Email:</strong> {purchase?.email}</p>
            <p><strong>Contact:</strong> {purchase?.contactNumber}</p>
            <p><strong>Business Type:</strong> {purchase?.businessDetails?.businessType}</p>
            <p><strong>Business Address:</strong> {purchase?.businessAddress}</p>
            <p><strong>Residential Address:</strong> {purchase?.residentialAddress}</p>

           <p className="col-span-2">
      <strong>Included Services:</strong>{" "}
      {selectedServices.length > 0
        ? selectedServices.join(", ")
        : "—"}
    </p>
          </div>

          {/* DOCUMENTS */}
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Uploaded Documents:</h3>
            <ul className="text-blue-600 underline space-y-1 text-sm">
              <li>
                <a href={purchase?.documents?.panCardUrl} target="_blank" rel="noopener noreferrer">
                  PAN Card
                </a>
              </li>
              <li>
                <a href={purchase?.documents?.aadhaarOrIdUrl} target="_blank" rel="noopener noreferrer">
                  Aadhaar / ID
                </a>
              </li>
              <li>
                <a href={purchase?.documents?.gstCertificateUrl} target="_blank" rel="noopener noreferrer">
                  GST Certificate
                </a>
              </li>
              <li>
                <a href={purchase?.documents?.businessRegistrationUrl} target="_blank" rel="noopener noreferrer">
                  Business Registration
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* QR CODE */}
        <div className="text-center mb-6">
          <p className="font-semibold">Scan QR Code to Pay:</p>
          <img
            src={purchase?.qrCodeUrl}
            alt="QR Code"
            className="w-48 mx-auto my-3 border rounded-xl shadow"
          />
        </div>

      {/* Upload Screenshot */}
<div className="mb-6 text-center">
  <p className="font-semibold mb-2">Upload Payment Screenshot:</p>

  <div className="flex justify-center"> 
    <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-auto">
      <Upload size={16} />
      {paymentScreenshot ? "Replace Screenshot" : "Upload Screenshot"}
      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
    </label>
  </div>

  {paymentScreenshot && (
    <div className="mt-2">
      <a
        href={paymentScreenshot}
        target="_blank"
        className="text-blue-600 underline"
      >
        View Screenshot
      </a>
    </div>
  )}
</div>


        {/* Confirm */}
        {paymentScreenshot && (
          <div className="text-center mt-4">
            <Button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Confirming..." : "Confirm Payment"}
            </Button>
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && confirmedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Payment Confirmed ✅</h2>

            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Name:</strong> {confirmedPurchase.firstName} {confirmedPurchase.lastName}</p>
              <p><strong>Email:</strong> {confirmedPurchase.email}</p>
              <p><strong>Contact:</strong> {confirmedPurchase.contactNumber}</p>
              <p><strong>Business Type:</strong> {confirmedPurchase.businessDetails?.businessType}</p>
              <p><strong>Selected Services:</strong>{" "}
                {(confirmedPurchase.businessDetails?.selectedServices || []).join(", ")}
              </p>

              <p><strong>Payment Status:</strong> {confirmedPurchase.paymentStatus}</p>

              <p>
                <strong>Payment Proof:</strong>{" "}
                <a
                  href={confirmedPurchase.paymentProofUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => navigate("/user/purchased-plan")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                See Purchased Plans
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcess;
