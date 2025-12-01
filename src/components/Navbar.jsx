import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Search,
  ShoppingCart,
  User,
  UserCircle,
  ShoppingBag,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "../redux/slices/cartSlice";
import { fetchSearchResults } from "../redux/slices/searchSlice";
import { logout } from "../redux/slices/authSlice";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileAreaRef = useRef(null);

  const { user, token } = useSelector((state) => state.auth);
  const {
    results: searchResults = [],
    loading,
    error,
  } = useSelector((state) => state.search || {});
  const cartItems = useSelector((state) => state.cart?.items || []);

  // Load cart count
  const getUserCart = () => {
    const userId = localStorage.getItem("userId");
    const key = userId ? `cart_${userId}` : "cart";
    const storedCart = JSON.parse(localStorage.getItem(key));
    return storedCart?.items || [];
  };

  useEffect(() => {
    setCartCount(getUserCart().length);
  }, [token, cartItems]);

  //  Handle search typing
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const delay = setTimeout(() => {
        dispatch(fetchSearchResults(searchTerm));
      }, 400);
      return () => clearTimeout(delay);
    } else setShowDropdown(false);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    setShowDropdown(searchTerm.trim() && searchResults.length > 0);
  }, [searchResults, searchTerm]);

  //  Handle Enter Key
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/items?query=${encodeURIComponent(searchTerm)}`);
      setShowDropdown(false);
    }
  };

  //  Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Close profile dropdown when mouse leaves
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (
        profileAreaRef.current &&
        !profileAreaRef.current.contains(e.relatedTarget)
      ) {
        setShowProfile(false);
      }
    };
    const area = profileAreaRef.current;
    if (area) {
      area.addEventListener("mouseleave", handleMouseLeave);
      return () => area.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.title || product.name} added to cart `);
    setCartCount(getUserCart().length);
  };

  const handleLogout = () => {
    dispatch(logout());
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cart_") || k === "cart")
      .forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCartCount(0);
    toast.success("Logged out 👋");
    navigate("/");
    setShowProfile(false);
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-all duration-700 
      ${
        theme === "dark"
          ? "bg-[rgba(10,10,10,0.8)] border-gray-800 text-gray-100"
          : "bg-[rgba(245,245,245,0.8)] border-gray-300 text-gray-900"
      }`}
    >
      <header className="flex justify-between items-center px-6 md:px-10 py-4">
        {/*  Logo */}
        <Link
          to="/"
          className={`text-3xl font-extrabold tracking-tight ${
            theme === "dark"
              ? "text-white hover:text-gray-300"
              : "text-black hover:text-gray-600"
          } transition-all`}
        >
          Xplore
        </Link>

        {/*  Search Bar */}
        <div className="relative w-[18rem] md:w-[25rem]" ref={searchRef}>
          <Search
            className={`absolute left-4 top-3 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className={`pl-12 pr-4 py-2 rounded-full text-sm md:text-base border focus:outline-none focus:ring-2 w-full transition-all duration-300 backdrop-blur-sm
              ${
                theme === "dark"
                  ? "border-gray-700 bg-[#111]/60 text-white placeholder-gray-400 focus:ring-gray-500"
                  : "border-gray-300 bg-white/60 text-black placeholder-gray-600 focus:ring-gray-400"
              }`}
          />

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`absolute top-12 left-0 w-full rounded-2xl max-h-72 overflow-y-auto border shadow-xl mt-1 backdrop-blur-md
                  ${
                    theme === "dark"
                      ? "bg-[#0f0f0f]/95 border-gray-700 text-white"
                      : "bg-white/95 border-gray-200 text-black"
                  }`}
              >
                {loading ? (
                  <p className="text-center py-4 text-gray-400">Loading...</p>
                ) : error ? (
                  <p className="text-center py-4 text-gray-400">
                    Error loading results
                  </p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product._id || product.id}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all
                        ${
                          theme === "dark"
                            ? "hover:bg-[#1a1a1a]"
                            : "hover:bg-gray-100"
                        }`}
                      onClick={() => {
                        navigate(`/product/${product._id || product.id}`);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            Array.isArray(product.images)
                              ? product.images[0]
                              : product.thumbnail ||
                                product.image ||
                                "/placeholder.jpg"
                          }
                          alt={product.title || product.name}
                          className="w-10 h-10 object-cover rounded-md border border-gray-500/20"
                          onError={(e) => (e.target.src = "/placeholder.jpg")}
                        />
                        <div>
                          <p className="text-sm font-semibold line-clamp-1">
                            {product.title || product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            ₹{product.price?.toLocaleString() || "—"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          theme === "dark"
                            ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-400">
                    No results found
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/*  Right Side */}
        <div className="flex items-center gap-5 md:gap-7">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all ${
              theme === "dark"
                ? "bg-[#111] border-gray-700 hover:bg-[#1a1a1a]"
                : "bg-gray-200 border-gray-300 hover:bg-gray-300"
            }`}
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-gray-300" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              theme === "dark"
                ? "bg-[#111] hover:bg-[#1a1a1a] text-gray-100"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            <ShoppingCart size={18} />
            <span className="hidden md:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-red-600 text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/*  Profile */}
          <div
            className="relative"
            ref={profileAreaRef}
            onMouseEnter={() => setShowProfile(true)}
          >
            <button
              className={`p-2 rounded-full border transition-all ${
                theme === "dark"
                  ? "bg-[#111] border-gray-700 hover:bg-[#1a1a1a]"
                  : "bg-gray-200 border-gray-300 hover:bg-gray-300"
              }`}
            >
              <User size={18} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl border overflow-hidden transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#0f0f0f]/95 border-gray-800 text-white"
                      : "bg-white/95 border-gray-200 text-gray-900"
                  }`}
                >
                  {token ? (
                    <>
                      <div
                        className={`px-4 py-3 border-b text-sm font-medium flex items-center gap-2 ${
                          theme === "dark"
                            ? "border-gray-800"
                            : "border-gray-200"
                        }`}
                      >
                        <UserCircle className="w-5 h-5" />
                        <span>Hey!! {user?.name || "User"}</span>
                      </div>
                      <Link
                        to="/profile"
                        className={`flex items-center gap-3 px-4 py-2.5 ${
                          theme === "dark"
                            ? "hover:bg-white/10"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <UserCircle className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className={`flex items-center gap-3 px-4 py-2.5 ${
                          theme === "dark"
                            ? "hover:bg-white/10"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" /> My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-2.5 w-full text-left ${
                          theme === "dark"
                            ? "hover:bg-white/10"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={`flex items-center gap-3 px-4 py-2.5 ${
                          theme === "dark"
                            ? "hover:bg-white/10"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <LogIn className="w-4 h-4" /> Login
                      </Link>
                      <Link
                        to="/register"
                        className={`flex items-center gap-3 px-4 py-2.5 ${
                          theme === "dark"
                            ? "hover:bg-white/10"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <UserPlus className="w-4 h-4" /> Register
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </motion.nav>
  );
};

export default Navbar;
