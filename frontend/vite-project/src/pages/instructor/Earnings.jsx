import { useAuth } from "../../context/AuthContext";

export default function Earnings() {
  const { user } = useAuth();

  // Placeholder overall summary
  const summary = {
    grossEarnings: 15000,
    commissionRate: 20,
    totalEnrollments: 53,
    nextPayoutDate: "25 Jan 2025",
  };

  // Placeholder earning per-course breakdown
  const perCourse = [
    {
      id: "1",
      title: "JavaScript Mastery",
      enrollments: 25,
      price: 499,
    },
    {
      id: "2",
      title: "Full Stack Bootcamp",
      enrollments: 12,
      price: 799,
    },
    {
      id: "3",
      title: "DSA Essentials",
      enrollments: 16,
      price: 299,
    },
  ];

  const commissionAmount = (summary.grossEarnings * summary.commissionRate) / 100;
  const netEarnings = summary.grossEarnings - commissionAmount;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Earnings</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* NET EARNINGS */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-xl shadow-lg">
          <p className="text-gray-300 text-sm">Net Earnings</p>
          <h2 className="text-3xl font-bold text-green-400">₹{netEarnings}</h2>
          <p className="text-sm text-gray-400 mt-2">(after commission)</p>
        </div>

        {/* GROSS EARNINGS */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-xl shadow-lg">
          <p className="text-gray-300 text-sm">Gross Earnings</p>
          <h2 className="text-3xl font-bold">₹{summary.grossEarnings}</h2>
          <p className="text-sm text-gray-400 mt-2">(before commission)</p>
        </div>

        {/* TOTAL ENROLLMENTS */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-xl shadow-lg">
          <p className="text-gray-300 text-sm">Total Enrollments</p>
          <h2 className="text-3xl font-bold">{summary.totalEnrollments}</h2>
        </div>
      </div>

      {/* COMMISSION INFO */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-3">Platform Commission</h3>
        <p className="text-gray-300">
          Commission Rate: <span className="font-semibold">{summary.commissionRate}%</span>
        </p>
        <p className="text-gray-300">
          Commission Amount: <span className="text-red-400 font-semibold">₹{commissionAmount}</span>
        </p>
      </div>

      {/* NEXT PAYOUT */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-3">Next Payout</h3>
        <p className="text-gray-300">
          Expected on:
          <span className="font-semibold ml-2">{summary.nextPayoutDate}</span>
        </p>
      </div>

      {/* EARNINGS PER COURSE */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-5">Earnings by Course</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-300 border-b border-white/20">
              <tr>
                <th className="py-2">Course</th>
                <th className="py-2">Enrollments</th>
                <th className="py-2">Price</th>
                <th className="py-2">Gross</th>
                <th className="py-2">Commission</th>
                <th className="py-2">Net Earnings</th>
              </tr>
            </thead>

            <tbody>
              {perCourse.map((c) => {
                const gross = c.enrollments * c.price;
                const commission = (gross * summary.commissionRate) / 100;
                const net = gross - commission;

                return (
                  <tr key={c.id} className="border-b border-white/10 text-gray-200">
                    <td className="py-3 font-medium">{c.title}</td>
                    <td className="py-3">{c.enrollments}</td>
                    <td className="py-3">₹{c.price}</td>
                    <td className="py-3">₹{gross}</td>
                    <td className="py-3 text-red-400">-₹{commission}</td>
                    <td className="py-3 text-green-400">₹{net}</td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
