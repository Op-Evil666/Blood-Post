import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#100609] px-4 py-20 text-center text-[#E1F3D8]">
        <p className="animate-pulse font-serif text-xl text-[#39FF14]">
          Checking your identity...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default RequireAuth;
