import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCategory,
  fetchCategoryProducts,
} from "../redux/slices/categorySlice";
import { useTheme } from "../context/ThemeContext";

const CategoryChips = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const data = [
      {
        title: "Smartphones",
        img: "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Shoes",
        img: "https://images.unsplash.com/photo-1528701800489-20be3c2f5b13?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Accessories",
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Watches",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Laptops",
        img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Cameras",
        img: "https://images.unsplash.com/photo-1519183071298-a2962eadcdb2?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Gaming",
        img: "https://images.unsplash.com/photo-1606813909027-0b8eebdb58b1?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Books",
        img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      },
    ];
    setCategories(data);
  }, []);

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category));
    dispatch(fetchCategoryProducts(category));
    navigate(`/categories?name=${category}`);
  };

  return (
    <section className="mt-12 px-6">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl font-semibold text-center mb-10 ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Shop by Category
      </motion.h3>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => handleCategoryClick(cat.title)}
            className={`cursor-pointer rounded-2xl overflow-hidden w-40 h-44 flex flex-col items-center justify-between p-4 transition-all duration-300 border ${
              theme === "dark"
                ? "bg-[#111]/60 border-gray-700 hover:bg-[#1a1a1a]/80 hover:border-gray-500"
                : "bg-[#f7f7f7]/80 border-gray-300 hover:bg-[#eaeaea] hover:border-gray-400"
            }`}
          >
            <img
              src={cat.img}
              alt={cat.title}
              className="w-24 h-24 object-cover rounded-xl mb-3"
            />
            <span
              className={`font-medium text-sm tracking-wide ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {cat.title}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryChips;
