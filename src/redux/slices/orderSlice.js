import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { clearCart } from "./cartSlice";

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Not authenticated");

      const res = await axios.post(
        "https://e-commerce-shop-rho-six.vercel.app/api/user/orders",
        orderData,
        {
          headers: {
            Authorization: token.startsWith("Bearer")
              ? token
              : `Bearer ${token}`,
          },
        }
      );

      const userId = localStorage.getItem("userId");
      const cartKey = userId ? `cart_${userId}` : "cart_guest";
      localStorage.removeItem(cartKey);
      dispatch(clearCart());

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Network error");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    order: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetOrderState(state) {
      state.order = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload.order;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
