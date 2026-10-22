
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Update only the field the user has changed.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate confirmation before making an API request.
    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      /*
       * Send only the fields expected by the backend.
       * confirmPassword is a frontend-only validation field.
       */
      const registerData = {
       name: formData.name,
       email: formData.email,
       password: formData.password,
       confirmPassword: formData.confirmPassword,
       bio: formData.bio,
      };

      await registerUser(registerData);

      /*
       * Registration doesn't necessarily mean the account is verified.
       * For now, send the user to Login after successful registration.
       * If your backend returns a user ID and you have an OTP screen,
       * navigate to that screen instead.
       */
      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful. Please verify your account if required, then log in.",
        },
      });
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

  const inputClass =
    "mt-2 block w-full rounded-lg border border-[#59202D] bg-[#100609]/90 px-4 py-3 text-[#F4E9E9] outline-none transition duration-200 placeholder:text-[#806970] focus:border-[#E31B3F] focus:ring-2 focus:ring-[#E31B3F]/25 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "block text-sm font-semibold tracking-wide text-[#E8CDD3]";

  return (
    <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#100609] px-4 py-14 sm:py-20">
      {/* Blood-red atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B001B]/25 blur-[100px] sm:h-[36rem] sm:w-[36rem]"
      />

      {/* Secondary crimson glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[#E31B3F]/10 blur-[100px]"
      />

      {/* Registration card */}
      <div className="w-full max-w-lg rounded-2xl border border-[#A50928]/40 bg-[#14070B]/90 p-6 shadow-[0_0_30px_rgba(227,27,63,0.12),0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-9">
        {/* Branding and heading */}
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
            Create Your Account
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#B7A7AC]">
            Every story begins somewhere. Let yours begin here.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label htmlFor="name" className={labelClass}>
            Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="What should we call you?"
            className={inputClass}
          />

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm password */}
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

          {/* Optional bio */}
          <label htmlFor="bio" className={`${labelClass} mt-5`}>
            Bio <span className="font-normal text-[#8E747B]">(optional)</span>
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

          {/* Registration errors */}
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-[#E31B3F]/35 bg-[#E31B3F]/10 p-3 text-sm leading-6 text-[#FF9AAA]"
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-7 w-full rounded-lg border border-[#F04460] bg-[#A50928] px-4 py-3 font-bold tracking-wide text-white shadow-[0_4px_0_#570817,0_0_18px_rgba(165,9,40,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#C50C32] hover:shadow-[0_0_25px_rgba(227,27,63,0.35)] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Summoning your account..." : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-7 text-center text-sm text-[#B7A7AC]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#FF637C] underline-offset-4 transition hover:text-[#FFA0AF] hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="mt-6 text-center text-xs tracking-wide text-[#72565E]">
          ENTER AT YOUR OWN RISK
        </p>
      </div>
    </section>
  );
}

export default Register;
