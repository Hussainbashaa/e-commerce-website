import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const CategoryShowcase = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();

        const products = data?.products || [];
        if (products.length) {
          const grouped = products.reduce((acc, item) => {
            const cat = item.category || "Other";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {});

          const formatted = Object.keys(grouped).map((key) => ({
            title: key,
            banner: getBannerImage(key),
            items: grouped[key],
          }));

          const sorted = formatted.sort((a, b) => {
            const A = a.title.toLowerCase();
            const B = b.title.toLowerCase();

            const otherA =
              A.includes("other") ||
              A.includes("misc") ||
              A.includes("uncategor");
            const otherB =
              B.includes("other") ||
              B.includes("misc") ||
              B.includes("uncategor");

            if (otherA && !otherB) return 1;
            if (!otherA && otherB) return -1;
            return A.localeCompare(B);
          });

          setCategories(sorted);
        }
      } catch (err) {
        console.error("❌ Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Random Offer
  const getRandomOffer = () => {
    return Math.floor(Math.random() * 60) + 10;
  };

  // Better animated banners
  const getBannerImage = (category) => {
    const banners = {
      smartphones: {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        animation: "slowZoom 12s ease-in-out infinite alternate",
      },
      laptops: {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        animation: "slowPan 15s linear infinite",
      },
      "mens-shoes": {
        url: "https://images.unsplash.com/photo-1600180758890-6f62d7d2d4d8",
        animation: "slowZoom 12s ease-in-out infinite alternate",
      },
      furniture: {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
        animation: "slowZoom 18s ease-in-out infinite",
      },
      fragrances: {
        url: "https://images.unsplash.com/photo-1596464716127-f2a82984de30",
        animation: "slowZoom 10s ease-in-out infinite",
      },
      skincare: {
        url: "https://images.unsplash.com/photo-1607083205185-e6cf48245fdd",
        animation: "slowPan 14s linear infinite",
      },
      groceries: {
        url: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
        animation: "slowPan 14s linear infinite",
      },
      default: {
        url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
        animation: "slowZoom 14s ease-in-out infinite alternate",
      },
    };

    return banners[category] || banners.default;
  };

  const handleShowMore = (cat) => {
    navigate(`/categories?name=${encodeURIComponent(cat)}`);
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Loading…
      </div>
    );

  return (
    <section className="px-6 pb-20 space-y-20">
      <style>
        {`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        @keyframes slowPan {
          from { transform: scale(1.15) translateX(0); }
          to { transform: scale(1.15) translateX(-20%); }
        }
        `}
      </style>

      {categories.map((cat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          {/* Category Title */}
          <div className="flex justify-between items-center">
            <div>
              <h3
                className={`text-2xl font-extrabold ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {cat.title}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Explore trending {cat.title.replace("-", " ")} products
              </p>
            </div>

            <button
              onClick={() => handleShowMore(cat.title)}
              className={`text-sm font-semibold underline-offset-4 hover:underline ${
                isDark ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Show More →
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative w-full h-56 rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src={cat.banner.url}
              style={{ animation: cat.banner.animation }}
              className="w-full h-full object-cover opacity-90"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
              <h4 className="text-3xl font-bold text-white">
                {cat.title.replace("-", " ")} Mega Sale 🎉
              </h4>
              <p className="text-gray-200 mt-1">
                Up to 40% OFF — Limited Time!
              </p>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cat.items.slice(0, 8).map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/product/${item._id}`)}
                className={`rounded-2xl overflow-hidden border shadow-sm cursor-pointer group ${
                  isDark
                    ? "bg-[#111] border-gray-700 hover:bg-[#1a1a1a]"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="relative h-52 overflow-hidden">
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[11px] px-2 py-1 rounded shadow">
                    {getRandomOffer()}% OFF
                  </span>

                  <img
                    src={item.images?.[0] || item.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all"
                  />
                </div>

                <div className="p-4">
                  <h4
                    className={`font-semibold truncate ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {item.title}
                  </h4>

                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    ₹{item.price}
                  </p>
                </div>

                <div
                  className={`absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 text-center py-3 text-sm font-medium transition-all ${
                    isDark
                      ? "bg-gray-800 text-gray-100"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  View Details →
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default CategoryShowcase;
