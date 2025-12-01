// ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-300" : "text-black";
  const borderColor = isDark ? "border-white" : "border-black";
  const bgColor = isDark ? "bg-black" : "bg-white";

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  // FETCH PRODUCT
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(
          `https://e-commerce-shop-rho-six.vercel.app/api/products/${id}`
        );
        if (!res.ok) {
          setServerError("Failed to load product");
          return;
        }

        const data = await res.json();
        if (!data.product) {
          setServerError("Product not found");
          return;
        }

        setProduct(data.product);
        fetchRecommendations(data.product.category);
      } catch {
        setServerError("Network error");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const fetchRecommendations = async (category) => {
    try {
      const res = await fetch(
        `https://e-commerce-shop-rho-six.vercel.app/api/products`
      );
      const data = await res.json();

      const similar = (data.products || []).filter(
        (p) => p.category === category && p._id !== id
      );

      setRecommendations(similar.slice(0, 6));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.title} added`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  if (loading)
    return <div className={`py-20 text-center ${textColor}`}>Loading…</div>;

  if (serverError)
    return (
      <div className="py-20 text-center text-red-500 font-semibold">
        {serverError}
      </div>
    );

  if (!product)
    return <div className={`py-20 text-center ${textColor}`}>Not Found</div>;

  // MAIN UI
  return (
    <div
      className={`min-h-screen pt-28 pb-20 px-6 md:px-12 ${bgColor} ${textColor}`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE BOX */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-xl border p-4 flex items-center justify-center ${
            isDark
              ? "bg-neutral-900 border-neutral-700"
              : "bg-white border-gray-300"
          }`}
        >
          <img
            src={product.images?.[0] || product.thumbnail}
            className="object-contain "
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h1 className={`text-3xl font-bold ${textColor}`}>{product.title}</h1>

          <p className={`${subTextColor}`}>
            Brand: <span className="font-semibold">{product.brand}</span>
          </p>

          <p className={`${subTextColor}`}>
            Category: <span className="capitalize">{product.category}</span>
          </p>

          <p className={`text-xl font-bold ${textColor}`}>₹{product.price}</p>

          <p className={`${subTextColor}`}>{product.description}</p>

          <p className={`${subTextColor}`}>Rating: {product.rating || "—"}</p>

          <p className={`${subTextColor}`}>Stock: {product.stock} available</p>

          <button
            onClick={handleAddToCart}
            className={`
              w-full md:w-auto px-6 py-3 rounded-xl font-semibold cursor-pointer
              bg-white text-black border border-black
              ${isDark ? "bg-white text-black border-white" : ""}
            `}
          >
            <ShoppingCart className="inline mr-2" size={18} />
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className={`
              w-full md:w-auto px-6 py-3 rounded-xl mt-2 font-semibold cursor-pointer
              bg-white text-black border border-black
              ${
                isDark
                  ? "bg-transparent text-black border-white"
                  : " text-black border-black"
              }
            `}
          >
            Buy Now
          </button>
        </motion.div>
      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className={`text-xl font-bold ${textColor}`}>
            Recommended for you
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-4">
            {recommendations.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/product/${r._id}`)}
                className={`
                  rounded-xl border p-3 cursor-pointer shadow
                  ${
                    isDark
                      ? "bg-neutral-900 border-neutral-700"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                <img
                  src={r.images?.[0] || r.thumbnail}
                  className="w-full h-40 object-cover rounded"
                />

                <p className={`mt-2 font-semibold ${textColor}`}>{r.title}</p>
                <p className={`text-sm ${subTextColor}`}>₹{r.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
