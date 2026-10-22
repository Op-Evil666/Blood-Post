
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    setError("");
    setLoggingOut(true);

    try {
      await logout();
      closeMenu();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Logout failed. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const linkClass =
    "font-semibold text-[#E1F3D8] transition-colors duration-300 hover:text-[#39FF14]";

  const buttonClass =
    "rounded-md border border-[#D93650] bg-[#A50928] px-4 py-2 text-center font-semibold text-white shadow-[0_3px_0_#570817] transition duration-300 hover:-translate-y-0.5 hover:bg-[#C50C32] hover:shadow-[0_0_16px_rgba(165,9,40,0.45)] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60";

  const profileButtonClass =
    "inline-flex items-center justify-center gap-1 rounded-lg border border-[#FF304F]/50 bg-[#19090F] px-4 py-2.5 font-bold text-[#FF526B] shadow-[0_0_12px_rgba(255,48,79,0.15)] transition duration-300 hover:border-[#FF304F] hover:bg-[#350B16] hover:text-[#FF7188] hover:shadow-[0_0_18px_rgba(255,48,79,0.3)]";

  const renderNavigation = () => (
    <>
      <Link to="/home" onClick={closeMenu} className={linkClass}>
        Home
      </Link>

      <Link to="/explore" onClick={closeMenu} className={linkClass}>
        Explore
      </Link>

      <Link to="/posts/create" onClick={closeMenu} className={linkClass}>
        Post
      </Link>

      <Link to="/about" onClick={closeMenu} className={linkClass}>
        About
      </Link>

      {!loading && !isAuthenticated && (
        <Link
          to="/login"
          onClick={closeMenu}
          className={buttonClass}
        >
          Login
        </Link>
      )}

      {!loading && isAuthenticated && (
        <>
          <Link
            to="/profile"
            onClick={closeMenu}
            className={profileButtonClass}
            aria-label="Open your profile"
          >
            <span className="text-[#B9F542]">Hi,</span>
            <span className="max-w-[140px] truncate">
              {user?.name
  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
  : "User"}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={buttonClass}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      )}

      {loading && (
        <span className="text-sm font-semibold text-[#E1F3D8]">
          Checking session...
        </span>
      )}

      {error && (
        <p role="alert" className="text-sm font-semibold text-[#FF7188]">
          {error}
        </p>
      )}
    </>
  );

  return (
    <nav
      className="
        relative z-20 border-b border-[#39FF14]/40
        bg-[#123D24]
        shadow-[0_4px_20px_rgba(57,255,20,0.18),0_8px_35px_rgba(0,0,0,0.4)]
        animate-pulse motion-reduce:animate-none
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,220,0.04)_25%,rgba(255,255,200,0.25)_48%,rgba(255,255,220,0.06)_65%,transparent_100%)]
          motion-reduce:hidden
        "
      />

      <div className="mx-auto flex min-h-[100px] max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="
            font-horror-logo text-3xl tracking-wide text-[#E31B3F]
            drop-shadow-[0_0_6px_rgba(227,27,63,0.3)]
            transition duration-300 hover:drop-shadow-[0_0_12px_rgba(227,27,63,0.65)]
            sm:text-4xl
          "
        >
          Blood Post
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {renderNavigation()}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="
            rounded-md border border-[#718D23] px-3 py-2
            font-bold text-[#E1F3D8] transition duration-300
            hover:bg-[#A6DC37] hover:text-[#100609]
            lg:hidden
          "
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div
          className="
            flex flex-col gap-4 border-t border-[#39FF14]/30
            bg-[#100609] px-5 py-5
            shadow-[0_10px_25px_rgba(0,0,0,0.4)]
            lg:hidden
          "
        >
          {renderNavigation()}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
