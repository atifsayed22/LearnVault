import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Check, X, FileText } from "lucide-react";

const PendingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/applications/pending");
      setApplications(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this instructor application?")) return;
    try {
      setActionLoading(id);
      await axiosInstance.put(`/admin/instructors/${id}/approve`);
      
      // Remove from pending list immediately
      setApplications(prev => prev.filter(app => app._id !== id));
      
      setActionLoading(null);
      alert("Application approved successfully!");
      
      // Refetch to be sure
      setTimeout(() => fetchPendingApplications(), 500);
    } catch (err) {
      setActionLoading(null);
      alert(err.response?.data?.message || "Failed to approve application");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      setActionLoading(id);
      await axiosInstance.put(`/admin/instructors/${id}/reject`, {
        rejectionReason: rejectReason,
      });
      
      // Remove from pending list immediately
      setApplications(prev => prev.filter(app => app._id !== id));
      
      setActionLoading(null);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedApp(null);
      
      alert("Application rejected!");
      
      // Refetch to be sure
      setTimeout(() => fetchPendingApplications(), 500);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedApp(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject application");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pending Applications</h1>
        <p className="text-gray-600 mt-2">Review and approve/reject instructor applications</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            <p className="text-lg">No pending applications</p>
            <p className="text-sm mt-2">All applications have been reviewed!</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{app.name}</h3>
                <p className="text-sm text-gray-600">{app.email}</p>
              </div>

              {/* Application Date */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Applied on</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(app.applicationDate).toLocaleDateString()}
                </p>
              </div>

              {/* Document */}
              {app.documents && (
                <div className="mb-4">
                  <a
                    href={app.documents}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <FileText size={18} />
                    View Document
                  </a>
                </div>
              )}

              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                  {app.documentStatus}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(app._id)}
                  disabled={actionLoading === app._id}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                    actionLoading === app._id
                      ? "bg-green-400 text-white opacity-75 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {actionLoading === app._id ? (
                    <>
                      <div className="animate-spin">
                        <Check size={18} />
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Approve
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setShowRejectModal(true);
                  }}
                  disabled={actionLoading === app._id}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                    actionLoading === app._id
                      ? "bg-red-400 text-white opacity-75 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <X size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Reject Application from {selectedApp.name}?
              </h2>
              <p className="text-gray-600 text-sm mt-1">{selectedApp.email}</p>
            </div>
            <div className="p-6 space-y-4">
              <label className="block">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Please provide a reason for rejection
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Be constructive and helpful..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                ></textarea>
              </label>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedApp._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApplications;
