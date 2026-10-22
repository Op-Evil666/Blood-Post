
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/home";

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "The darkness rejected your credentials. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080306] px-4 py-12 text-[#F4E7EB]">
      {/* Haunted atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(105,8,29,0.28),transparent_55%),radial-gradient(ellipse_at_15%_85%,rgba(57,255,20,0.05),transparent_35%),linear-gradient(180deg,#100609_0%,#080306_100%)]"
      />

      {/* Ghostly red light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#A50928]/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#39FF14]/[0.035] blur-[120px]"
      />

      {/* Subtle grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,0.3)_0.5px,transparent_0.5px)] [background-size:5px_5px]"
      />

      {/* Login panel */}
      <section className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#702033] bg-[#16080D]/95 shadow-[0_0_30px_rgba(165,9,40,0.12),0_0_100px_rgba(0,0,0,0.7)]">
        {/* Crimson top edge */}
        <div
          aria-hidden="true"
          className="h-1 w-full bg-gradient-to-r from-transparent via-[#FF304F] to-transparent"
        />

        <div className="p-7 sm:p-10">
          {/* Brand */}
          <header className="mb-9 text-center">
            <Link
              to="/"
              className="font-horror-logo text-4xl tracking-wider text-[#FF304F] drop-shadow-[0_0_12px_rgba(255,48,79,0.3)] transition hover:drop-shadow-[0_0_20px_rgba(255,48,79,0.6)] sm:text-5xl"
            >
              Blood Post
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.35em] text-[#B9F542]">
              The gates open once more
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold text-[#F4E7EB] sm:text-4xl">
              THE DEAD REMEMBER
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#C8AEB7]">
              You've returned. The darkness never forgot you.
            </p>
          </header>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-semibold text-[#B9F542]"
              >
                Email or Username
              </label>

              <input
                id="identifier"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your identity..."
                autoComplete="username"
                required
                disabled={submitting}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] caret-[#B9F542] outline-none transition placeholder:text-[#80616C] hover:border-[#92243B] focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#B9F542]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Speak the forbidden words..."
                autoComplete="current-password"
                required
                disabled={submitting}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] caret-[#B9F542] outline-none transition placeholder:text-[#80616C] hover:border-[#92243B] focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />
            </div>

            {/* Error feedback */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-[#A50928] bg-[#350B16] px-4 py-3 text-sm leading-relaxed text-[#FF8A9B]"
              >
                <span className="mr-2 text-[#FF304F]">☠</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full overflow-hidden rounded-lg border border-[#E31B3F] bg-[#A50928] px-5 py-4 font-bold uppercase tracking-[0.15em] text-white shadow-[0_4px_0_#570817,0_0_18px_rgba(165,9,40,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#C8102E] hover:shadow-[0_4px_0_#570817,0_0_28px_rgba(255,48,79,0.3)] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10">
                {submitting ? "Opening the gates..." : "Enter the Darkness"}
              </span>

              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </button>
          </form>

          {/* Registration */}
          <p className="mt-8 text-center text-sm text-[#C8AEB7]">
            New to this place?{" "}
            <Link
              to="/register"
              className="font-bold text-[#B9F542] transition duration-300 hover:text-[#FF304F] hover:drop-shadow-[0_0_8px_rgba(255,48,79,0.7)]"
            >
              Register
            </Link>
          </p>

          {/* Decorative footer */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#702033]" />
            <span className="text-xs text-[#702033]">✦</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#80616C]">
              Enter at your own risk
            </span>
            <span className="text-xs text-[#702033]">✦</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#702033]" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
