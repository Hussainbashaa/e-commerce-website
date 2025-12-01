import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, LogOut, Edit } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`https://e-commerce-shop-rho-six.vercel.app/api/users/${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();

        const userData =
          typeof data?.user === "object"
            ? data.user
            : Array.isArray(data?.users)
            ? data.users[0]
            : null;

        if (!userData) toast.error("User not found");

        setUser(userData);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, [userId]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/");
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <p className="animate-pulse text-lg">Loading profile...</p>
      </div>
    );
  }

  const renderData = (label, value, icon) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {icon}
        <span>{value || "Not Available"}</span>
      </div>

      {!value && (
        <button
          onClick={() => navigate("/update-profile")}
          className={`text-xs px-3 py-1 rounded-md font-semibold ${
            isDark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <Edit size={14} /> Add Info
        </button>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen flex justify-center items-center px-6 py-12 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 border ${
          isDark ? "bg-[#0f0f0f] border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-400 shadow-xl">
            <img
              src={
                user.image ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              onError={(e) =>
                (e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png")
              }
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-sm opacity-70">{user.email}</p>
        </div>

        <hr
          className={`my-6 ${isDark ? "border-gray-700" : "border-gray-300"}`}
        />

        <div className="space-y-3">
          {renderData("Name", user.name, <User size={18} />)}
          {renderData("Email", user.email, <Mail size={18} />)}
          {renderData("Phone", user.phone, <Phone size={18} />)}
          {renderData("Address", user.address, <MapPin size={18} />)}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          className={`mt-8 w-full py-3 rounded-lg font-semibold shadow flex items-center justify-center gap-2 ${
            isDark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <LogOut size={18} /> Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Profile;
