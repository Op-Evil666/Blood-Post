
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  requestVerificationOtp,
  verifyEmailOtp,
} from "../services/authService";

function VerifyEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await requestVerificationOtp(email.trim());
      setMessage(
        result.message ||
          "If the account can be verified, an OTP will be sent when permitted."
      );
      setStage("otp");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await verifyEmailOtp(email.trim(), otp);
      setMessage(result.message || "Your account has been verified.");
      navigate("/login", {
        replace: true,
        state: { message: result.message || "Email verified. You can now log in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Verification failed. Please check your OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#57202D] bg-[#16080D] p-6 shadow-[0_0_35px_rgba(255,40,75,0.12)] sm:p-8">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-[#FF637C]">
          Blood Post // Account Recovery
        </p>

        <h1 className="mb-3 text-center text-3xl font-black text-[#FFE7EC]">
          {stage === "email" ? "Verify Your Email" : "Enter Your OTP"}
        </h1>

        <p className="mb-6 text-center text-sm text-[#B7A7AC]">
          {stage === "email"
            ? "Lost your verification session? Enter the email you registered with to request a new code."
            : `Enter the six-digit code sent to ${email}.`}
        </p>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-[#315B43] bg-[#10251A] p-3 text-sm text-[#A7F3C1]"
          >
            {message}
          </p>
        )}

        {stage === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label
                htmlFor="recovery-email"
                className="mb-2 block text-sm font-semibold text-[#E8D9DE]"
              >
                Registered email
              </label>
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#57202D] bg-[#080306] px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-[#FF637C] focus:ring-1 focus:ring-[#FF637C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#B51F3B] px-4 py-3 font-bold text-white transition hover:bg-[#D52B4B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Requesting..." : "Send Verification OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label
                htmlFor="verification-otp"
                className="mb-2 block text-sm font-semibold text-[#E8D9DE]"
              >
                Six-digit OTP
              </label>
              <input
                id="verification-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                required
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full rounded-lg border border-[#57202D] bg-[#080306] px-4 py-3 text-center text-2xl tracking-[0.5em] text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-[#FF637C] focus:ring-1 focus:ring-[#FF637C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-lg bg-[#B51F3B] px-4 py-3 font-bold text-white transition hover:bg-[#D52B4B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStage("email");
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-sm text-[#FF9AAA] underline-offset-4 hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#B7A7AC]">
          Remembered your credentials?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#FF637C] underline-offset-4 hover:underline"
          >
            Return to Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default VerifyEmail;
