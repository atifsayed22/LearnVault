import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Check, X, Eye, Filter } from "lucide-react";

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // Track which instructor is being acted on

  useEffect(() => {
    fetchInstructors();
  }, [filterStatus]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await axiosInstance.get("/admin/instructors", { params });
      setInstructors(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError(err.response?.data?.message || "Failed to fetch instructors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this instructor?")) return;
    try {
      setActionLoading(id); // Show loading on this specific button
      const response = await axiosInstance.put(`/admin/instructors/${id}/approve`);
      
      // Update immediately in state before refetching
      setInstructors(prev =>
        prev.map(inst =>
          inst._id === id
            ? { ...inst, documentStatus: "approved", isVerified: true }
            : inst
        )
      );
      
      setActionLoading(null);
      
      // Show success message
      alert("Instructor approved successfully!");
      
      // Refetch after a short delay to ensure backend is updated
      setTimeout(() => fetchInstructors(), 500);
    } catch (err) {
      setActionLoading(null);
      alert(err.response?.data?.message || "Failed to approve instructor");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      setActionLoading(id); // Show loading on this specific button
      await axiosInstance.put(`/admin/instructors/${id}/reject`, {
        rejectionReason: rejectReason,
      });
      
      // Update immediately in state
      setInstructors(prev =>
        prev.map(inst =>
          inst._id === id
            ? { ...inst, documentStatus: "rejected", isVerified: false }
            : inst
        )
      );
      
      setActionLoading(null);
      setShowModal(false);
      setRejectReason("");
      
      // Show success message
      alert("Instructor rejected successfully!");
      
      // Refetch after a short delay
      setTimeout(() => fetchInstructors(), 500);
    } catch (err) {
      setActionLoading(null);
      alert(err.response?.data?.message || "Failed to reject instructor");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading instructors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instructor Management</h1>
        <p className="text-gray-600 mt-2">Manage and verify instructor accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <button
            onClick={() => setFilterStatus("")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "approved"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "rejected"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* Instructors Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {instructors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No instructors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{instructor.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{instructor.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {instructor.courseCount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {instructor.enrollmentCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          instructor.documentStatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : instructor.documentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {instructor.documentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInstructor(instructor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {instructor.documentStatus !== "approved" && (
                          <>
                            <button
                              onClick={() => handleApprove(instructor._id)}
                              disabled={actionLoading === instructor._id}
                              className={`p-2 rounded-lg transition ${
                                actionLoading === instructor._id
                                  ? "text-green-400 opacity-50 cursor-not-allowed"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title="Approve"
                            >
                              {actionLoading === instructor._id ? (
                                <div className="animate-spin">
                                  <Check size={18} />
                                </div>
                              ) : (
                                <Check size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInstructor(instructor);
                                setShowModal(true);
                              }}
                              disabled={actionLoading === instructor._id}
                              className={`p-2 rounded-lg transition ${
                                actionLoading === instructor._id
                                  ? "text-red-400 opacity-50 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedInstructor && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedInstructor.name}
              </h2>
              <p className="text-gray-600">{selectedInstructor.email}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-gray-900">
                    {selectedInstructor.documentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verified</p>
                  <p className="font-semibold text-gray-900">
                    {selectedInstructor.isVerified ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courses</p>
                  <p className="font-semibold text-gray-900">
                    {selectedInstructor.courseCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Enrollments</p>
                  <p className="font-semibold text-gray-900">
                    {selectedInstructor.enrollmentCount || 0}
                  </p>
                </div>
              </div>
              {selectedInstructor.documents && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Documents</p>
                  <a
                    href={selectedInstructor.documents}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Document
                  </a>
                </div>
              )}
              {selectedInstructor.rejectionReason && (
                <div>
                  <p className="text-sm text-gray-500">Rejection Reason</p>
                  <p className="text-red-600 font-medium">
                    {selectedInstructor.rejectionReason}
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedInstructor(null)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Reject {selectedInstructor.name}?
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <label className="block">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this application is being rejected..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
              </label>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedInstructor._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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

export default InstructorManagement;
