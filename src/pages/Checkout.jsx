import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { placeOrder, resetOrderState } from "../redux/slices/orderSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", name: "" });

  // order slice state
  const orderStatus = useSelector((s) => s.orders.status);
  const orderError = useSelector((s) => s.orders.error);

  // Load Cart
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const key = userId ? `cart_${userId}` : "cart_guest";

    try {
      const storedCart = JSON.parse(localStorage.getItem(key)) || { items: [] };
      setCartItems(storedCart.items || []);
      setTotalPrice(storedCart.totalPrice || 0);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  }, []);

  useEffect(() => {
    if (orderStatus === "succeeded") {
      toast.success(" Order placed successfully!");
      dispatch(resetOrderState());
      navigate("/orders");
    } else if (orderStatus === "failed" && orderError) {
      toast.error(orderError);
    }
  }, [orderStatus, orderError]);

  const handleOrder = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      toast.error("Please log in before placing an order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!!");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address!");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.title || item.name,
        price: item.price,
        quantity: item.quantity,
        image:
          item.image ||
          (Array.isArray(item.images) ? item.images[0] : null) ||
          item.thumbnail ||
          "/placeholder.jpg",
      })),
      totalAmount: totalPrice,
      deliveryAddress,
      paymentMethod,
      upiId: paymentMethod === "UPI" ? upiId : "",
      cardDetails: paymentMethod === "Card" ? cardDetails : {},
    };

    dispatch(placeOrder(orderData));
  };

  return (
    <div
      className={`min-h-screen py-20 px-6 md:px-12 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-10"
      >
        Checkout
      </motion.h2>

      {cartItems.length === 0 ? (
        <div
          className={`text-center text-lg ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Your cart is empty
          <button
            onClick={() => navigate("/")}
            className={`block mx-auto mt-5 px-6 py-2 rounded-md ${
              theme === "dark" ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div
          className={`max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 rounded-2xl shadow-lg p-8 ${
            theme === "dark"
              ? "bg-neutral-900 border border-gray-800"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold">Your Order</h3>

            <ul
              className={`divide-y ${
                theme === "dark" ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {cartItems.map((item) => (
                <li
                  key={item._id || item.id}
                  className="flex items-center justify-between py-3 text-sm gap-4"
                >
                  <img
                    src={
                      item.image ||
                      (Array.isArray(item.images) ? item.images[0] : null) ||
                      item.thumbnail ||
                      "/placeholder.jpg"
                    }
                    alt={item.title || item.name}
                    className="w-14 h-14 object-cover rounded-lg border"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />

                  <span className="truncate w-3/5">
                    {item.title || item.name} × {item.quantity}
                  </span>

                  <span className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="text-right text-2xl font-bold pt-4">
              Total: ₹{totalPrice.toFixed(2)}
            </h3>

            {/* Address */}
            <div className="mt-8">
              <label className="block font-semibold mb-2">
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className={`w-full p-3 rounded-xl border ${
                  theme === "dark"
                    ? "bg-neutral-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
                rows={3}
                placeholder="Enter your address..."
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Payment Details</h3>

            <div>
              <label className="block font-semibold mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full p-3 rounded-xl border ${
                  theme === "dark"
                    ? "bg-neutral-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="Card">Credit / Debit Card</option>
              </select>
            </div>

            {paymentMethod === "UPI" && (
              <div>
                <label className="block font-semibold mb-2">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    theme === "dark"
                      ? "bg-neutral-800 border-gray-700"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  placeholder="yourname@upi"
                />
              </div>
            )}

            {paymentMethod === "Card" && (
              <div>
                <label className="block font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      cardNumber: e.target.value,
                    })
                  }
                  className={`w-full p-3 rounded-xl border ${
                    theme === "dark"
                      ? "bg-neutral-800 border-gray-700"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  placeholder="1234 5678 9012 3456"
                />

                <label className="block font-semibold mt-4 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, name: e.target.value })
                  }
                  className={`w-full p-3 rounded-xl border ${
                    theme === "dark"
                      ? "bg-neutral-800 border-gray-700"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOrder}
              className={`w-full py-3 rounded-xl font-semibold text-lg ${
                theme === "dark" ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              {orderStatus === "loading" ? "Placing order..." : "Place Order"}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
