import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults, clearSearch } from "../redux/slices/searchSlice";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const ItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const query = new URLSearchParams(location.search).get("query") || "";

  const searchState = useSelector((state) => state.search || {});
  const loading = searchState.loading;
  const error = searchState.error;

  const items =
    searchState.results || searchState.items || searchState.products || [];

  //  Fetch search results
  useEffect(() => {
    if (!query) return;
    dispatch(clearSearch());
    dispatch(fetchSearchResults(query));
  }, [query, dispatch]);

  const cardBg =
    theme === "dark"
      ? "bg-[#111]/70 border-gray-700 hover:bg-[#1a1a1a]"
      : "bg-white/70 border-gray-200 hover:bg-gray-100";

  return (
    <div
      className={`min-h-screen px-6 md:px-10 py-24 transition-all duration-500 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 h-[400px] animate-pulse border backdrop-blur-lg ${
                theme === "dark"
                  ? "bg-[#111]/40 border-gray-700"
                  : "bg-white/40 border-gray-300"
              }`}
            ></div>
          ))}
        </div>
      )}

      {error && <p className="text-red-400">{error}</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No products found!!!!
        </p>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const id = item._id || item.id;
            const img =
              Array.isArray(item.images) && item.images.length
                ? item.images[0]
                : item.image || item.thumbnail || "/placeholder.jpg";

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.4 }}
                onClick={() => navigate(`/product/${id}`)}
                className={`rounded-2xl overflow-hidden p-5 shadow-md backdrop-blur-xl border cursor-pointer h-[420px] transition-all ${cardBg}`}
              >
                <div className="relative">
                  <img
                    src={img}
                    alt={item.title || item.name}
                    className="w-40 h-40 object-cover mx-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                </div>

                <div className="flex flex-col items-center mt-4 text-center">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {item.title || item.name}
                  </h3>

                  <p
                    className={`text-sm mt-1 line-clamp-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.description || "No description available."}
                  </p>

                  <p
                    className={`text-lg font-bold mt-3 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ₹{item.price}
                  </p>

                  {item.brand && (
                    <p className="text-xs mt-1 opacity-70">{item.brand}</p>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${id}`);
                  }}
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] py-2 rounded-xl font-medium shadow-md transition-all
                    ${
                      theme === "dark"
                        ? "bg-[#222] hover:bg-[#333] text-white"
                        : "bg-gray-900 hover:bg-black text-white"
                    }
                  `}
                >
                  View Product
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ItemPage;
