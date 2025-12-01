import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      const finalUserId = result.user?._id || result.userId || null;

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      if (finalUserId) {
        localStorage.setItem("userId", finalUserId);
      }

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      toast.success(result.message || "Logged in!");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  const containerBg = theme === "dark" ? "dark:bg-gray-900" : "bg-white";
  const cardBorder =
    theme === "dark" ? "dark:border-gray-700" : "border-gray-300";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const inputFocus =
    theme === "dark" ? "focus:ring-gray-400" : "focus:ring-gray-800";
  const btnClass =
    theme === "dark"
      ? "bg-white text-black hover:bg-gray-200"
      : "bg-black text-white hover:bg-gray-800";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black transition-all">
      <div
        className={`${containerBg} ${textColor} rounded-2xl shadow-2xl p-8 w-full max-w-md border ${cardBorder}`}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          <div>
            <input
              type="email"
              aria-label="Email"
              autoComplete="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${cardBorder} bg-transparent focus:outline-none focus:ring-2 ${inputFocus} transition`}
            />
          </div>

          <div>
            <input
              type="password"
              aria-label="Password"
              autoComplete="current-password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${cardBorder} bg-transparent focus:outline-none focus:ring-2 ${inputFocus} transition`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${btnClass}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-rose-500">
            {error.message || error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
