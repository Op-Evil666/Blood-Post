
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  verifyUser,
  resendVerificationOtp,
} from "../services/authService";

const RESEND_COOLDOWN = 60;

function Register() {
  const navigate = useNavigate();

  const [stage, setStage] = useState("register");
  const [userId, setUserId] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCountdown((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      // Send only fields accepted by the backend schema.
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        bio: formData.bio,
      });

      if (!result.userId) {
        throw new Error(
          "Registration response did not include a user ID. Please contact support."
        );
      }

      setUserId(result.userId);
      setRegisteredEmail(formData.email);
      setStage("verify");
      setOtp("");
      setResendCountdown(RESEND_COOLDOWN);

      // Do not retain the password after registration.
      setFormData((previous) => ({
        ...previous,
        password: "",
        confirmPassword: "",
      }));

      setNotice(
        result.message ||
          "Your account was created. Check your email for the verification code."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete six-digit verification code.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await verifyUser(userId, otp);

      navigate("/login", {
        replace: true,
        state: {
          message:
            result.message ||
            "Email verified successfully. You can now log in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Verification failed. Check your code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId || resendCountdown > 0 || isResending || isLoading) {
      return;
    }

    setError("");
    setNotice("");

    try {
      setIsResending(true);

      const result = await resendVerificationOtp(userId);

      setResendCountdown(RESEND_COOLDOWN);
      setOtp("");
      setNotice(
        result.message || "If permitted, a new verification code has been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to request another code. Please try again later."
      );

      // Do not start a fresh countdown after a failed request.
    } finally {
      setIsResending(false);
    }
  };

  const inputClass =
    "mt-2 block w-full rounded-lg border border-[#59202D] bg-[#100609]/90 px-4 py-3 text-[#F4E9E9] outline-none transition duration-200 placeholder:text-[#806970] focus:border-[#E31B3F] focus:ring-2 focus:ring-[#E31B3F]/25 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "block text-sm font-semibold tracking-wide text-[#E8CDD3]";

  const buttonClass =
    "mt-7 w-full rounded-lg border border-[#F04460] bg-[#A50928] px-4 py-3 font-bold tracking-wide text-white shadow-[0_4px_0_#570817,0_0_18px_rgba(165,9,40,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#C50C32] hover:shadow-[0_0_25px_rgba(227,27,63,0.35)] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#100609] px-4 py-14 sm:py-20">
      {/* Blood-red atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B001B]/25 blur-[100px] sm:h-[36rem] sm:w-[36rem]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[#E31B3F]/10 blur-[100px]"
      />

      <div className="w-full max-w-lg rounded-2xl border border-[#A50928]/40 bg-[#14070B]/90 p-6 shadow-[0_0_30px_rgba(227,27,63,0.12),0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-9">
        {/* Branding */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="font-horror-logo text-4xl tracking-wide text-[#E31B3F] drop-shadow-[0_0_12px_rgba(227,27,63,0.4)] sm:text-5xl"
          >
            Blood Post
          </Link>

          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#C34B62]">
            Enter the darkness
          </p>

          <h1 className="mt-5 font-serif text-3xl font-bold text-[#F4E9E9]">
            {stage === "register"
              ? "Create Your Account"
              : "Verify Your Email"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#B7A7AC]">
            {stage === "register"
              ? "Every story begins somewhere. Let yours begin here."
              : "One final step before your story begins."}
          </p>
        </div>

        {stage === "register" ? (
          <form onSubmit={handleRegister}>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="username"
              required
              maxLength={80}
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Choose a username"
              className={inputClass}
            />

            <label htmlFor="email" className={`${labelClass} mt-5`}>
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="you@example.com"
              className={inputClass}
            />

            <label htmlFor="password" className={`${labelClass} mt-5`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Create a password"
              className={inputClass}
            />

            <label
              htmlFor="confirmPassword"
              className={`${labelClass} mt-5`}
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter your password again"
              className={inputClass}
            />

            <label htmlFor="bio" className={`${labelClass} mt-5`}>
              Bio{" "}
              <span className="font-normal text-[#8E747B]">
                (optional)
              </span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={300}
              value={formData.bio}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="A little about yourself..."
              className={`${inputClass} resize-y`}
            />

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-lg border border-[#E31B3F]/35 bg-[#E31B3F]/10 p-3 text-sm leading-6 text-[#FF9AAA]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={buttonClass}
            >
              {isLoading ? "Summoning your account..." : "Register"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="rounded-lg border border-[#59202D] bg-[#100609]/70 p-4">
              <p className="text-sm text-[#B7A7AC]">
                Verification code sent to
              </p>
              <p className="mt-1 break-all font-semibold text-[#FF9AAA]">
                {registeredEmail}
              </p>
            </div>

            <label htmlFor="otp" className={`${labelClass} mt-6`}>
              Six-digit verification code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={isLoading}
              placeholder="000000"
              aria-describedby="otp-help"
              className={`${inputClass} text-center text-2xl tracking-[0.5em]`}
            />

            <p id="otp-help" className="mt-2 text-xs text-[#8E747B]">
              The code expires five minutes after it is issued.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-lg border border-[#E31B3F]/35 bg-[#E31B3F]/10 p-3 text-sm leading-6 text-[#FF9AAA]"
              >
                {error}
              </p>
            )}

            {notice && (
              <p
                role="status"
                className="mt-5 rounded-lg border border-[#59202D] bg-[#8B001B]/10 p-3 text-sm leading-6 text-[#E8CDD3]"
              >
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className={buttonClass}
            >
              {isLoading ? "Checking the code..." : "Verify Email"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#B7A7AC]">
                Didn't receive the email?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={
                  isLoading || isResending || resendCountdown > 0
                }
                className="mt-2 font-semibold text-[#FF637C] underline-offset-4 transition hover:text-[#FFA0AF] hover:underline disabled:cursor-not-allowed disabled:text-[#806970] disabled:no-underline"
              >
                {isResending
                  ? "Sending another code..."
                  : resendCountdown > 0
                    ? `Resend code in ${resendCountdown}s`
                    : "Resend verification code"}
              </button>
            </div>
          </form>
        )}

        {stage === "register" && error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-[#E31B3F]/35 bg-[#E31B3F]/10 p-3 text-sm leading-6 text-[#FF9AAA]"
          >
            {error}
          </p>
        )}

        {stage === "register" && notice && (
          <p
            role="status"
            className="mt-5 rounded-lg border border-[#59202D] bg-[#8B001B]/10 p-3 text-sm leading-6 text-[#E8CDD3]"
          >
            {notice}
          </p>
        )}

        <p className="mt-7 text-center text-sm text-[#B7A7AC]">
          {stage === "register" ? (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#FF637C] underline-offset-4 transition hover:text-[#FFA0AF] hover:underline"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              Already verified?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#FF637C] underline-offset-4 transition hover:text-[#FFA0AF] hover:underline"
              >
                Go to Login
              </Link>
            </>
          )}
        </p>

        <p className="mt-6 text-center text-xs tracking-wide text-[#72565E]">
          ENTER AT YOUR OWN RISK
        </p>
      </div>
    </section>
  );
}

export default Register;
