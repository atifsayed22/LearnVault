import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
export default function RoleRoute({ children, allowed }) {
  const { user } = useAuth();

  if (!allowed.includes(user?.role)) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
}
