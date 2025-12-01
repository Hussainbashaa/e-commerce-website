import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      const timer = setTimeout(() => setShowPopup(true), 10000); 
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-3xl shadow-2xl p-8 w-[90%] max-w-sm text-center"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Welcome!!!...
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Log in or sign up to start shopping with us!
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setShowPopup(false)}
                className="bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-center font-semibold transition-all shadow-md hover:shadow-red-400/30"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setShowPopup(false)}
                className="border border-red-500 text-red-600 dark:text-red-400 py-2.5 rounded-lg text-center font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              >
                Sign Up
              </Link>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-all"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthPopup;
