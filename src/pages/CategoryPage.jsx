import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryProducts } from "../redux/slices/categorySlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // THEME-BASED COLORS
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-300" : "text-black";
  const cardBg = isDark ? "bg-neutral-900" : "bg-white";
  const borderColor = isDark ? "border-neutral-700" : "border-gray-300";
  const pageBg = isDark ? "bg-black" : "bg-gray-50";

  const category = new URLSearchParams(location.search).get("name");
  const { items, status, error } = useSelector((state) => state.category);

  useEffect(() => {
    if (category) {
      dispatch(fetchCategoryProducts(category));
    }
  }, [category, dispatch]);

  return (
    <div className={`min-h-screen px-10 py-24 ${pageBg}`}>
      {status === "loading" && <p className={`${subTextColor}`}>Loading...</p>}

      {status === "failed" && <p className="text-red-500">{error}</p>}

      {items?.length === 0 && status === "succeeded" && (
        <p className={`${subTextColor}`}>No products found!!!</p>
      )}

      {items?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
              className={`rounded-2xl border shadow cursor-pointer overflow-hidden ${cardBg} ${borderColor}`}
            >
              <img
                src={
                  Array.isArray(item.images)
                    ? item.images[0]
                    : item.thumbnail || "/placeholder.jpg"
                }
                alt={item.title}
                className="w-full h-56 object-cover"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />

              <div className="p-5">
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>
                  {item.title || item.name}
                </h3>

                <p className={`font-semibold text-lg ${textColor}`}>
                  ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
