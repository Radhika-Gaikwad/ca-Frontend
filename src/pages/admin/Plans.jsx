// src/pages/admin/Plans.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getPlan,
} from "../../services/planService";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload"; // optional util; if unavailable, thumbnail upload will fallback to URL input

// --- Simple Modal ---
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="px-3 py-1 rounded hover:bg-gray-100" onClick={onClose}>Close</button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
      </motion.div>
    </div>
  );
};

// --- Confirm Dialog ---
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded border" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// --- Empty form template reflecting full schema ---
const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  price: "",
  discountPrice: "",
  isDiscountAvailable: false,
  billingCycle: "monthly",
  validityInDays: "",
  planType: "individual",
  recommended: false,
  services: [""],
  features: [{ name: "", included: true }],
  supportLevel: "email",
  maxUsers: 1,
  includesNoticeHandling: false,
  maxNoticeCount: 0,
  status: "active",
  thumbnail: "", // url
  thumbnailFile: null, // local file (not sent to server directly)
  // planId will be set by server
};

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  // modals
  const [viewPlan, setViewPlan] = useState(null);
  const [editPlan, setEditPlan] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, planId: null });

  // form
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await getPlans();
      const data = res.plans ?? res;
      setPlans(Array.isArray(data) ? data : []);
      console.log("Loaded plans:", data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  // pagination logic
  const total = plans.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return plans.slice(start, start + perPage);
  }, [plans, page, perPage]);

  // helpers
  const keyOf = (p) => p.planId ?? p._id ?? p.id;

  // open create form
  const handleOpenCreate = () => {
    setForm(emptyForm);
    setEditPlan(null);
    setCreateOpen(true);
  };

  // open edit — fetch fresh
  const handleOpenEdit = async (plan) => {
    try {
      const id = plan.planId || plan._id || plan.id;
      const data = await getPlan(id);
      // normalize empty lists
      const normalized = {
        title: data.title ?? "",
        subtitle: data.subtitle ?? "",
        description: data.description ?? "",
        price: data.price ?? "",
        discountPrice: data.discountPrice ?? 0,
        isDiscountAvailable: !!data.isDiscountAvailable,
        billingCycle: data.billingCycle ?? "monthly",
        validityInDays: data.validityInDays ?? "",
        planType: data.planType ?? "individual",
        recommended: !!data.recommended,
        services: (data.services && data.services.length) ? data.services : [""],
        features: (data.features && data.features.length) ? data.features : [{ name: "", included: true }],
        supportLevel: data.supportLevel ?? "email",
        maxUsers: data.maxUsers ?? 1,
        includesNoticeHandling: !!data.includesNoticeHandling,
        maxNoticeCount: data.maxNoticeCount ?? 0,
        status: data.status ?? "active",
        thumbnail: data.thumbnail ?? "",
        thumbnailFile: null,
        planId: data.planId ?? data._id ?? data.id,
      };
      setForm(normalized);
      setEditPlan(data);
      setCreateOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch plan details");
    }
  };

  // view plan
  const handleOpenView = async (plan) => {
    try {
      const id = plan.planId || plan._id || plan.id;
      const data = await getPlan(id);
      setViewPlan(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch plan details");
    }
  };

  // delete flow
  const handleDelete = (plan) => {
    setConfirmDelete({ open: true, planId: plan.planId || plan._id || plan.id });
  };

  const confirmDeleteNow = async () => {
    try {
      const id = confirmDelete.planId;
      await deletePlan(id);
      setPlans((p) => p.filter((x) => (x.planId || x._id || x.id) !== id));
      setConfirmDelete({ open: false, planId: null });
      toast.success("Plan deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // form handlers
  const onFormChange = (path, value) => {
    setForm((f) => ({ ...f, [path]: value }));
  };

  const onServiceChange = (index, val) => {
    setForm((f) => {
      const s = [...(f.services || [])];
      s[index] = val;
      return { ...f, services: s };
    });
  };

  const addService = () => setForm((f) => ({ ...f, services: [...(f.services || []), ""] }));
  const removeService = (idx) => setForm((f) => ({ ...f, services: (f.services || []).filter((_, i) => i !== idx) }));

  const onFeatureChange = (index, key, val) => {
    setForm((f) => {
      const feats = [...(f.features || [])];
      feats[index] = { ...feats[index], [key]: val };
      return { ...f, features: feats };
    });
  };
  const addFeature = () => setForm((f) => ({ ...f, features: [...(f.features || []), { name: "", included: true }] }));
  const removeFeature = (idx) => setForm((f) => ({ ...f, features: (f.features || []).filter((_, i) => i !== idx) }));

  const handleThumbnailFile = (file) => {
    setForm((f) => ({ ...f, thumbnailFile: file }));
  };

  // Validation helper (basic)
  const validateForm = () => {
    if (!form.title || String(form.title).trim() === "") {
      toast.error("Title is required");
      return false;
    }
    if (form.price === "" || form.price === null || Number.isNaN(Number(form.price))) {
      toast.error("Valid price is required");
      return false;
    }
    // optional further validation: discountPrice <= price, maxUsers positive, etc.
    if (form.discountPrice !== "" && Number(form.discountPrice) < 0) {
      toast.error("Discount price cannot be negative");
      return false;
    }
    return true;
  };

  // Save (create / update)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);

      // If user provided a thumbnail file and uploadToCloudinary exists, upload it
      let thumbnailUrl = form.thumbnail || "";
      if (form.thumbnailFile) {
        try {
          // uploadToCloudinary should return an object containing secure_url or similar
          const uploadRes = await uploadToCloudinary(form.thumbnailFile);
          thumbnailUrl = uploadRes?.secure_url ?? uploadRes?.url ?? uploadRes?.data?.secure_url ?? thumbnailUrl;
        } catch (uploadErr) {
          console.warn("Thumbnail upload failed, proceeding without file:", uploadErr);
          toast.error("Thumbnail upload failed (you can still provide a URL)");
        }
      }

      const payload = {
        title: form.title,
        subtitle: form.subtitle || "",
        description: form.description || "",
        price: Number(form.price),
        discountPrice: form.discountPrice === "" ? 0 : Number(form.discountPrice),
        isDiscountAvailable: !!form.isDiscountAvailable,
        billingCycle: form.billingCycle || "monthly",
        validityInDays: form.validityInDays === "" ? undefined : Number(form.validityInDays),
        planType: form.planType || "individual",
        recommended: !!form.recommended,
        services: (form.services || []).filter(Boolean),
        features: (form.features || []).map(f => ({ name: f.name || "", included: !!f.included })),
        supportLevel: form.supportLevel || "email",
        maxUsers: Number(form.maxUsers ?? 1),
        includesNoticeHandling: !!form.includesNoticeHandling,
        maxNoticeCount: Number(form.maxNoticeCount ?? 0),
        status: form.status || "active",
        thumbnail: thumbnailUrl || "",
      };

      if (editPlan) {
        // update
        const id = editPlan.planId || editPlan._id || editPlan.id;
        const updated = await updatePlan(id, payload);
        setPlans((prev) => prev.map((p) => ((p.planId || p._id || p.id) === id ? updated : p)));
        setCreateOpen(false);
        setEditPlan(null);
        toast.success("Plan updated");
      } else {
        // create
        const created = await createPlan(payload);
        // if server returns singular created object or created.plan
        const toAdd = created.plan ?? created;
        setPlans((prev) => [toAdd, ...prev]);
        setCreateOpen(false);
        toast.success("Plan created");
      }
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-0 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* react-hot-toast container */}
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-700">
            Manage Plans
          </h1>
          <p className="text-sm text-gray-600">Create, edit and remove plans here.</p>
        </div>

        <div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg hover:shadow-2xl"
            onClick={handleOpenCreate}
          >
            <Plus size={16} /> Add New Plan
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      {!isMobile && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Price (₹)</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Services</th>
                <th className="text-left p-3">Created By</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-6 text-center">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center">No plans found</td></tr>
              ) : (
                paginated.map((p, idx) => (
                  <tr key={keyOf(p)} className="border-t last:border-b">
                    <td className="p-3 align-top">{(page - 1) * perPage + idx + 1}</td>
                    <td className="p-3 align-top">
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.subtitle}</div>
                    </td>
                    <td className="p-3 align-top font-semibold">₹{p.price}</td>
                    <td className="p-3 align-top text-sm">{p.planType}</td>
                    <td className="p-3 align-top">
                      <ul className="text-sm text-gray-700 space-y-1">
                        {(p.services || []).slice(0, 3).map((s, i) => <li key={i}>• {s}</li>)}
                        {p.services && p.services.length > 3 && <li className="text-xs text-gray-400">+{p.services.length - 3} more</li>}
                      </ul>
                    </td>
                    <td className="p-3 align-top text-sm text-gray-600">{p.createdBy?.name ?? p.createdBy?.email ?? "—"}</td>
                    <td className="p-3 align-top text-sm">{p.status}</td>
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-2">
                        <button title="View" onClick={() => handleOpenView(p)} className="p-2 rounded hover:bg-gray-100"><Eye size={16} /></button>
                        <button title="Edit" onClick={() => handleOpenEdit(p)} className="p-2 rounded hover:bg-gray-100"><Edit2 size={16} /></button>
                        <button title="Delete" onClick={() => handleDelete(p)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                title="Previous"
              >
                <ChevronLeft />
              </button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <button
                className="p-2 rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                title="Next"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <label className="text-gray-600">Rows:</label>
              <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="rounded border px-2 py-1">
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      {isMobile && (
        <div className="grid grid-cols-1 gap-4">
          {loading ? <div>Loading...</div> : plans.length === 0 ? <div>No plans</div> : plans.map((p) => (
            <div key={keyOf(p)} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.subtitle}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-700 font-bold text-lg">₹{p.price}</div>
                  <div className="text-xs text-gray-500">{p.createdBy?.name ?? ""}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                {(p.services || []).slice(0, 4).map((s, i) => <div key={i}>• {s}</div>)}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => handleOpenView(p)} className="p-2 rounded bg-gray-100"><Eye size={16} /></button>
                <button onClick={() => handleOpenEdit(p)} className="p-2 rounded bg-gray-100"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p)} className="p-2 rounded bg-red-50 text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setEditPlan(null); }}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input value={form.title} onChange={(e) => onFormChange("title", e.target.value)} required className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input value={form.subtitle} onChange={(e) => onFormChange("subtitle", e.target.value)} className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => onFormChange("price", e.target.value)} required className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount Price (optional)</label>
              <input type="number" value={form.discountPrice} onChange={(e) => onFormChange("discountPrice", e.target.value)} className="w-full rounded border px-3 py-2" />
              <label className="inline-flex items-center gap-2 mt-2 text-sm">
                <input type="checkbox" checked={form.isDiscountAvailable} onChange={(e) => onFormChange("isDiscountAvailable", e.target.checked)} />
                <span>Discount available</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Billing Cycle</label>
              <select value={form.billingCycle} onChange={(e) => onFormChange("billingCycle", e.target.value)} className="w-full rounded border px-3 py-2">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Validity (days)</label>
              <input type="number" value={form.validityInDays} onChange={(e) => onFormChange("validityInDays", e.target.value)} className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Plan Type</label>
              <select value={form.planType} onChange={(e) => onFormChange("planType", e.target.value)} className="w-full rounded border px-3 py-2">
                <option value="individual">Individual</option>
                <option value="business">Business</option>
                <option value="startup">Startup</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Recommended</label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.recommended} onChange={(e) => onFormChange("recommended", e.target.checked)} />
                <span className="text-sm">Show recommended badge</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => onFormChange("description", e.target.value)} className="w-full rounded border px-3 py-2" rows={3}></textarea>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium mb-2">Services</label>
            <div className="space-y-2">
              {(form.services || []).map((svc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={svc} onChange={(e) => onServiceChange(i, e.target.value)} placeholder={`Service ${i + 1}`} className="flex-1 rounded border px-3 py-2" />
                  <button type="button" onClick={() => removeService(i)} className="px-3 py-2 rounded bg-red-50 text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addService} className="px-3 py-2 rounded bg-green-50 text-green-700">+ Add service</button>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            <div className="space-y-2">
              {(form.features || []).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={f.name} onChange={(e) => onFeatureChange(i, "name", e.target.value)} placeholder="Feature name" className="flex-1 rounded border px-3 py-2" />
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!f.included} onChange={(e) => onFeatureChange(i, "included", e.target.checked)} />
                    <span className="text-sm">Included</span>
                  </label>
                  <button type="button" onClick={() => removeFeature(i)} className="px-3 py-2 rounded bg-red-50 text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addFeature} className="px-3 py-2 rounded bg-green-50 text-green-700">+ Add feature</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Support Level</label>
              <select value={form.supportLevel} onChange={(e) => onFormChange("supportLevel", e.target.value)} className="w-full rounded border px-3 py-2">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="priority">Priority</option>
                <option value="dedicated CA">Dedicated CA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Users</label>
              <input type="number" value={form.maxUsers} onChange={(e) => onFormChange("maxUsers", e.target.value)} className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Includes Notice Handling</label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.includesNoticeHandling} onChange={(e) => onFormChange("includesNoticeHandling", e.target.checked)} />
                <span className="text-sm">Yes</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Notice Count</label>
              <input type="number" value={form.maxNoticeCount} onChange={(e) => onFormChange("maxNoticeCount", e.target.value)} className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => onFormChange("status", e.target.value)} className="w-full rounded border px-3 py-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>



          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded border" onClick={() => { setCreateOpen(false); setEditPlan(null); }}>Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-gradient-to-r from-green-600 to-teal-600 text-white">
              {saving ? "Saving..." : editPlan ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </Modal>

  {/* View Modal */}
<Modal
  open={!!viewPlan}
  onClose={() => setViewPlan(null)}
  title={viewPlan?.title ?? "Plan details"}
>
  {viewPlan ? (
    <div className="space-y-4">
      {/* Subtitle & Description */}
      {viewPlan.subtitle && <p className="text-sm text-gray-600">{viewPlan.subtitle}</p>}
      {viewPlan.description && <p className="text-sm text-gray-700">{viewPlan.description}</p>}

      {/* Pricing */}
      <div className="text-2xl font-bold text-green-700">
        ₹{viewPlan.price}
      </div>
      {viewPlan.isDiscountAvailable && viewPlan.discountPrice > 0 && (
        <div className="text-sm text-gray-500">Discount: ₹{viewPlan.discountPrice}</div>
      )}

      {/* Plan Info */}
      <div className="grid grid-cols-2 gap-3">
        <div><strong>Billing Cycle:</strong> {viewPlan.billingCycle}</div>
        <div><strong>Plan Type:</strong> {viewPlan.planType}</div>
        <div><strong>Support Level:</strong> {viewPlan.supportLevel}</div>
        <div><strong>Max Users:</strong> {viewPlan.maxUsers}</div>
        <div><strong>Notice Handling:</strong> {viewPlan.includesNoticeHandling ? "Yes" : "No"}</div>
        <div><strong>Max Notice Count:</strong> {viewPlan.maxNoticeCount}</div>
        <div><strong>Status:</strong> {viewPlan.status}</div>
        <div><strong>Recommended:</strong> {viewPlan.recommended ? "Yes" : "No"}</div>
      </div>

      {/* Services */}
      {viewPlan.services && viewPlan.services.length > 0 && (
        <>
          <h4 className="font-semibold mt-4">Services</h4>
          <ul className="list-disc pl-5 text-gray-700">
            {viewPlan.services.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}

      {/* Features */}
      {viewPlan.features && viewPlan.features.length > 0 && (
        <>
          <h4 className="font-semibold mt-4">Features</h4>
          <ul className="list-disc pl-5 text-gray-700">
            {viewPlan.features.map((f, i) => (
              <li key={i}>{f.name} {f.included ? "— included" : "— not included"}</li>
            ))}
          </ul>
        </>
      )}

      {/* Created info */}
      <div className="text-sm text-gray-500">
        Created by: {viewPlan.createdBy?.name ?? viewPlan.createdBy?.email ?? "—"}
      </div>
      <div className="text-xs text-gray-400">
        Created at: {new Date(viewPlan.createdAt).toLocaleString()}
      </div>

      {/* Thumbnail */}
      {viewPlan.thumbnail && (
        <div className="mt-4">
          <img
            src={viewPlan.thumbnail}
            alt="thumbnail"
            className="max-h-48 rounded object-contain border"
          />
        </div>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  )}
</Modal>


      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        onConfirm={confirmDeleteNow}
        onCancel={() => setConfirmDelete({ open: false, planId: null })}
      />
    </div>
  );
};

export default AdminPlans;
