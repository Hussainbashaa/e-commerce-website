import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser(formData)).unwrap();

      toast.success(` Registration successful! Welcome ${formData.name}!`);

      if (result.token) localStorage.setItem("token", result.token);
      if (result.user)
        localStorage.setItem("user", JSON.stringify(result.user));

      console.log(" Registered user:", result);

      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Registration failed ");
      console.error(" Registration failed:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black transition-all">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-300 dark:border-gray-700">
        <h2 className="text-3xl font-semibold mb-6 text-center text-red-500">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-500 text-sm">
            {error.message || error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
