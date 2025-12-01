import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

const ProductCard = ({ theme }) => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  //  Fetch all products when idle
  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  //  Add to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.title} added to cart! `, {
      duration: 2000,
      position: "top-right",
    });
  };

  //  Skeleton loader
  const SkeletonCard = () => (
    <div
      className={`rounded-2xl p-5 backdrop-blur-lg animate-pulse h-[400px] flex flex-col items-center justify-between ${
        theme === "dark"
          ? "bg-gray-900/60 border border-gray-700"
          : "bg-white/60 border border-gray-200"
      }`}
    >
      <div className="flex flex-col items-center w-full">
        <div className="bg-gray-400/20 w-40 h-40 rounded-xl mb-3"></div>
        <div className="h-4 w-32 bg-gray-400/30 rounded mb-2"></div>
        <div className="h-3 w-24 bg-gray-400/20 rounded mb-2"></div>
        <div className="h-4 w-16 bg-gray-400/30 rounded"></div>
      </div>
      <div className="bg-gray-400/30 h-10 w-full rounded-xl mt-3"></div>
    </div>
  );

  //  Loading state
  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  //  Error
  if (status === "failed") {
    return (
      <p className="text-center text-red-500 text-lg font-medium mt-10">
        {error || "Failed to load products"}
      </p>
    );
  }

  //  Empty state
  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg font-medium mt-10">
        No products found !!!!!
      </p>
    );
  }

  //  Render all products
  return (
    <section className="px-6 py-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl font-bold text-center mb-10 ${
          theme === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        Popular Products
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((product, i) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`rounded-2xl p-5 shadow-md relative overflow-hidden backdrop-blur-md border cursor-pointer group h-[420px]
              ${
                theme === "dark"
                  ? "bg-gray-900/70 border-gray-700 hover:shadow-red-500/20"
                  : "bg-white/70 border-gray-200 hover:shadow-red-400/20"
              } transition-all duration-500`}
          >
            <div className="relative">
              <img
                src={
                  Array.isArray(product.images)
                    ? product.images[0]
                    : product.thumbnail || "/placeholder.jpg"
                }
                onMouseOver={(e) => {
                  if (Array.isArray(product.images) && product.images[1]) {
                    e.currentTarget.src = product.images[1];
                  }
                }}
                onMouseOut={(e) => {
                  if (Array.isArray(product.images) && product.images[0]) {
                    e.currentTarget.src = product.images[0];
                  }
                }}
                alt={product.title}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
                className="rounded-xl w-40 h-40 object-cover mx-auto mb-3 transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
            </div>

            {/*  Product Info */}
            <div className="flex flex-col items-center text-center">
              <h3
                className={`text-lg font-semibold line-clamp-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.title}
              </h3>

              <p
                className={`text-sm mt-1 line-clamp-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {product.description?.slice(0, 60) ||
                  "No description available."}
              </p>

              <p
                className={`text-lg font-bold mt-2 ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                ₹{product.price}
              </p>

              <p
                className={`text-xs mt-1 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {product.rating} | {product.brand}
              </p>
            </div>

            {/*  Add to Cart Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAddToCart(product)}
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2
                ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                }`}
            >
              <i className="uil uil-shopping-cart-alt text-lg"></i>
              Add to Cart
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 border-2 border-red-500/30 rounded-2xl blur-sm pointer-events-none transition-all"
            ></motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductCard;
