import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to view your orders.");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://e-commerce-shop-rho-six.vercel.app/api/user/orders",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
          }
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        toast.error("Failed to load orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Loading
  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen text-lg ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Loading your orders...
      </div>
    );
  }

  // Empty
  if (orders.length === 0) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <p className="text-lg mb-3">You haven't placed any orders yet </p>

        <button
          onClick={() => navigate("/")}
          className={`mt-3 px-6 py-2 rounded-md font-medium transition-all ${
            theme === "dark"
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-20 px-6 md:px-12 transition-colors duration-700 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-12"
      >
        My Orders
      </motion.h2>

      <div className="max-w-5xl mx-auto space-y-8">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className={`rounded-2xl border shadow-md p-6 transition-all hover:shadow-xl ${
              theme === "dark"
                ? "bg-neutral-900 border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Order #{index + 1}</h3>
              <span className="text-sm opacity-70">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div
              className={`divide-y ${
                theme === "dark" ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {(order.items || []).map((item, i) => {
                const img =
                  (item.images && item.images[0]) ||
                  item.thumbnail ||
                  item.image ||
                  "/placeholder.jpg";

                const productId =
                  item?.productId?._id || item?.productId || item?._id;

                return (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-3 gap-4 cursor-pointer rounded-md transition-all ${
                      theme === "dark"
                        ? "hover:bg-neutral-800"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      if (!productId) {
                        toast.error("Product not found");
                        return;
                      }
                      navigate(`/product/${productId}`);
                    }}
                  >
                    <div className="flex items-center gap-3 w-3/4">
                      <img
                        src={img}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md border border-gray-300 dark:border-gray-700"
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <span className="font-medium">
                      ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 text-sm opacity-90 space-y-1">
              <p>
                <strong>Total:</strong> ₹{order.totalPrice?.toFixed(2)}
              </p>
              <p>
                <strong>Address:</strong> {order.deliveryAddress || "N/A"}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
              </p>

              {order.payment?.transactionId && (
                <p>
                  <strong>Transaction ID:</strong> {order.payment.transactionId}
                </p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium">
                <strong>Status:</strong>{" "}
                <span className="font-semibold opacity-90">
                  {order.status || "Pending"}
                </span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
