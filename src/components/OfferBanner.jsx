import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const OfferBanner = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-20 px-6"
    >
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
        {/*  Background Image */}
        <img
          src=""
          alt="Offer Banner"
          className="w-full h-64 object-cover opacity-80 dark:opacity-50"
        />

        {/*  Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent dark:from-black/70 dark:via-black/40 dark:to-transparent" />

        {/*  Offer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 drop-shadow-lg"
          >
            Mega Festive Sale
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 mb-6"
          >
            Up to{" "}
            <span className="text-red-600 dark:text-red-400 font-bold">
              60% OFF
            </span>{" "}
            on top brands!
          </motion.p>

          {/*  Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/category/offers"
              className="px-6 py-3 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 
              shadow-md hover:shadow-red-500/40 transition-all duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default OfferBanner;
