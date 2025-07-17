import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login/admin" />;
  }

  return <Outlet />;
};

export default AdminRoute;
