import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCategory,
  fetchCategoryProducts,
} from "../redux/slices/categorySlice";

const TrendingNow = ({ theme }) => {
  const [trending, setTrending] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();
        if (Array.isArray(data.products)) {
          const shuffled = data.products.sort(() => 0.5 - Math.random());
          setTrending(shuffled.slice(0, 10));
        } else setTrending([]);
      } catch (err) {
        console.log(err);
        setTrending([]);
      }
    };
    fetchTrending();
  }, []);

  const handleProductClick = (product) => {
    const query = product.category || product.brand || product.name;
    dispatch(setCategory(query));
    dispatch(fetchCategoryProducts(query));
    navigate(`/categories?name=${encodeURIComponent(query)}`);
  };

  return (
    <section className="mt-20 px-6 pb-16">
      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl font-extrabold mb-10 text-center tracking-tight ${
          theme === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        Trending Now
      </motion.h3>

      {trending.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {trending.map((item, i) => (
            <motion.div
              key={item._id || i}
              onClick={() => handleProductClick(item)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group backdrop-blur-lg border shadow-lg hover:shadow-2xl transition-all duration-500
                ${
                  theme === "dark"
                    ? "bg-gray-900/60 border-gray-700 hover:shadow-red-500/30"
                    : "bg-white/70 border-gray-200 hover:shadow-red-400/30"
                }`}
            >
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-all duration-700`}
              ></div>

              {/* Product Info */}
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h4 className="font-semibold text-sm md:text-base line-clamp-1">
                  {item.name?.slice(0, 22) || "Product"}
                </h4>
                <p className="text-xs md:text-sm opacity-90 mt-1">
                  ₹{(item.price || Math.random() * 100 + 10).toFixed(2)}
                </p>
              </div>

              {/* Floating Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-red-500/20 opacity-0 group-hover:opacity-100 blur-md transition-all duration-700 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              ></motion.div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg"
        >
          No trending products found !!!!!
        </motion.p>
      )}
    </section>
  );
};

export default TrendingNow;
