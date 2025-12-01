import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import ItemsPage from "./pages/ItemsPage";
import CategoryPage from "./pages/CategoryPage";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import { useTheme } from "./context/ThemeContext";
import ProductDetails from "./pages/ProductDetails";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/category/:name" element={<Category theme={theme} />} />
        <Route path="/items" element={<ItemsPage theme={theme} />} />
        <Route path="/categories" element={<CategoryPage theme={theme} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Cart theme={theme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile theme={theme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Orders theme={theme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Checkout theme={theme} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#222" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      />
    </>
  );
}

export default App;
