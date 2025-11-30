import React, { useEffect, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAllUsers } from "../../services/authService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();

      // ⭐ Only show clients
      const filtered = data.filter((u) => u.role === "client");
      setUsers(filtered);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(users.length / perPage);
  const paginatedData = users.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-700">
            Registered Clients
          </h1>
          <p className="text-sm text-gray-600">
            View and manage all client accounts.
          </p>
        </div>
      </div>

      {/* ============================
            DESKTOP TABLE VIEW
      ============================ */}
      {!isMobile && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    No clients found
                  </td>
                </tr>
              ) : (
                paginatedData.map((u, idx) => (
                  <tr key={u._id} className="border-t last:border-b">
                    <td className="p-3">{(page - 1) * perPage + idx + 1}</td>

                    <td className="p-3 font-semibold text-gray-800">
                      {u.name}
                    </td>

                    <td className="p-3 text-sm">{u.email}</td>

                    <td className="p-3 text-sm">{u.contactNumber || "N/A"}</td>

                    <td className="p-3 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => setViewUser(u)}
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

              <span className="text-sm">Page {page} of {totalPages}</span>

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
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ============================
            MOBILE CARDS
      ============================ */}
      {isMobile && (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : paginatedData.length === 0 ? (
            <div>No clients found</div>
          ) : (
            paginatedData.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-xl shadow-sm border p-4"
              >
                <div className="flex justify-between">
                  <div className="font-semibold text-lg">{u.name}</div>
                </div>

                <p className="text-sm text-gray-600">{u.email}</p>

                <p className="text-sm mt-1">
                  <strong>Joined:</strong>{" "}
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>

                <button
                  onClick={() => setViewUser(u)}
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
            MODAL VIEW
      ============================ */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setViewUser(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full">
            <button
              className="absolute top-2 right-2 px-3 py-1 bg-gray-200 rounded"
              onClick={() => setViewUser(null)}
            >
              Close
            </button>

            <h2 className="text-2xl font-bold mb-3">{viewUser.name}</h2>

            <p className="mb-2">
              <strong>Email:</strong> {viewUser.email}
            </p>

            <p className="mb-2">
              <strong>Phone:</strong> {viewUser.contactNumber || "N/A"}
            </p>

            <p className="mb-2">
              <strong>Joined:</strong>{" "}
              {new Date(viewUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
