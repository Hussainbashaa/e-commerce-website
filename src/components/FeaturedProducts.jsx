import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  setCategory,
  fetchCategoryProducts,
} from "../redux/slices/categorySlice";
import { useTheme } from "../context/ThemeContext";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const products = [
    {
      id: 1,
      title: "Smartphones",
      img: "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=600&q=80",
      desc: "Latest flagship models with unbeatable performance.",
    },
    {
      id: 2,
      title: "Laptops",
      img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80",
      desc: "Portable powerhouses for work and play.",
    },
    {
      id: 3,
      title: "Smartwatches",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      desc: "Track health, time, and notifications in style.",
    },
    {
      id: 4,
      title: "Headphones",
      img: "https://images.unsplash.com/photo-1518444021400-57e6f3b0e3b7?auto=format&fit=crop&w=600&q=80",
      desc: "Immersive sound and next-level comfort.",
    },
    {
      id: 5,
      title: "Gaming",
      img: "https://images.unsplash.com/photo-1606813909027-0b8eebdb58b1?auto=format&fit=crop&w=600&q=80",
      desc: "Consoles and gear for ultimate performance.",
    },
    {
      id: 6,
      title: "Cameras",
      img: "https://images.unsplash.com/photo-1519183071298-a2962eadcdb2?auto=format&fit=crop&w=600&q=80",
      desc: "Capture memories with stunning clarity.",
    },
  ];

  const handleClick = (category) => {
    dispatch(setCategory(category));
    dispatch(fetchCategoryProducts(category));
    navigate(`/categories?name=${encodeURIComponent(category)}`);
  };

  return (
    <section className="mt-12 px-6">
      <div className="text-center mb-12">
        <h3
          className={`text-3xl md:text-4xl font-extrabold mb-3 ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Featured Categories
        </h3>
        <p
          className={`text-base ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore top categories loved by our customers.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            onClick={() => handleClick(p.title)}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 group shadow-sm hover:shadow-xl ${
              theme === "dark"
                ? "bg-[#111]/80 border-gray-700 hover:bg-[#1a1a1a]/90"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>

            <div className="p-5 flex flex-col justify-between h-[130px]">
              <h4
                className={`text-lg font-semibold mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {p.title}
              </h4>
              <p
                className={`text-sm line-clamp-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {p.desc}
              </p>

              <button
                className={`mt-4 py-2 text-sm rounded-lg font-medium border transition-all duration-300 ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-800 hover:bg-gray-100"
                }`}
              >
                Shop Now →
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
