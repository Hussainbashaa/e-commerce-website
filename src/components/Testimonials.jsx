import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Testimonials = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // THEME COLORS
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-300" : "text-black";
  const cardBg = isDark ? "bg-neutral-900" : "bg-white";
  const borderColor = isDark ? "border-neutral-700" : "border-gray-300";
  const pageBg = isDark ? "bg-black" : "bg-gray-50";

  const reviews = [
    {
      id: 1,
      name: "Aarav",
      text: "Loved the shopping experience! Super smooth and quick delivery.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Meera",
      text: "Amazing quality and deals! My go-to site for online shopping.",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 3,
      name: "Ravi",
      text: "Customer service is top-notch. Definitely recommend!",
      img: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];

  return (
    <section className={`mt-20 px-6 pb-24 ${pageBg}`}>
      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl font-extrabold mb-12 text-center ${textColor}`}
      >
        What Our Customers Say
      </motion.h3>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {reviews.map((rev, i) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`p-6 rounded-2xl shadow border ${cardBg} ${borderColor}`}
          >
            {/* Quote Icon */}
            <FaQuoteLeft
              className={`text-3xl mb-4 opacity-50 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            />

            {/* Review Text */}
            <p className={`italic leading-relaxed mb-6 ${subTextColor}`}>
              "{rev.text}"
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3 mt-auto">
              <img
                src={rev.img}
                alt={rev.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h4 className={`font-semibold ${textColor}`}>{rev.name}</h4>
                <p className={`text-sm ${subTextColor}`}>Verified Buyer</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
