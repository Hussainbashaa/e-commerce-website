import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Fetch products dynamically and randomize them
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(
          "https://e-commerce-shop-rho-six.vercel.app/api/products"
        );
        const data = await res.json();

        if (data?.products) {
          // Shuffle and take 12 random items
          const shuffled = data.products
            .sort(() => 0.5 - Math.random())
            .slice(0, 12);

          const formatted = shuffled.map((item) => ({
            id: item._id,
            title: item.title,
            price: item.price,
            img: Array.isArray(item.images)
              ? item.images[0]
              : item.thumbnail || "/placeholder.jpg",
            category: item.category,
          }));

          setNewItems(formatted);
        }
      } catch (err) {
        console.error(" Failed to fetch new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 dark:text-gray-400">
        Loading new arrivals...
      </div>
    );

  return (
    <section className="mt-12 px-6 pb-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h3
          className={`text-3xl md:text-4xl font-extrabold mb-3 ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          New Arrivals
        </h3>
        <p
          className={`text-base ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Discover fresh new products — randomly selected just for you!
        </p>
      </div>

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        {newItems.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => handleProductClick(item.id)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`cursor-pointer rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-500 group ${
              theme === "dark"
                ? "bg-[#111]/80 border-gray-700 hover:bg-[#1a1a1a]"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            {/*  Product Image */}
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/*  Product Info */}
            <div className="p-4 flex flex-col gap-2">
              <h4
                className={`text-lg font-semibold truncate ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {item.title}
              </h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ₹{item.price?.toLocaleString() || "—"}
              </p>
            </div>

            {/* Hover Action */}
            <div
              className={`absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-center py-3 font-medium text-sm ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              View Details →
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default NewArrivals;
