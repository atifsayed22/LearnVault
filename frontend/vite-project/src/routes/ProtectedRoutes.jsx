import { Navigate } from "react-router-dom";
import useAuth from "../utils/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/auth" replace />;
}
