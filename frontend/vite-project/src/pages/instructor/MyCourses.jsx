import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Earnings() {
  const [summary, setSummary] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [range, setRange] = useState("30d");

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    loadSummary();
    loadCourseEarnings();
    loadWithdrawHistory();
  }, [range]);

  const loadSummary = async () => {
    try {
      const res = await api.get(`/instructor/earnings/summary?range=${range}`);
      setSummary(res.data);
    } catch (err) {
      toast.error("Failed to load summary");
    }
  };

  const loadCourseEarnings = async () => {
    try {
      const res = await api.get(`/instructor/earnings/by-course`);
      setCourseData(res.data.courses);
    } catch (err) {
      toast.error("Failed to load course earnings");
    }
  };

  const loadWithdrawHistory = async () => {
    try {
      const res = await api.get(`/instructor/withdraw/history`);
      setWithdrawHistory(res.data.history);
    } catch (err) {
      toast.error("Failed to load withdrawal history");
    }
  };

  const requestWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0)
      return toast.error("Enter a valid amount");

    if (withdrawAmount > summary.availableBalance)
      return toast.error("Amount exceeds available balance");

    try {
      await api.post("/instructor/withdraw", { amount: withdrawAmount });
      toast.success("Withdrawal request submitted");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      loadSummary();
      loadWithdrawHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request withdrawal");
    }
  };

  if (!summary) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-10 space-y-10">

      <h1 className="text-3xl font-bold mb-6">Earnings Overview</h1>

      {/* RANGE SWITCH */}
      <div className="flex gap-3 mb-4">
        {["7d", "30d", "90d", "all"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-lg border ${
              range === r ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300"
            }`}
          >
            {r === "all" ? "Lifetime" : r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Earnings" value={`₹${summary.totalEarnings}`} />
        <SummaryCard title="Withdrawn" value={`₹${summary.withdrawn}`} />
        <SummaryCard title="Pending Withdrawal" value={`₹${summary.pending}`} />
        <SummaryCard title="Available Balance" value={`₹${summary.availableBalance}`} highlight />
      </div>

      {/* EARNINGS PER COURSE */}
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Earnings Per Course</h2>

        <div className="space-y-4">
          {courseData.map((course) => (
            <div key={course._id} className="bg-white/5 p-4 rounded-lg flex justify-between">
              <div>
                <p className="font-semibold">{course.title}</p>
                <p className="text-gray-300 text-sm">
                  Students: {course.students} • Gross: ₹{course.grossAmount}
                </p>
              </div>

              <p className="text-green-400 font-bold text-lg">₹{course.netAmount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WITHDRAW SECTION */}
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold mb-3">Withdrawal</h2>

        <p className="mb-3 text-gray-300">
          Available Balance: <span className="text-green-400 font-bold">₹{summary.availableBalance}</span>
        </p>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="btn-primary"
        >
          Request Withdrawal
        </button>
      </div>

      {/* WITHDRAW HISTORY */}
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>

        {withdrawHistory.length === 0 ? (
          <p className="text-gray-300">No withdrawals yet.</p>
        ) : (
          withdrawHistory.map((w) => (
            <div key={w._id} className="bg-white/5 p-4 rounded-lg flex justify-between">
              <p>₹{w.amount}</p>
              <p
                className={
                  w.status === "pending"
                    ? "text-yellow-400"
                    : w.status === "approved"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {w.status.toUpperCase()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 w-full max-w-md">
            <h2 className="text-xl mb-4">Request Withdrawal</h2>

            <input
              type="number"
              className="input"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <button className="btn-primary" onClick={requestWithdraw}>
                Submit
              </button>
              <button
                className="btn-primary bg-gray-600"
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, highlight }) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        highlight ? "bg-purple-600 text-white border-purple-400" : "bg-white/10 border-white/20"
      }`}
    >
      <p className="text-gray-300">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
