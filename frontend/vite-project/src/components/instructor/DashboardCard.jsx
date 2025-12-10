import { useNavigate } from "react-router-dom";

export default function DashboardCard({ title, description, link }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/10 
        shadow-lg hover:bg-white/20 hover:border-purple-400 hover:shadow-purple-700/40 
        transition cursor-pointer"
      onClick={() => navigate(link)}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
  );
}
