import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HeroSlider = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const banner = {
    image:
      "https://buysellgraphic.com/images/graphic_preview/thumb/ecommerce_website_banner_template_customers_sketch_flat_design_55246.jpg",
    title: "Shop Smart, Live Better ",
    subtitle: "Discover the latest deals and exclusive offers today!",
  };

  return (
    <div className="pt-20">
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden rounded-3xl mx-4 mt-4 shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={banner.image}
            alt={banner.title}
            onError={(e) =>
              (e.target.src =
                "https://buysellgraphic.com/images/graphic_preview/thumb/ecommerce_website_banner_template_customers_sketch_flat_design_55246.jpg")
            }
            className="w-full h-full object-cover rounded-3xl"
            style={{
              transform: `translateY(${offsetY * 0.1}px)`,
            }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl" />

        <div className="absolute inset-0 flex flex-col justify-center items-start md:items-center text-left md:text-center px-10 md:px-20 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold mb-3 text-white drop-shadow-lg"
          >
            {banner.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl"
          >
            {banner.subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md hover:shadow-red-500/40 transition-all duration-300 backdrop-blur-md"
          >
            Shop Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default HeroSlider;
