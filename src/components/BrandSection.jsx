import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  setCategory,
  fetchCategoryProducts,
} from "../redux/slices/categorySlice";
import { useTheme } from "../context/ThemeContext";

const BrandsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const brands = [
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      name: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    },
    {
      name: "Adidas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    },
    {
      name: "Sony",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_logo.svg",
    },
    {
      name: "Samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    },
    {
      name: "Puma",
      logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Puma_AG.svg",
    },
    {
      name: "OnePlus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/OnePlus_logo.svg",
    },
    {
      name: "Gucci",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Gucci_Logo.svg",
    },
  ];

  const handleBrandClick = (brandName) => {
    dispatch(setCategory(brandName));
    dispatch(fetchCategoryProducts(brandName));
    navigate(`/categories?name=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="mt-12 px-6 pb-12">
      <div className="text-center mb-12">
        <h3
          className={`text-3xl md:text-4xl font-bold mb-3 ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Popular Brands
        </h3>
        <p
          className={`text-base ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Shop top brands trusted worldwide for quality and innovation.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 place-items-center"
      >
        {brands.map((brand, i) => (
          <motion.div
            key={i}
            onClick={() => handleBrandClick(brand.name)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-[180px] h-[110px] rounded-xl border flex flex-col items-center justify-center cursor-pointer group transition-all duration-500 ${
              theme === "dark"
                ? "bg-[#111]/70 border-gray-700 hover:bg-[#1a1a1a] hover:border-gray-500 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            }`}
          >
            {/* Brand Logo */}
            <img
              src={brand.logo}
              alt={brand.name}
              className={`w-16 h-10 object-contain transition-all duration-500 ${
                theme === "dark"
                  ? "invert opacity-80 group-hover:opacity-100"
                  : "opacity-90 group-hover:opacity-100"
              }`}
            />

            {/* Brand Name */}
            <p
              className={`mt-3 text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {brand.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BrandsSection;
