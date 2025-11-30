import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { createPurchase } from "../../services/purchaseService";
import { Button } from "../../components/button";
import { Upload, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

/* ----------------------------
   Helpers & Hoisted Components
   (InfoRow is hoisted to avoid ReferenceError)
---------------------------- */
function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <span className="text-base font-medium text-gray-900">{value ?? "—"}</span>
    </div>
  );
}

/* validate file: extension + size (bytes) */
const ALLOWED_EXT = ["pdf", "png", "jpg", "jpeg", "doc", "docx"];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

function isAllowedFile(file) {
  if (!file) return false;
  const parts = file.name.split(".");
  const ext = parts.length > 1 ? parts.pop().toLowerCase() : "";
  if (!ALLOWED_EXT.includes(ext)) return {
    ok: false,
    reason: `Invalid file type .${ext}. Allowed: ${ALLOWED_EXT.join(", ")}`
  };
  if (file.size > MAX_FILE_BYTES) return {
    ok: false,
    reason: `File too large (${Math.round(file.size / 1024 / 1024 * 100) / 100} MB). Max ${MAX_FILE_BYTES / 1024 / 1024} MB`
  };
  return { ok: true };
}

/* ----------------------------
   Main Component
---------------------------- */
const PurchaseForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const plan = state?.plan || {};

  const [formData, setFormData] = useState({
    planId: plan.planId || "",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",

    // businessDetails
    businessDetails: {
      businessName: "",
      businessType: "",
      gstNumber: "",
      incorporationDate: "",
      // auto-select all plan services (read-only)
      selectedServices: plan.services || [],
    },

    residentialAddress: "",
    businessAddress: "",

    documents: {
      panCardUrl: "",
      aadhaarUrl: "",
      gstCertificateUrl: "",
      businessRegistrationUrl: "",
      pitchDeckUrl: "", // only for startup plans
      otherDocuments: [],
    },

    agreeTerms: false,
  });

  // errors keyed by field names (firstName, documents.panCardUrl, etc.)
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(""); // holds file field name or "submit"

  /* ----------------------------
     Per-field validators
  ---------------------------- */
  const validators = {
    firstName: (val) => (!val || !val.trim() ? "First name is required" : null),
    lastName: (val) => (!val || !val.trim() ? "Last name is required" : null),
    email: (val) => {
      if (!val || !val.trim()) return "Email is required";
      if (!/^\S+@\S+\.\S+$/.test(val)) return "Invalid email";
      return null;
    },
    contactNumber: (val) => {
      if (!val || !val.trim()) return "Contact number is required";
      if (!/^\d{10}$/.test(val)) return "Contact number must be 10 digits";
      return null;
    },
    "businessDetails.businessType": (val) =>
      !val ? "Select business type" : null,
    residentialAddress: (val) =>
      !val || !val.trim() ? "Residential address is required" : null,
    businessAddress: (val) =>
      !val || !val.trim() ? "Business address is required" : null,
    "documents.panCardUrl": (val) => (!val ? "PAN card is required" : null),
    "documents.aadhaarUrl": (val) =>
      !val ? "Aadhaar / ID proof is required" : null,
    "documents.gstCertificateUrl": (val) =>
      !val ? "GST Certificate is required" : null,
    "documents.businessRegistrationUrl": (val) =>
      !val ? "Business Registration is required" : null,
    "documents.pitchDeckUrl": (val) =>
      plan.planType === "startup" && !val ? "Pitch deck is required for startup plan" : null,
    agreeTerms: (val) => (val ? null : "You must accept terms and conditions"),
  };

  /* validate a single field key, return error string or null */
  const validateField = (key, value) => {
    const fn = validators[key];
    if (!fn) return null;
    return fn(value);
  };

  /* validate entire form, set errors, return boolean */
  const validateAll = () => {
    const newErrors = {};

    // simple fields
    ["firstName", "lastName", "email", "contactNumber", "residentialAddress", "businessAddress", "agreeTerms"].forEach((k) => {
      const val = k === "agreeTerms" ? formData[k] : formData[k];
      const err = validateField(k, val);
      if (err) newErrors[k] = err;
    });

    // businessDetails.businessType
    const bTypeErr = validateField("businessDetails.businessType", formData.businessDetails.businessType);
    if (bTypeErr) newErrors.businessType = bTypeErr;

    // documents
    const docs = formData.documents;
    [
      "panCardUrl",
      "aadhaarUrl",
      "gstCertificateUrl",
      "businessRegistrationUrl",
    ].forEach((f) => {
      const k = `documents.${f}`;
      const err = validateField(k, docs[f]);
      if (err) newErrors[k] = err;
    });

    // pitch deck conditionally
    if (plan.planType === "startup") {
      const err = validateField("documents.pitchDeckUrl", docs.pitchDeckUrl);
      if (err) newErrors["documents.pitchDeckUrl"] = err;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ----------------------------
     Handlers
  ---------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // some businessDetails fields are nested (businessType, businessName, gstNumber, incorporationDate)
    if (["businessType", "businessName", "gstNumber", "incorporationDate"].includes(name)) {
      setFormData((prev) => {
        const next = {
          ...prev,
          businessDetails: { ...prev.businessDetails, [name]: value },
        };
        // validate this field if needed
        const key = `businessDetails.${name}`;
        const err = validateField(key, value);
        setErrors((prevErr) => {
          const copy = { ...prevErr };
          // map nested key to simpler keys for display: only businessType is validated
          if (name === "businessType") {
            if (err) copy["businessType"] = err;
            else delete copy["businessType"];
          }
          return copy;
        });
        return next;
      });
      return;
    }

    // normal fields
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // perform immediate validation for the field
      const err = validateField(name, type === "checkbox" ? checked : value);
      setErrors((prevErr) => {
        const copy = { ...prevErr };
        if (err) copy[name] = err;
        else delete copy[name];
        return copy;
      });

      return next;
    });
  };

  /* file upload with pre-validation */
  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate file extension & size first
    const check = isAllowedFile(file);
    if (!check.ok) {
      toast.error(check.reason);
      setErrors((prev) => ({ ...prev, [`documents.${field}`]: check.reason }));
      return;
    }

    setLoading(field);
    try {
      const url = await uploadToCloudinary(file, "raw");

      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: field === "otherDocuments" ? [...prev.documents.otherDocuments, url] : url,
        },
      }));

      // clear any previous error for this doc field
      setErrors((prevErr) => {
        const copy = { ...prevErr };
        delete copy[`documents.${field}`];
        return copy;
      });

      toast.success(`${file.name} uploaded`);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
      setErrors((prev) => ({ ...prev, [`documents.${field}`]: "Upload failed" }));
    } finally {
      setLoading("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // final validation
    if (!validateAll()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    const payload = {
      planId: Number(formData.planId),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.contactNumber,

      businessDetails: {
        businessName: formData.businessDetails.businessName,
        businessType: formData.businessDetails.businessType,
        gstNumber: formData.businessDetails.gstNumber,
        incorporationDate: formData.businessDetails.incorporationDate,
        selectedServices: formData.businessDetails.selectedServices,
      },

      residentialAddress: formData.residentialAddress,
      businessAddress: formData.businessAddress,

      documents: formData.documents,
    };

    try {
      setLoading("submit");
      const res = await createPurchase(payload);

      toast.success("Purchase created!");
      navigate("/user/payment-process", {
        state: {
          purchaseId: res.purchase._id,
          purchase: res.purchase,
          plan,
          formData: payload,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create purchase");
    } finally {
      setLoading("");
    }
  };

  /* ----------------------------
     Small UI helpers
  ---------------------------- */
  const requiredMark = <span className="text-red-600 ml-1">*</span>;

  return (
    <div className="w-full min-h-screen py-10 bg-gradient-to-br from-green-50 to-blue-50">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto p-10 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Purchase Plan – {plan.title}</h2>

        {/* PLAN SUMMARY INFO CARD */}
        <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Plan Name" value={plan.title} />
            <InfoRow label="Plan Type" value={plan.planType} />

            <InfoRow label="Price" value={plan.price ? `₹${plan.price}` : "—"} />
            <InfoRow label="Billing Cycle" value={plan.billingCycle} />

            <InfoRow label="Support Level" value={plan.supportLevel} />
            <InfoRow label="Max Users Allowed" value={plan.maxUsers || "N/A"} />

            <InfoRow label="Notice Handling" value={plan.includesNoticeHandling ? "Yes" : "No"} />
            <InfoRow label="Created By" value={plan.createdBy?.name || "System"} />
          </div>

          {/* SERVICES LIST */}
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">Included Services:</h3>
            <ul className="list-decimal ml-6 space-y-1">
              {plan.services?.length ? plan.services.map((s, i) => (
                <li key={i} className="text-gray-700">{s}</li>
              )) : <li className="text-gray-500">No services available</li>}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* PERSONAL INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              name="firstName"
              label={<>First Name {requiredMark}</>}
              error={errors.firstName}
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input
              name="lastName"
              label={<>Last Name {requiredMark}</>}
              error={errors.lastName}
              value={formData.lastName}
              onChange={handleChange}
            />
            <Input
              name="email"
              label={<>Email {requiredMark}</>}
              error={errors.email}
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="contactNumber"
              label={<>Contact Number {requiredMark}</>}
              error={errors.contactNumber}
              value={formData.contactNumber}
              maxLength="10"
              onChange={handleChange}
            />
          </div>

          {/* BUSINESS DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              name="businessName"
              label={<>Business Name <span className="text-gray-400 text-sm">(optional)</span></>}
              error={errors["businessDetails.businessName"]}
              value={formData.businessDetails.businessName}
              onChange={handleChange}
            />

            <Select
              name="businessType"
              label={<>Business Type {requiredMark}</>}
              error={errors.businessType}
              value={formData.businessDetails.businessType}
              onChange={handleChange}
            />

            <Input
              name="gstNumber"
              label={<>GST Number <span className="text-gray-400 text-sm">(optional)</span></>}
              error={errors["businessDetails.gstNumber"]}
              value={formData.businessDetails.gstNumber}
              onChange={handleChange}
            />
            <Input
              name="incorporationDate"
              type="date"
              label={<>Incorporation Date <span className="text-gray-400 text-sm">(optional)</span></>}
              error={errors["businessDetails.incorporationDate"]}
              value={formData.businessDetails.incorporationDate}
              onChange={handleChange}
            />
          </div>

          {/* SELECTED SERVICES – READ ONLY LIST */}
          <div className="bg-gray-50 p-5 rounded-xl shadow">
            <label className="text-lg font-semibold mb-3 block">Included Services</label>
            <ul className="list-decimal ml-6 space-y-2">
              {(formData.businessDetails.selectedServices || []).map((srv, index) => (
                <li key={index} className="text-gray-800 text-sm">{srv}</li>
              ))}
            </ul>
          </div>

          {/* ADDRESSES */}
          <TextArea
            name="residentialAddress"
            label={<>Residential Address {requiredMark}</>}
            error={errors.residentialAddress}
            value={formData.residentialAddress}
            onChange={handleChange}
          />
          <TextArea
            name="businessAddress"
            label={<>Business Address {requiredMark}</>}
            error={errors.businessAddress}
            value={formData.businessAddress}
            onChange={handleChange}
          />

          {/* DOCUMENTS */}
          <DocumentUploader
            docs={formData.documents}
            errors={errors}
            plan={plan}
            loading={loading}
            handleFileUpload={handleFileUpload}
          />

          {/* TERMS */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>I agree to the Terms & Conditions {requiredMark}</span>
            </label>
            {errors.agreeTerms && <p className="text-red-600 text-sm mt-1">{errors.agreeTerms}</p>}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end gap-4">
            <Button type="button" onClick={() => navigate(-1)} className="bg-gray-200">Back</Button>
            <Button type="submit" disabled={loading === "submit"} className="bg-teal-600 text-white">
              {loading === "submit" ? "Processing..." : "Purchase"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------
   Small Reusable Components
---------------------------- */

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-semibold flex items-center justify-between">
      <span>{label}</span>
    </label>
    <input
      {...props}
      className={`input-modern mt-2 w-full p-3 border rounded-md ${error ? "border-red-500" : "border-gray-200"}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Select = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <select
      {...props}
      className={`input-modern mt-2 w-full p-3 border rounded-md ${error ? "border-red-500" : "border-gray-200"}`}
    >
      <option value="">Select</option>
      <option value="Individual">Individual</option>
      <option value="Proprietorship">Proprietorship</option>
      <option value="Partnership">Partnership</option>
      <option value="LLP">LLP</option>
      <option value="Private Limited">Private Limited</option>
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <textarea
      {...props}
      className={`input-modern mt-2 w-full p-3 border rounded-md h-28 ${error ? "border-red-500" : "border-gray-200"}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

/* DocumentUploader
   - validates files before upload
   - shows uploaded link and replace button
   - shows inline errors
*/
const DocumentUploader = ({ docs, errors, plan, loading, handleFileUpload }) => {
  const fields = [
    { label: "PAN Card", field: "panCardUrl", required: true },
    { label: "Aadhaar / ID Proof", field: "aadhaarUrl", required: true },
    { label: "GST Certificate", field: "gstCertificateUrl", required: true },
    { label: "Business Registration", field: "businessRegistrationUrl", required: true },
  ];

  if (plan.planType === "startup") {
    fields.push({ label: "Pitch Deck (Startup Only)", field: "pitchDeckUrl", required: true });
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Required Documents</h3>
      <p className="text-sm text-gray-500 mb-4">
        Allowed file types: {ALLOWED_EXT.join(", ")}. Max size: 5 MB.
      </p>

      {fields.map((doc) => (
        <div key={doc.field} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold">
              {doc.label} {doc.required && <span className="text-red-600">*</span>}
            </label>

            <div className="flex items-center gap-3">
              {docs[doc.field] ? (
                <a href={docs[doc.field]} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                  View Uploaded
                </a>
              ) : (
                <span className="text-sm text-gray-500">No file uploaded</span>
              )}

              <label
                className={`px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer ${
                  docs[doc.field] ? "bg-yellow-600 text-white" : "bg-teal-600 text-white"
                }`}
              >
                <Upload size={16} />
                <span className="text-sm">
                  {loading === doc.field ? "Uploading..." : docs[doc.field] ? "Replace" : "Upload"}
                </span>
                <input
                  type="file"
                  accept={ALLOWED_EXT.map((e) => "." + e).join(",")}
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, doc.field)}
                />
              </label>
            </div>
          </div>

          {errors[`documents.${doc.field}`] && (
            <p className="text-red-600 text-sm">{errors[`documents.${doc.field}`]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PurchaseForm;
