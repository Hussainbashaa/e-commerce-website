import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const getCartKey = () => {
  const userId = localStorage.getItem("userId");
  return userId ? `cart_${userId}` : "cart_guest";
};

const loadCartFromLocalStorage = () => {
  try {
    const key = getCartKey();
    const storedCart = JSON.parse(localStorage.getItem(key));
    return (
      storedCart || {
        items: [],
        count: 0,
        totalPrice: 0,
      }
    );
  } catch (err) {
    console.error(" Error loading cart:", err);
    return { items: [], count: 0, totalPrice: 0 };
  }
};

// 🔹 Save cart per user
const saveCartToLocalStorage = (state) => {
  const key = getCartKey();
  localStorage.setItem(
    key,
    JSON.stringify({
      items: state.items,
      count: state.count,
      totalPrice: state.totalPrice,
    })
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromLocalStorage(),

  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemId = newItem.id || newItem._id;

      const existingItem = state.items.find(
        (item) => item.id === itemId || item._id === itemId
      );

      if (existingItem) {
        existingItem.quantity += 1;
        toast.success(`Increased quantity of ${newItem.name}`);
      } else {
        state.items.push({
          ...newItem,
          id: itemId,
          quantity: 1,
        });
        // toast.success(`${newItem.name} added to cart `);
      }

      state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      saveCartToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === itemId || item._id === itemId
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          toast.error(`Removed one ${existingItem.name}`);
        } else {
          state.items = state.items.filter(
            (item) => item.id !== itemId && item._id !== itemId
          );
          toast.error(`${existingItem.name} removed from cart`);
        }
      }

      state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      saveCartToLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.count = 0;
      state.totalPrice = 0;
      const key = getCartKey();
      localStorage.removeItem(key);
      toast.error("Cart cleared ");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
