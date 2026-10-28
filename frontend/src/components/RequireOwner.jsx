import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.js";

function RequireOwner() {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#100609] text-gray-100">
        Restoring session...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "owner") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default RequireOwner;
