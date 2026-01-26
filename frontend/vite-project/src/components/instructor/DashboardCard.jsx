import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function DashboardCard({ title, description, link, disabled, disabledReason }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate(link);
    }
  };

  return (
    <div
      className={`bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/10 
        shadow-lg transition ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-white/5 border-red-400/30"
            : "hover:bg-white/20 hover:border-purple-400 hover:shadow-purple-700/40 cursor-pointer"
        }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-300 mt-2">{description}</p>
          {disabled && disabledReason && (
            <p className="text-red-300 text-sm mt-3 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              {disabledReason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
