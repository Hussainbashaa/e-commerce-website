import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const reduxCart = useSelector((state) => state.cart.items);

  const [localCart, setLocalCart] = useState([]);

  const getUserCartKey = () => {
    const userId = localStorage.getItem("userId");
    return userId ? `cart_${userId}` : "cart_guest";
  };

  useEffect(() => {
    const cartKey = getUserCartKey();
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || {
      items: [],
    };
    setLocalCart(storedCart.items);
  }, []);

  useEffect(() => {
    if (reduxCart) {
      setLocalCart(reduxCart);

      const cartKey = getUserCartKey();

      const totalPrice = reduxCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      localStorage.setItem(
        cartKey,
        JSON.stringify({
          items: reduxCart,
          count: reduxCart.reduce((acc, i) => acc + i.quantity, 0),
          totalPrice,
        })
      );
    }
  }, [reduxCart]);

  const totalPrice = localCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleClearCart = () => {
    dispatch(clearCart());
    setLocalCart([]);
    localStorage.clear();
  };

  if (localCart.length === 0) {
    return (
      <div
        className={`text-center mt-20 text-lg ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Your cart is empty
        <button
          onClick={() => navigate("/")}
          className={`block mx-auto mt-5 px-6 py-2 rounded-md font-medium ${
            theme === "dark" ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-6 md:px-12 pt-28 pb-16 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-10">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* CART ITEMS */}
        <div
          className={`col-span-2 rounded-2xl shadow-lg p-6 space-y-6 ${
            theme === "dark"
              ? "bg-neutral-900 border border-gray-800"
              : "bg-white border border-gray-200"
          }`}
        >
          {localCart.map((item) => {
            const img =
              item?.images?.[0] || item?.thumbnail || "/placeholder.jpg";

            // FIX: SAFE product name
            const productName = item.title || item.name || "Product";

            return (
              <motion.div
                key={item._id || item.id}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center justify-between border-b pb-6 last:border-b-0 ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {/* IMAGE + DETAILS */}
                <div className="flex items-center gap-5">
                  <img
                    src={img}
                    alt={productName}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />

                  <div>
                    <h2 className="text-lg font-semibold max-w-[200px] truncate">
                      {productName}
                    </h2>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* QTY CONTROLS */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      dispatch(removeFromCart(item._id));
                      toast.success(`${productName} removed `);
                    }}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      theme === "dark" ? "bg-neutral-800" : "bg-gray-200"
                    }`}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => {
                      dispatch(addToCart(item));
                      toast.success(`${productName} added to cart `);
                    }}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      theme === "dark" ? "bg-neutral-800" : "bg-gray-200"
                    }`}
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => {
                    dispatch(removeFromCart(item._id));
                    toast.success(`${productName} removed `);
                  }}
                  className={`px-4 py-2 rounded-md text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Remove
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div
          className={`rounded-2xl shadow-xl p-6 h-fit sticky top-28 ${
            theme === "dark"
              ? "bg-neutral-900 border border-gray-800"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-500">Free</span>
            </div>

            <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className={`w-full py-3 rounded-lg font-semibold ${
              theme === "dark" ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            Proceed to Checkout
          </button>

          <button
            onClick={handleClearCart}
            className={`mt-3 w-full py-3 rounded-lg text-sm ${
              theme === "dark"
                ? "bg-neutral-800 text-gray-300"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
