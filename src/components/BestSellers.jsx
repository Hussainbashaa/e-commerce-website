import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  setCategory,
  fetchCategoryProducts,
} from "../redux/slices/categorySlice";
import { useTheme } from "../context/ThemeContext";

const BestSellers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // THEME COLORS
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-300" : "text-black";
  const borderColor = isDark ? "border-neutral-700" : "border-gray-300";
  const cardBg = isDark ? "bg-neutral-900" : "bg-white";

  const products = [
    {
      id: 1,
      title: "Gaming Laptop",
      img: "https://tse2.mm.bing.net/th/id/OIP.Vb6TQujF9-5WQBHaBH5kjAHaEL?pid=Api&P=0&h=180",
    },
    {
      id: 2,
      title: "Leather Backpack",
      img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Sports Watch",
      img: "https://tse2.mm.bing.net/th/id/OIP.V-3OYb7WyP-WydWcVhX3bwHaEK?pid=Api&P=0&h=180",
    },
    {
      id: 4,
      title: "Wireless Keyboard",
      img: "https://tse4.mm.bing.net/th/id/OIP.ItQ4bn_bcKC9TV37n2WXEQHaEA?pid=Api&P=0&h=180",
    },
  ];

  const handleClick = (itemTitle) => {
    dispatch(setCategory(itemTitle));
    dispatch(fetchCategoryProducts(itemTitle));
    navigate(`/categories?name=${encodeURIComponent(itemTitle)}`);
  };

  return (
    <section className="mt-20 px-6">
      {/* TITLE */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl font-bold text-center mb-10 ${textColor}`}
      >
        Best Sellers
      </motion.h3>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => handleClick(p.title)}
            className={`
              relative rounded-2xl cursor-pointer overflow-hidden shadow 
              ${cardBg} ${borderColor} border
            `}
          >
            {/* IMAGE */}
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-56 object-cover rounded-t-2xl"
            />

            {/* DETAILS */}
            <div className="p-4 text-center">
              <h4 className={`font-semibold text-lg ${textColor}`}>
                {p.title}
              </h4>

              <p className={`text-sm mt-1 ${subTextColor}`}>Click to explore</p>

              {/* VIEW MORE BUTTON */}
              <button
                className={`
                  mt-3 px-4 py-1.5 text-sm font-semibold rounded-full 
                  border ${borderColor} 
                  ${textColor}
                `}
              >
                View More
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
