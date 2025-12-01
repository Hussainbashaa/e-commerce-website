import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import FeaturedProducts from "../components/FeaturedProducts";
import OfferBanner from "../components/OfferBanner";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";
import Testimonials from "../components/Testimonials";
import BrandsSection from "../components/BrandSection";
import CategoryShowcase from "../components/CategoryShowcase";

const Home = () => {
  const { theme } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const timer = setTimeout(() => setShowPopup(true), 10000);
      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) setShowPopup(false);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const banner = {
    image:
      "https://static.vecteezy.com/system/resources/previews/004/299/835/original/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg",
    title: "Shop Smart, Live Better 🛍",
    subtitle: "Discover the latest deals and exclusive offers today!",
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#1a1a1a] text-gray-100"
          : "bg-gradient-to-b from-[#fafafa] via-[#f2f2f2] to-[#e6e6e6] text-gray-900"
      }`}
    >
      <section className="relative h-[80vh] md:h-[90vh] overflow-hidden rounded-none md:rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
        <motion.img
          src={banner.image}
          alt={banner.title}
          className="absolute inset-0 w-full h-full object-contain md:object-cover"
          style={{ transform: `translateY(${offsetY * 0.1}px)` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/1600x800.png?text=E-Commerce+Banner")
          }
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="relative z-10 px-6 md:px-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-5 text-white drop-shadow-lg"
          >
            {banner.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-gray-200 mb-8 text-lg md:text-xl leading-relaxed"
          >
            {banner.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/category"
              className="px-8 py-3 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-300"
            >
              Shop Now
            </Link>
            <Link
              to="/newarrivals"
              className="px-8 py-3 rounded-full text-lg font-semibold border border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              Explore New Arrivals
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <NewArrivals />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <BrandsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CategoryShowcase />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <BestSellers />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Testimonials />
        </motion.div>
      </div>

      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`border rounded-2xl shadow-2xl p-8 w-full max-w-md text-center backdrop-blur-xl ${
              theme === "dark"
                ? "bg-[#111]/80 border-gray-700 text-gray-200"
                : "bg-[#f5f5f5]/80 border-gray-300 text-gray-900"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              Hey there! Please log in or sign up
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  theme === "dark"
                    ? "bg-[#1a1a1a] hover:bg-[#222] text-gray-100"
                    : "bg-[#e6e6e6] hover:bg-[#dcdcdc] text-gray-900"
                }`}
                onClick={() => setShowPopup(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-6 py-2 rounded-lg font-semibold transition-all border ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-[#1a1a1a] text-gray-300"
                    : "border-gray-400 hover:bg-[#eaeaea] text-gray-800"
                }`}
                onClick={() => setShowPopup(false)}
              >
                Sign Up
              </Link>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
