import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Category = ({ theme }) => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(
          `https://e-commerce-shop-rho-six.vercel.app/api/product/search?query=${name}`
        );
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [name]);

  return (
    <div
      className={`min-h-screen pt-28 pb-16 px-6 md:px-10 transition-all duration-700 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#1a1a1a] text-gray-100"
          : "bg-gradient-to-b from-[#fafafa] via-[#f2f2f2] to-[#e6e6e6] text-gray-900"
      }`}
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
          {name.charAt(0).toUpperCase() + name.slice(1)} Collection
        </h2>
        <p
          className={`text-base ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore the latest and trending {name} products curated for you ✨
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">
            Loading products...
          </p>
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          No products found!!!
        </p>
      )}

      {/*  Product Grid */}
      {!loading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {products.map((p, index) => (
            <motion.div
              key={p._id || p.id || index}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/product/${p._id || p.id}`)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer backdrop-blur-lg border shadow-lg hover:shadow-2xl transition-all group ${
                theme === "dark"
                  ? "bg-[#111]/80 border-gray-800 hover:bg-[#1a1a1a]"
                  : "bg-white/80 border-gray-200 hover:bg-white"
              }`}
            >
              {/*  Product Image */}
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={
                    p.images?.[0] ||
                    p.thumbnail ||
                    p.image ||
                    "/placeholder.jpg"
                  }
                  alt={p.title || p.name || "Product"}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/*  Overlay with Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h4 className="font-semibold text-lg text-white truncate">
                    {p.title || p.name || "Untitled Product"}
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">
                    ₹{p.price?.toLocaleString() || "—"}
                  </p>
                </div>
              </div>

              {/*  Hover Info */}
              <div
                className={`absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 text-center py-3 text-sm font-medium ${
                  theme === "dark"
                    ? "bg-violet-600 text-white"
                    : "bg-violet-500 text-white"
                }`}
              >
                View Details →
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Category;
